const { prisma } = require('../utils/dependencies') 

async function validateUserDecision(req, res, next) {
    try {
        const decisionId = parseInt(req.params.id);
        const user_id = req.user.userId
        const validated_User = await prisma.Decision.findUnique({
            where: { id: decisionId }
        })
        if (!validated_User || validated_User.user_id !== user_id) {
            return res.status(404).json({ msg: 'Decison not found' })
        }
        req.decision = validated_User;
        next();
    } catch (err) {
        next(err)
    }

}
module.exports = validateUserDecision 