const { prisma } = require('../../utils/dependencies')
const router = require('express').Router();

const authMiddleware = require('../../middleware/authMiddleware');
const validateUserDecision = require('../../middleware/validation.middleware')

//create Option
router.post('/:id/options', authMiddleware, validateUserDecision, async (req, res, next) => {
    try {
        const decisionId = parseInt(req.params.id);
        const title = req.body.title;
        if (!title) {
            return res.status(400).json({ msg: 'Please enter title' })
        }
        const createOption = await prisma.Option.create({
            data: {
                decision_id: decisionId,
                title
            }
        })
        res.status(201).json({ msg: 'Option created' })
    } catch (err) {
        next(err);
    }
})

//get options
router.get('/:id/options', authMiddleware, validateUserDecision, async (req, res, next) => {
    try {
        const decision_id = parseInt(req.params.id);
        const options = await prisma.Option.findMany({
            where: { decision_id }
        })
        res.status(200).json(options)
    } catch (err) {
        next(err);
    }
})

//update decision
router.patch('/:id/options/:optionId', authMiddleware, validateUserDecision, async (req, res, next) => {
    try {
        const optionId = parseInt(req.params.optionId);
        const { title } = req.body;

        const existingOption = await prisma.Option.findFirst({
            where: {
                id: optionId,
                decision_id: req.decision.id
            }
        });

        if (!existingOption) {
            return res.status(404).json({ msg: 'Option not found' });
        }

        const updatedOption = await prisma.Option.update({
            where: { id: optionId },
            data: {
                ...(title && { title })
            }
        })
        res.status(200).json({msg:'Option updated'})
    } catch (err) {
        next(err);
    }
})

//delete decision
router.delete('/:id/options/:optionId', authMiddleware, validateUserDecision, async (req, res, next)=>{
    try{
        const optionId = parseInt(req.params.optionId);

        const existingOption = await prisma.Option.findFirst({
            where: {
                id: optionId,
                decision_id: req.decision.id
            }
        });

        if (!existingOption) {
            return res.status(404).json({ msg: 'Option not found' });
        }

        await prisma.Option.delete({
            where:{id:optionId}
        });
        return res.status(200).json({msg:'Deleted successfully'});
    }catch(err){
        next(err)
    }
})

module.exports = router;
