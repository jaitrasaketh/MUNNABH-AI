import React, { useState, useRef, useEffect } from 'react';
import './Dashboard.css';
import logo from 'C:/Users/jaisa/OneDrive/Desktop/Projects/Reactjs/AIChatbot/frontend/src/assests/AIlogo.png'; // Import the logo image

const Dashboard = () => {
    const [prompt, setPrompt] = useState('');
    const [image, setImage] = useState(null);
    const [chats, setChats] = useState([]);
    const [currentConversation, setCurrentConversation] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        adjustTextareaHeight();
    }, [prompt]);

    const handlePromptChange = (event) => {
        setPrompt(event.target.value);
    };

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePromptSubmit = () => {
        if (prompt.trim() !== '' || image) {
            const newConversation = currentConversation ? [...currentConversation] : [];
            if (prompt.trim() !== '') {
                newConversation.push({ sender: 'You', message: prompt.trim() });
            }
            if (image) {
                newConversation.push({ sender: 'You', image });
                setImage(null); // Reset image after submission
            }

            setCurrentConversation(newConversation);

            setTimeout(() => {
                setIsTyping(true);
                const aiResponse = 'Wassup Dawg';
                simulateTyping(aiResponse, newConversation);
            }, 1000);

            setPrompt('');
        }
    };

    const simulateTyping = (message, conversation) => {
        let index = 0;
        const interval = setInterval(() => {
            if (index < message.length) {
                const currentMessage = message.substring(0, index + 1);
                const updatedConversation = [...conversation];
                if (updatedConversation[updatedConversation.length - 1]?.sender === 'AI') {
                    updatedConversation[updatedConversation.length - 1].message = currentMessage;
                } else {
                    updatedConversation.push({ sender: 'AI', message: currentMessage });
                }
                setCurrentConversation(updatedConversation);
                index++;
            } else {
                clearInterval(interval);
                setIsTyping(false);
            }
        }, 50);
    };

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // Reset height to auto to correctly measure content height
            const newHeight = textareaRef.current.scrollHeight; // Get the scroll height of the textarea content
            textareaRef.current.style.height = `${newHeight}px`; // Set the height of the textarea
        }
    };

    const handleDiagnose = () => {
        console.log('Diagnose button clicked');
    };

    const handleTreat = () => {
        console.log('Treat button clicked');
    };

    const handleAsk = () => {
        console.log('Ask button clicked');
    };

    const handleConversationClick = (chat) => {
        setCurrentConversation(chat.conversation);
    };

    const handleNewConversation = () => {
        if (currentConversation.length > 0) {
            const timestamp = new Date().toLocaleString();
            setChats([{ timestamp, conversation: [...currentConversation] }, ...chats]);
        }
        setCurrentConversation([]);
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="dashboard-container">
            <div className="menu">
                <h2>MunnaBh-AI</h2>
                <ul>
                    {chats.map((chat, index) => (
                        <li key={index} onClick={() => handleConversationClick(chat)}>
                            <strong>Conversation {chats.length - index}:</strong> {chat.timestamp}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="content">
                <div className="button-area">
                    <button className="action-button" onClick={handleDiagnose}>Diagnose</button>
                    <div className="logo-treat-container">
                        <img src={logo} alt="MunnaBh-AI Logo" className="logo-image" />
                        <button className="action-button" onClick={handleTreat}>Treat</button>
                    </div>
                    <button className="action-button" onClick={handleAsk}>Ask</button>
                </div>
                <div className="prompt-area">
                    <textarea
                        ref={textareaRef}
                        value={prompt}
                        onChange={handlePromptChange}
                        placeholder="Chat with MunnaBh-AI..."
                    ></textarea>
                    <div className="file-input-and-submit-container">
                        <div className="file-input-container">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="custom-file-input"
                            />
                            <button className="custom-file-label" onClick={triggerFileInput}>Upload Image</button>
                        </div>
                        <button className="submit-button" onClick={handlePromptSubmit}>Submit Prompt</button>
                    </div>
                </div>
                <div className="chat-area">
                    {currentConversation.map((msg, index) => (
                        <div key={index} className={`chat-message ${msg.sender}`}>
                            <strong>{msg.sender}:</strong> {msg.message}
                            {msg.image && <img src={msg.image} alt="uploaded" className="image-preview" />}
                        </div>
                    ))}
                    {isTyping && <div className="chat-message AI"><strong>AI:</strong> typing...</div>}
                </div>
                <div className="new-conversation">
                    <button className="new-conversation-button" onClick={handleNewConversation}>+</button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;