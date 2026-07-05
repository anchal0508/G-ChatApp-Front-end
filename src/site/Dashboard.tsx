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
    
    // स्टेट्स
    const [chatType, setChatType] = useState<'public' | 'personal'>('public'); 
    const [roomName, setRoomName] = useState<string>(''); 
    const [searchEmail, setSearchEmail] = useState<string>(''); 
    const [activeChatPartner, setActiveChatPartner] = useState<string>('Global Group'); 

    const socketRef = useRef<Socket | null>(null);

    // पुराना लॉजिक: दोनों की IDs को सीधे ऐरे में रखकर स्ट्रिंग जैसा इस्तेमाल करना
    const handleConnectByEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchEmail.trim()) return;

        try {
            const response = await API.post('/users/getUserByEmail', { email: searchEmail });
            
            if (response.status === 200 && response.data.user) {
                const otherUser = response.data.user;
                const loggedInUser = response.data.currentUser; 
                
                setActiveChatPartner(otherUser.name);
                setChatType('personal');
                setChatMessage([]); 

                // पुराना ऐरे सॉर्टिंग वाला रूम नेम जनरेशन जो सेम ईमेल पर कनेक्ट करता था
                const sortedIds = [loggedInUser.id, otherUser.id].sort((a, b) => a - b);
                const dynamicRoomName = `room_${sortedIds}_${sortedIds}`;
                
                console.log("Generated Room Name:", dynamicRoomName);
                
                setRoomName(dynamicRoomName);
                setSearchEmail(''); 
                
                if (socketRef.current) {
                    socketRef.current.emit('join_room', dynamicRoomName);
                }
            }
        } catch (error: any) {
            alert(error.response?.data?.message || "यूजर खोजने में समस्या आई।");
        }
    };

    const handleSwitchToPublic = () => {
        setChatType('public');
        setRoomName('');
        setActiveChatPartner('Global Group');
        setChatMessage([]); 
    };

    const handleChatSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
                    senderName: response.data.senderName || 'Me'
                };
                
                setChatMessage((prev) => [...prev, formattedMessage]);
                
                if (socketRef.current) {
                    if (chatType === 'personal' && roomName) {
                        socketRef.current.emit('new-message', { 
                            msg: formattedMessage.message, 
                            roomName: roomName 
                        });
                    } else {
                        socketRef.current.emit('send_message', formattedMessage.message);
                    }
                }
            }
        } catch (error: any) {
            console.log(error.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";
        socketRef.current = io(SERVER_URL, { withCredentials: true });

        socketRef.current.on('connect', () => {
            if (chatType === 'personal' && roomName) {
                socketRef.current?.emit('join_room', roomName);
            }
        });

        socketRef.current.on('receive_personal_message', (data: Ichat) => {
            if (chatType === 'personal') {
                setChatMessage((prev) => [...prev, data]);
            }
        });

        socketRef.current.on('receive_public_message', (msgStr: string) => {
            if (chatType === 'public') {
                const formattedPublicMsg: Ichat = {
                    id: Date.now(),
                    message: msgStr,
                    userId: 0,
                    createdAt: new Date().toISOString(),
                    senderName: 'Public User'
                };
                setChatMessage((prev) => [...prev, formattedPublicMsg]);
            }
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.off('receive_personal_message');
                socketRef.current.off('receive_public_message');
                socketRef.current.disconnect();
            }
        };
    }, [roomName, chatType]);

    return (
        <div className="dashboard">
            <div className="main-window">
                <div className="left">
                    <div className="header">Chat Modes</div>
                    <button onClick={handleSwitchToPublic} style={{ width: '90%', margin: '10px auto', display: 'block', padding: '10px', backgroundColor: chatType === 'public' ? 'orange' : '#222', color: 'white' }}>
                        🌐 Public Group
                    </button>
                    <div className="header" style={{ marginTop: '20px' }}>Start Private Chat</div>
                    <form onSubmit={handleConnectByEmail} style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <input type="email" placeholder="Enter email..." required value={searchEmail} onChange={(e) => setSearchEmail(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #444', background: '#222', color: '#fff' }} />
                        <button type="submit" style={{ padding: '8px', backgroundColor: '#444', color: 'white' }}>🔍 Search & Connect</button>
                    </form>
                </div>
                <div className="middle">
                    <div className="header">
                        Chatting In:<span style={{ color: 'orange' }}>{activeChatPartner}</span>{chatType === 'personal' && `(Private 1-To-1 Room)`}
                    </div>
                    <div className="chat-pannel">
                        {chatMessage.map((ch) => (
                            <div key={ch.id} className="message-box">
                                <span style={{ fontSize: '12px', color: 'orange' }}>{ch.senderName} :</span>
                                <div className="message-text">{ch.message}</div>
                            </div>
                        ))}
                    </div>
                    <form className="form-field" onSubmit={handleChatSubmit}>
                        <input type="text" name="chat" required value={message} onChange={(e) => setMessage(e.target.value)} />
                        <button type="submit">Send</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
