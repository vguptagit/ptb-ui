import { useNavigate } from "react-router-dom";
import Loader from "../components/common/loader/Loader";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import User from '../entities/User.Entity';

// Login and session logic goes here.
const LoginPage = () => {
    const { isAuthenticated, user, login, logout } = useAuth();
    const [loader, setLoader] = useState(false);
    const handleLoader = () => setLoader(!loader);

    const navigate = useNavigate();
    const handleLogin = () => {
        const user = new User(); 
        user.name ='Pearson user'; 
        user.email ='Pearson_User@pearson.com'; 
        login(user);
        navigate('/welcomescreen');
    }
    useEffect(() => {
    }, [])
    return (
        <>
            {isAuthenticated ? (
                <>
                    <button onClick={logout}>Logout</button>
                    <div>user name : {user.name}</div>
                    <div>email : {user.email}</div>
                </>
            ) : (
                <button onClick={handleLogin}>Login</button>
            )}
            <button onClick={handleLoader}>Show Loader</button>
            {loader && <Loader show={loader}/>}
        </>
    );
}
export default LoginPage;
