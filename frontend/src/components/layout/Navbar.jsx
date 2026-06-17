import Button from "../ui/Button";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Brain } from 'lucide-react'
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
    const { pathname } = useLocation();
    const isHome = pathname === "/"
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <nav className="min-h-25  rounded-b-xl flex justify-between items-center  px-20" >
                <div className="flex text-2xl gap-5 ">
                    <Link to='/'>
                        <Brain className=" text-indigo-400 scale-200 border-indigo-400 border-2 p-0.5 rounded-full" />{/*Insert logo*/}
                    </Link>
                    <span className="text-4xl font-extrabold">CLEAR HEAD</span>
                </div>
                <div className="flex gap-5">


                    <Link to='/login'>
                        {isHome && <Button size='lg' className="bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300 shadow-blue-300/20 shadow-xl"> Login </Button>}</Link>

                    <Link to='/register'>{isHome && <Button  size='lg' className="bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300 shadow-blue-300/20 shadow-xl ">Register </Button>}</Link>

                    {!isHome && <div className="pt-3 px-5"> Hello, {user?.name || 'User'}</div> }
                    {!isHome && <Button size="lg" onClick={handleLogout} className="bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300 shadow-blue-300/20 shadow-xl">Logout</Button>}
                </div>
            </nav>
        </>
    )
}
