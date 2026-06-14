const { prisma } = require('../../utils/dependencies');
const router = require('express').Router();

const authMiddleware = require('../../middleware/authMiddleware')
const validateUserDecision = require('../../middleware/validation.middleware')
//create decision
router.post('/decisions', authMiddleware, async (req, res, next) => {
    try {
        const { title, description } = req.body;
        const user_id = req.user.userId;
        const decision = await prisma.Decision.create({
            data: {
                title, description, user_id
            }
        })
        res.status(201).json({ msg: 'Decision created' })
    } catch (err) {
        next(err);
    }
})

//Get all decisions of user
router.get('/decisions', authMiddleware, async (req, res, next) => {
    try {
        const user_id = req.user.userId;
        const decisions = await prisma.Decision.findMany({
            where: { user_id }
        })
        res.status(200).json(decisions);
    } catch (err) {
        next(err);
    }
})

//Get Single decision
router.get('/decisions/:id', authMiddleware, async (req, res, next) => {
    try {
        const user_id = req.user.userId;
        const decisionId = parseInt(req.params.id);

        const decision = await prisma.Decision.findUnique({
            where: { id: decisionId }
        })

        if (!decision || decision.user_id !== user_id) {
            return res.status(404).json({ msg: 'No decision found' });
        }
        return res.status(200).json({ title: decision.title, description: decision.description });
    } catch (err) {
        next(err)
    }
})

//Updating the decision
router.patch('/decisions/:id', authMiddleware, validateUserDecision, async (req, res, next) => {
    try {
        const decisionId = parseInt(req.params.id);
        const { title, description } = req.body;
        if( !title && !description ){
            return res.status(400).json({msg:'Nothing to Update'})
        }
        const updated = await prisma.Decision.update({
            where: { id: decisionId },
            data: {
                ...(title && { title }),
                ...(description && { description })
            }
        })
        return res.status(200).json(updated)
    } catch (err) {
        next(err)
    }
})
// Deleting the decision
router.delete('/decisions/:id', authMiddleware, validateUserDecision, async (req, res, next) => {
    try {
        const decisionId = parseInt(req.params.id);
        await prisma.Decision.delete({
            where: { id: decisionId }
        })
        return res.status(200).json({ msg: 'Deleted successfully' })
    } catch (err) {
        next(err)
    }
})

module.exports = router;