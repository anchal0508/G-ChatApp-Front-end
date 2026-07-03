import type React from "react";


const Login: React.FC = () => {
    return (
        <div className="page">
            <div className="card">
                <header>
                    <h1>Join Us Today</h1>

                </header>
                <form  className="form-field">
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input type="text" name="name" id="name" required placeholder="   : Type your name"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" required placeholder="   : abc@xyz.com"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Phone</label>
                        <input type="tel" name="phone" id="phone" required placeholder=" Ph : 9876543210"/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" required placeholder="   : Password"/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPass">Confirm Password</label>
                        <input type="password" name="confirmPass" id="confirmPass" required placeholder="   : Confirm Password"/>
                    </div>

                    <button type="submit">SignUp</button>
                </form>
            </div>
        </div>
    );
}


export default Login;