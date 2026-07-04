import type React from "react";



const Dashboard: React.FC = () => {
    return (
        <div className="dashboard">
            {/* <h1>Welcome to Dashboard</h1> */}

            <div className="main-window">

                <div className="left">
                    <div className="header">
                        Contacts
                    </div>
                    <div className="contact-body">
                        
                    </div>
                </div>


                <div className="middle">
                    <div className="header">Anchal Koshta</div>
                    <div className="chat-pannel">

                    </div>
                    <form className="form-field">
                        <input type="text" name="chat" id="chat" required />
                        <button type="submit">Send</button>
                    </form>
                </div>
            </div>
        </div>
    );
}


export default Dashboard;