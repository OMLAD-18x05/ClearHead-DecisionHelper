const router = require('express').Router();

const authMiddleware = require('../../middleware/authMiddleware');
const { prisma } = require('../../utils/dependencies');

const validateUserDecision = require('../../middleware/validation.middleware');
//get all raw scores for a decision
router.get('/:id/scores', authMiddleware, validateUserDecision, async (req, res, next) => {
    try {
        const decision_id = parseInt(req.params.id);
        const options = await prisma.Option.findMany({
            where: { decision_id },
            select: { id: true }
        });
        const optionIds = options.map(o => o.id);
        const scores = await prisma.Score.findMany({
            where: {
                option_id: { in: optionIds }
            },
            select: {
                option_id: true,
                criteria_id: true,
                value: true
            }
        });
        return res.status(200).json(scores);
    } catch (err) {
        next(err);
    }
});

//give value
router.post('/:id/result', authMiddleware, validateUserDecision, async (req, res, next) => {
    try {
        const { value, option_id, criteria_id } = req.body
        const scoreValue = Number(value);
        const parsedOptionId = parseInt(option_id);
        const parsedCriteriaId = parseInt(criteria_id);

        if (!Number.isFinite(scoreValue) || !parsedOptionId || !parsedCriteriaId) {
            return res.status(400).json({ msg: 'Please enter the field' })
        }

        const option = await prisma.Option.findFirst({
            where: {
                id: parsedOptionId,
                decision_id: req.decision.id
            }
        });

        const criteria = await prisma.Criteria.findFirst({
            where: {
                id: parsedCriteriaId,
                decision_id: req.decision.id
            }
        });

        if (!option || !criteria) {
            return res.status(404).json({ msg: 'Option or criteria not found' });
        }

        const existingScore = await prisma.Score.findFirst({
            where: {
                option_id: parsedOptionId,
                criteria_id: parsedCriteriaId
            }
        });

        if (existingScore) {
            await prisma.Score.update({
                where: { id: existingScore.id },
                data: { value: scoreValue }
            });
        } else {
            await prisma.Score.create({
                data: { value: scoreValue, option_id: parsedOptionId, criteria_id: parsedCriteriaId }
            });
        }

        res.status(201).json({ msg: 'Created successfully' })
    } catch (err) {
        next(err);
    }
})
//get final score
router.get('/:id/result', authMiddleware, validateUserDecision, async (req, res, next) => {
    try {
        const decision_id = parseInt(req.params.id);
        const options = await prisma.Option.findMany({
            where: { decision_id },
            include: {
                scores: {                   //get value from Scoredb of the particular option  //LEFT JOIN 
                    include:
                        { criteria: true }   //for each score ,also get its title,priority from Criteria table  //LEFT JOIN
                }
            }
        })
        const result = options.map(option =>{
            const totalWeight = option.scores.reduce((sum,s)=>sum+s.criteria.priority,0)
            const weightedScore = option.scores.reduce((sum,s)=>sum + s.value*s.criteria.priority,0)
            return {
                option : option.title,
                score : totalWeight ? weightedScore/totalWeight : 0
            }
        })
        return res.status(200).json(result);
    } catch (err) {
        next(err)
    }
})

module.exports = router;
