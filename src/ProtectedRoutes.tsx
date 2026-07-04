import type React from "react";
import { useEffect, useState } from "react";
import API from "./axiosConfig";
import { Outlet, useNavigate } from "react-router-dom";




const ProtectedRoutes: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [authenticated, setAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const verifySession = async () => {
            setLoading(true);
            try {

                const response = await API.get('users/profile');
                if (response.status === 200) {
                    setAuthenticated(true);
                }
            } catch (error: any) {
                console.log(error.message || " Token expired or not verified");
                setAuthenticated(false);
            } finally {
                setLoading(false);
            }
        }
        verifySession();
    }, []);

    if (loading) {
        return <div className="loading"> <h1>Loading........</h1></div>;
    }
    if (!authenticated) {
        navigate('/');
        return;
    }

    return  <Outlet />;

}



export default ProtectedRoutes;