const { z } = require('zod');

// for login 
const signupSchema = z.object({
    email: z.string().min(3).max(25).email(),
    name: z.string().min(3).max(10),
    password: z.string().min(8)
});
const loginSchema = z.object({
    email: z.string().min(3).max(25).email(),
    password: z.string().min(8)
});


module.exports = { signupSchema, loginSchema }