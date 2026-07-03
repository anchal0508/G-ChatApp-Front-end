import { LoaderCircle } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../axiosConfig";

interface loginDetails {
    email: string;
    password: string;
};
const Login: React.FC = () => {

    const navigate = useNavigate();
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const [loginIn, setLoginIn] = useState<loginDetails>({
        email: '',
        password: ''
    });



    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginIn((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const handleFormSubmit = async (e: React.SubmitEvent<HTMLElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await API.post('/users/login', ({
                email: loginIn.email,
                password: loginIn.password,
            }));

            if (response.status === 200) {
                navigate('/dashboard');
            }
        } catch (error: any) {
            setMessage(error.message)
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="page">
            <div className="card">
                <header>
                    <h1>Welcome Back</h1>
                    {message ? (<p>{message}</p>) : (<p>All fields are required</p>)}
                </header>
                <form className="form-field" onSubmit={handleFormSubmit}>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" required placeholder="   : abc@xyz.com" value={loginIn.email} onChange={handleChange} />
                    </div>


                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" required placeholder="   : Password" value={loginIn.password} onChange={handleChange} />
                    </div>


                    <button type="submit">

                        {loading ? (<LoaderCircle />) : (<span>LogIn</span>)}
                    </button>
                </form>
            </div>
        </div>
    );
}


export default Login;