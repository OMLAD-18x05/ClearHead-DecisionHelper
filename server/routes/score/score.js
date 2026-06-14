const router = require('express').Router();

const authMiddleware = require('../../middleware/authMiddleware');
const { prisma } = require('../../utils/dependencies')
//give value
router.post('/:id/result', authMiddleware, async (req, res, next) => {
    try {
        const { value, option_id, criteria_id } = req.body
        if (!value || !option_id || !criteria_id) {
            return res.status(400).json({ msg: 'Please enter the field' })
        }
        await prisma.Score.create({
            data: { value, option_id, criteria_id }
        })
        res.status(201).json({ msg: 'Created successfully' })
    } catch (err) {
        next(err);
    }
})
//get final score
router.get('/:id/result', authMiddleware, async (req, res, next) => {
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