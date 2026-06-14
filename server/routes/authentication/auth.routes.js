const { prisma } = require('../../utils/dependencies');
const router = require('express').Router();
const bcrypt = require('bcrypt');

const { signupSchema, loginSchema } = require('../../utils/zodvalidation');
const { generateToken } = require('../../utils/jwt');

router.post('/signup', async (req, res, next) => {
    try {
        const schemaresult = signupSchema.safeParse(req.body);
        if (!schemaresult.success) {
            return res.status(400).json({ msg: 'Invalid entriess!!!', errors: schemaresult.error })
        }

        const { name, email, password } = schemaresult.data;

        const exists = await prisma.User.findUnique({ where: { email } });
        if (exists) {
            return res.status(409).json({ msg: "User already exists" })
        }
        const hashedpassword = await bcrypt.hash(password, 10);

        const user = await prisma.User.create({
            data: {
                name: name,
                email: email,
                password: hashedpassword
            }
        })

        res.status(201).json({ msg: 'User Created' })
    } catch (err) {
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const schemaresult = loginSchema.safeParse(req.body);
        if (!schemaresult.success) {
            return res.status(400).json({ msg: 'Invalid entriess!!!', errors: schemaresult.error })
        }

        const { email, password } = schemaresult.data;

        const exists = await prisma.User.findUnique({ where: { email } });
        if (!exists) {
            return res.status(401).json({ msg: "Incorrect credentials" })
        }

        const passwordMatch = await bcrypt.compare(password, exists.password)
        if (!passwordMatch) {
            return res.status(401).json({ msg: 'Invalid Credentials' })
        }

        const token = generateToken({ userId: exists.id, email });
        res.status(200).json({ token });

    } catch (err) {
        next(err);
    }
})
module.exports = router;