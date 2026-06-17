import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from "../components/ui/Toast";


export default function Signup() {
    const { showToast } = useToast();
    const { user, signup } = useAuth()
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || !password) {
            showToast('All fields are required', 'warning');
            return;
        }

        if (name.length < 3 || name.length > 10) {
            showToast('Name must be between 3 and 10 characters', 'error');
            return;
        }

        if (password.length < 8) {
            showToast('Password must be at least 8 characters', 'error');
            return;
        }
        setIsSubmitting(true);
        try {
            //Goes to useAuth and logic is there for authorization 
            await signup(name, email, password);
            showToast('Account created successfully!', 'success');
            navigate('/dashboard');
        } catch (err) {
            showToast(err.message || 'Registration failed', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return <>
        <div className="min-h-screen w-auto flex justify-center items-center dark:bg-slate-800 font-serif">
            <div className="h-[35em] w-[35em]  dark:bg-slate-950 dark:border-indigo-800 rounded-3xl shadow-2xl shadow-indigo-500">
                <div className="flex-col flex gap-5 my-10 ">
                    <p className="text-amber-200 font-semibold text-4xl text-center ">New to Clear Head?</p>

                    <div className="  mx-20" >
                        <div className="text-center font-semibold text-3xl  p-4 text-indigo-500">Register</div>
                        <form onSubmit={handleSubmit} >
                            <div className="mx-10 flex flex-col gap-7 items-center">
                                <Input

                                    type="text"
                                    placeholder="Name (3-10 chars)"
                                    value={name}
                                    onChange={(e) => setName(e)}
                                    disabled={isSubmitting}
                                    required
                                />

                                <Input

                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e)}
                                    disabled={isSubmitting}
                                    required
                                />

                                <Input
                                    type="password"
                                    placeholder="Password (min 8 chars)"
                                    value={password}
                                    onChange={(e) => setPassword(e)}
                                    disabled={isSubmitting}
                                    required
                                />
                                <Button type='submit' size='lg' className="text-indigo-600 bg-blue-100 hover:bg-blue-200 border-2 w-xs " >Register </Button>

                            </div>
                        </form>

                    </div>
                    <div className="text-amber-200 font-semibold text-center pt-8"> Already have an account?<Link to="/login" className="text-blue-700 underline">Login</Link></div>
                </div>
            </div>
        </div>
    </>
}