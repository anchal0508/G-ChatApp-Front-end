import type React from "react";



const Dashboard: React.FC = () => {
    return (
        <div className="dashboard">
            <h1>Welcome to Dashboard</h1>
            <div className="main-window">
                <div className="left">contacts</div>
                <div className="middle">
                    <h2>Anchal Koshta</h2>
                    <div className="chat-pannel">

                    </div>
                    <form  className="form-field">
                        <input type="text" name="chat" id="chat" required  />
                        <button type="submit">Send</button>
                    </form>
                </div>
            </div>
        </div>
    );
}


export default Dashboard;