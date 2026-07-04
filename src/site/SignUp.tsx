import { LoaderCircle } from "lucide-react";
import type React from "react";
import { useState } from "react";
import API from "../axiosConfig";


interface SignUpDetails {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPass: string;
};

const Login: React.FC = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [signup, setSignup] = useState<SignUpDetails>({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPass: '',
    });



    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSignup((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const handleFormSubmit = async (e: React.SubmitEvent<HTMLElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        if (signup.password !== signup.confirmPass) {
            setMessage("Both passwords should be same");
            return;
        }

        try {
            const addUser = {
                name: signup.name,
                email: signup.email,
                phone: signup.phone,
                password: signup.password,
            };

            const response = await API.post('/users/addUser', addUser);
            if (response.status === 201) {
                setMessage('User registered Successfully');
            }

        } catch (error: any) {
            setMessage(error.message)
        }finally{
            setLoading(false);
        }
    }



    return (
        <div className="page">
            <div className="card">
                <header>
                    <h1>Join Us Today</h1>
                    {message ? (<p style={{color: 'red'}}>{message}</p>) : (<p>All fields are required</p>)}
                </header>
                <form className="form-field" onSubmit={handleFormSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input type="text" name="name" id="name" required placeholder="   : Type your name" onChange={handleChange} aria-required value={signup.name}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" required placeholder="   : abc@xyz.com" onChange={handleChange} aria-required value={signup.email}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Phone</label>
                        <input type="tel" name="phone" id="phone" required placeholder=" Ph : 9876543210" onChange={handleChange} aria-required value={signup.phone}/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" required placeholder="   : Password" onChange={handleChange} aria-required value={signup.password}/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPass">Confirm Password</label>
                        <input type="password" name="confirmPass" id="confirmPass" required placeholder="   : Confirm Password" onChange={handleChange} aria-required value={signup.confirmPass}/>
                    </div>

                    <button type="submit">  {loading ? (<LoaderCircle />) : (<span>SignUp</span>)}</button>
                </form>
            </div>
        </div>
    );
}


export default Login;