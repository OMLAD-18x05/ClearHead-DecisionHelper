const { prisma } = require('../../utils/dependencies');
const router = require('express').Router();

const authMiddleware = require('../../middleware/authMiddleware');
const validateUserDecision = require('../../middleware/validation.middleware');

//crete criteria
router.post('/:id/criteria', authMiddleware, validateUserDecision, async (req, res, next) => {
    try {
        const { title, priority } = req.body;
        const decision_id = parseInt(req.decision.id);// from validate user middleware
        if (!title || !priority) {
            return res.status(401).json({ msg: 'Please provide field' })
        }
        const criteriaEntry = await prisma.Criteria.create({
            data: {
                decision_id, title, priority
            }
        })
        res.status(201).json({ msg: 'Criteria Created', criteriaId: criteriaEntry.id })
    } catch (err) {
        next(err);
    }
});

//Get criteria list temporary for dev to check
router.get('/:id/criteria', authMiddleware, validateUserDecision, async (req, res, next) => {
    try {
        const decision_id = parseInt(req.params.id);
        const criterias = await prisma.Criteria.findMany({
            where: { decision_id }
        })
        res.status(200).json(criterias)
    } catch (err) {
        next(err)
    }
})

//update 
router.put('/:id/criteria/:criteriaId', authMiddleware, validateUserDecision, async (req, res, next) => {
    try {
        const criteriaId = parseInt(req.params.criteriaId);
        const decisionId = parseInt(req.params.id);

        const { priority } = req.body;

        await prisma.Criteria.update({
            where: { id: criteriaId, decision_id: decisionId },
            data: { priority }
        })
        res.status(200).json({ msg: 'priority updated' })
    } catch (err) {
        next(err);
    }
})

//delete
router.delete('/:id/criteria/:criteriaId', authMiddleware, validateUserDecision, async (req, res, next) => {
    try {
        const criteriaId = parseInt(req.params.criteriaId);
        const decisionId = parseInt(req.params.id);

        await prisma.Criteria.delete({
            where: { id: criteriaId, decision_id: decisionId }
        })
        res.status(204)
    } catch (err) {
        next(err);
    }
});

module.exports = router;