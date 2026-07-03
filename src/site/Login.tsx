import type React from "react";


const Login: React.FC = () => {
    return (
        <div className="page">
            <div className="card">
                <header>
                    <h1>Welcome Back</h1>

                </header>
                <form  className="form-field">
                     
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" required placeholder="   : abc@xyz.com"/>
                    </div>
                    

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" required placeholder="   : Password"/>
                    </div>
 

                    <button type="submit">SignUp</button>
                </form>
            </div>
        </div>
    );
}


export default Login;