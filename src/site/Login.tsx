import { LoaderCircle } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../axiosConfig";

interface loginDetails {
    email: string;
    password: string;
}

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
    };

    // 🛠️ फिक्स 1: React 19 / TypeScript के अनुसार FormEvent का उपयोग किया ताकि सबमिशन न अटके ✅
    const handleFormSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            // 🛠️ फिक्स 2: कुकीज़ को ब्राउज़र में सेव करवाने के लिए withCredentials: true जोड़ा गया ✅
            const response = await API.post('/users/login', {
                email: loginIn.email,
                password: loginIn.password,
            }, {
                withCredentials: true // 👈 यह एक्सप्रेस कुकी ऑथेंटिकेशन के लिए संजीवनी बूटी है!
            });

            // एक्सप्रेस 5 और रिएक्ट 19 के स्टैण्डर्ड के अनुसार रिस्पॉन्स चेक
            if (response.status === 200 || response.status === 201) {
                navigate('/dashboard'); // अब कुकी सेव हो चुकी है, डैशबोर्ड पर जाने का रास्ता साफ़ है!
            }
        } catch (error: any) {
            // एरर मैसेज को बेहतर तरीके से कैप्चर करें
            setMessage(error.response?.data?.message || error.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <div className="card">
                <header>
                    <h1>Welcome Back</h1>
                    {message ? (<p style={{ color: 'red' }}>{message}</p>) : (<p>All fields are required</p>)}
                </header>
                <form className="form-field" onSubmit={handleFormSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            id="email" 
                            required 
                            placeholder="   : abc@xyz.com" 
                            value={loginIn.email} 
                            onChange={handleChange} 
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            id="password" 
                            required 
                            placeholder="   : Password" 
                            value={loginIn.password} 
                            onChange={handleChange} 
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? (<LoaderCircle className="animate-spin" />) : (<span>LogIn</span>)}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
