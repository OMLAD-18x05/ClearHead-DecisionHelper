import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useState, useEffect } from "react";
import { useToast } from "../components/ui/Toast";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user, login } = useAuth();
    const navigate = useNavigate();

    const { showToast } = useToast();
    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);


    const handelSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            showToast('All fields are required', 'warning');
            return;
        }

        if (password.length < 8) {
            showToast('Password must be at least 8 characters', 'error');
            return;
        }
        setIsSubmitting(true);

        try {
            await login(email, password)
            showToast("Account created", 'success')
            navigate('/dashboard')
        } catch (err) {
            showToast(err.message || 'Registration failed', 'error');
        } finally {
            setIsSubmitting(false);
        }

    }
    return <>
        <div className="min-h-screen w-auto flex justify-center items-center dark:bg-slate-800 font-serif">
            <div className="h-[35em] w-[35em]  dark:bg-slate-950 dark:border-indigo-800 rounded-3xl shadow-2xl shadow-indigo-500">
                <div className="flex-col flex gap-5 my-10 ">
                    <p className="text-amber-200 font-semibold text-4xl text-center ">Welcome Back!</p>

                    <div className="  mx-20" >
                        <div className="text-center font-semibold text-3xl  p-4 text-indigo-500">Hello!!! 👋</div>
                        <form onSubmit={handelSubmit}>
                            <div className="mx-10 flex flex-col gap-7 items-center pt-6">
                                <Input label=""
                                    value={email}
                                    onChange={(e) => setEmail(e)}
                                    type="email"
                                    placeholder="Email Id"
                                    disabled={isSubmitting}
                                    required
                                />
                                <Input label=""
                                    value={password}
                                    onChange={(e) => setPassword(e)}
                                    type="password"
                                    placeholder="Enter your Password"
                                    disabled={isSubmitting}
                                    required
                                />
                                <Button size='lg'
                                    type='submit'
                                    className="text-indigo-500   bg-blue-100 hover:bg-blue-200 border-2 w-xs ">
                                    Sign in
                                </Button>
                            </div>
                        </form>
                    </div>
                    <div className="text-amber-200 font-semibold text-center pt-20"> New to Clear Mind? <a href="/register" className="text-blue-700 underline"> Register</a></div>
                </div>
            </div>
        </div>
    </>
}