import type React from "react";
import API from "../axiosConfig";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
interface Ichat {
    id: number;
    message: string;
    userId: number;
    createdAt: string;
    socketId?: string;
}
const socket = io("http://localhost:3000", { withCredentials: true });

const Dashboard: React.FC = () => {
    const [message, setMessage] = useState<string>('');
    const [chatMessage, setChatMessage] = useState<Ichat[]>([]);


    const handleChatSubmit = async (e: React.SubmitEvent<HTMLElement>) => {
        e.preventDefault();

        try {
            const response = await API.post('/chats/addChat', { message });
            if (response.status === 200) {
                const newChat = response.data.data;
                setMessage('');
                const localChatWithSocket = { ...newChat, socketId: socket.id };
                setChatMessage((prev) => [...prev, localChatWithSocket]);
                socket.emit('send_message', localChatWithSocket);
            }

        } catch (error: any) {
            console.log(error.response?.data?.message || error.message);
        }
    }
    const getAllMsg = async () => {
        setMessage('');
        try {
            const response = await API.get('/chats/getmsg');
            if (response.status === 200) {
                console.log(response.data);
                setChatMessage(response.data.data || []);
            }

        } catch (error: any) {
            console.log(error.response?.data?.message || error.message);
        }
    }

    useEffect(() => {
        getAllMsg();
        socket.on('receive_message', (data: Ichat) => {
            setChatMessage((prev) => [...prev, data]);
        });
        return () => {
            socket.off('receive_message');
        };
    }, []);


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

                        {chatMessage && chatMessage.map((ch) => (

                            <div key={ch.id} className="message-box">
                                <span style={{ fontSize: '12px', color: 'orange' }}>
                                    User {ch.socketId ? ch.socketId : `DB-${ch.userId}`} said:
                                </span>
                                <div className="message-text">

                                    {ch.message}

                                </div>

                            </div>

                        ))}

                    </div>
                    <form className="form-field" onSubmit={handleChatSubmit}>
                        <input type="text" name="chat" id="chat" required value={message} onChange={(e) => setMessage(e.target.value)} />
                        <button type="submit">Send</button>
                    </form>
                </div>
            </div>
        </div>
    );
}


export default Dashboard;