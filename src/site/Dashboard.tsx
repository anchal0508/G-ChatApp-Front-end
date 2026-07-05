import type React from "react";
import API from "../axiosConfig";
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface Ichat {
    id: number;
    message: string;
    userId: number;
    createdAt: string;
    socketId?: string;
    senderName?: string;
}

const Dashboard: React.FC = () => {
    const [message, setMessage] = useState<string>('');
    const [chatMessage, setChatMessage] = useState<Ichat[]>([]);
    
    const socketRef = useRef<Socket | null>(null);

    const handleChatSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!message.trim()) return;

        try {
            const response = await API.post('/chats/addChat', { message });
            if (response.status === 200) {
                const newChat = response.data.data;
                setMessage('');
                const formattedMessage: Ichat = {
                    id: newChat.id,
                    message: newChat.message,
                    userId: newChat.userId,
                    createdAt: newChat.createdAt,
                    senderName: response.data.senderName
                };
                
                setChatMessage((prev) => [...prev, formattedMessage]);
                
                if (socketRef.current) {
                    socketRef.current.emit('send_message', formattedMessage);
                }
            }
        } catch (error: any) {
            console.log(error.response?.data?.message || error.message);
        }
    };

    const getAllMsg = async () => {
        try {
            const response = await API.get('/chats/getmsg');
            if (response.status === 200) {
                setChatMessage(response.data.data || []);
            }
        } catch (error: any) {
            console.log(error.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        getAllMsg();

        socketRef.current = io("http://localhost:3000", { 
            withCredentials: true 
        });

        socketRef.current.on('receive_message', (data: Ichat) => {
            setChatMessage((prev) => [...prev, data]);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.off('receive_message');
                socketRef.current.disconnect();
            }
        };
    }, []); 

    return (
        <div className="dashboard">
            <div className="main-window">
                <div className="left">
                    <div className="header">Contacts</div>
                    <div className="contact-body"></div>
                </div>

                <div className="middle">
                    <div className="header">Anchal Koshta</div>
                    <div className="chat-pannel">
                        {chatMessage && chatMessage.map((ch) => (
                            <div key={ch.id} className="message-box">
                                <span style={{ fontSize: '12px', color: 'orange' }}>
                                    User {` ${ch.senderName || 'Unknown'} : DB-${ch.userId}`} said:
                                </span>
                                <div className="message-text">
                                    {ch.message}
                                </div>
                            </div>
                        ))}
                    </div>
                    <form className="form-field" onSubmit={handleChatSubmit}>
                        <input 
                            type="text" 
                            name="chat" 
                            id="chat" 
                            required 
                            value={message} 
                            onChange={(e) => setMessage(e.target.value)} 
                        />
                        <button type="submit">Send</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
