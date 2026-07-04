import type React from "react";



const Dashboard: React.FC = () => {

    const handleChatSubmit = (e: React.SubmitEvent<HTMLElement>) => {
        e.preventDefault();
        
    }

    return (
        <div className="dashboard">

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
                    <form className="form-field" onSubmit={handleChatSubmit}>
                        <input type="text" name="chat" id="chat" required />
                        <button type="submit">Send</button>
                    </form>
                </div>
            </div>
        </div>
    );
}


export default Dashboard;