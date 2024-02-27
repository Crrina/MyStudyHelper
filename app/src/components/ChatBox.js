import {useEffect, useState} from "react";
import TypingAnimation from "./TypingAnimation";
import axios from "axios";
import {useLocation, useNavigate} from "react-router-dom";
import {handleSessionExpired} from "../utility/SessionExpiryHandler";


export default function ChatBox({apiUrl}) {
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    let accessToken = localStorage.getItem('accessToken');
    const location = useLocation();
    const navigate = useNavigate();


    const [chatLog, setChatLog] = useState(() => {
        const savedChatLog = localStorage.getItem('chatLog');
        return savedChatLog ? JSON.parse(savedChatLog) : [];
    });

    useEffect(() => {
        // save chatLog to localStorage whenever it changes
        localStorage.setItem('chatLog', JSON.stringify(chatLog));
    }, [chatLog]);


    const handleSend = async (event) => {
        event.preventDefault();
        setChatLog((prevChatLog) => [...prevChatLog, {type: 'user', message: input, saved: false}]);
        const rest_api = apiUrl + "/bot/chat?prompt=" + input;
        setIsLoading(true);
        try {   //my model is handled at the backend, as well as the key for security reasons
            const response = await fetch(rest_api, {
                method: 'GET',
                headers: {"Content-Type": "application/json"},
            });
            const responseText = await response.text()
            setChatLog((prevChatLog) => [...prevChatLog, {type: "bot", message: responseText}])
            setIsLoading(false);
            setInput('');

        } catch (error) {
            setIsLoading(false)
            console.error("Fetching error: ", error);
        }

    };


    const handleSaveMessage = async (message, index, event) => {
        event.preventDefault();
        if (!accessToken) {
            navigate('/login', {state: {from: location}});
        } else {
            try {
                const response = await axios.post(apiUrl + "/note", {
                    content: message
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}` // Include the token in the header
                    }
                });
                if (response.status === 200) {
                    setChatLog(prevChatLog => {
                        const newChatLog = [...prevChatLog];
                        newChatLog[index] = {...newChatLog[index], saved: true};
                        return newChatLog;
                    });
                }
            } catch (err) {
                if (!err?.response) {
                    console.log("No Server Response");
                } else if (err?.response.status === 401) {
                    console.log("Error message: ", err.response.data);
                    handleSessionExpired(navigate); // Handle session expiry
                } else if (err?.response.status === 403) {
                    console.log("Bad request");
                } else {
                    console.log("Failed to access source")
                }
            }

        }


    }

    return (
        <div className="container-chat">
            <header className="chat-header">
                ChatGPT
            </header>
            <div className="chat-messages">
                {chatLog.map((message, index) => (
                    <div key={index} className={`message ${message.type}`}>
                        <div className="message-bubble">
                            {message.message}
                        </div>
                        {message.type === 'bot' && (
                            <button
                                className={`save-chat-convo ${message.saved ? 'saved' : ''}`}
                                onClick={(event) => handleSaveMessage(message.message, index, event)}
                                disabled={message.saved} // Disable the button if the message is saved
                            >
                                {message.saved ? 'Saved' : 'Save'}
                            </button>
                        )}
                    </div>
                ))}

                {
                    isLoading && <div key={chatLog.length} className="typing-log">
                        <div className="animation-log">
                            <TypingAnimation/>
                        </div>
                    </div>
                }
            </div>
            <form onSubmit={handleSend} className="chat-input-area">
                <input
                    className="chat-input"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button type="submit" className="send-button">
                    Send
                </button>
            </form>
        </div>
    );
}