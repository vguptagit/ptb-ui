import { useNavigate } from "react-router-dom";
import Loader from "../components/common/loader/Loader";
import { useEffect } from "react";

// Login and session logic goes here.
const LoginPage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/home');
    }, [])
    return (
        <>
            <Loader />
        </>
    );
}
export default LoginPage;
