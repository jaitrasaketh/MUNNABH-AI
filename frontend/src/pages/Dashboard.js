import React, { useState, useRef, useEffect } from 'react';
import './Dashboard.css';
import logo from 'C:/Users/jaisa/OneDrive/Desktop/Projects/Reactjs/AIChatbot/frontend/src/assests/AIlogo.png';

const Dashboard = ({ accessToken }) => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
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

  const handlePromptSubmit = async () => {
    if (prompt.trim() !== '' || image) {
      const newConversation = currentConversation ? [...currentConversation] : [];
      if (prompt.trim() !== '') {
        newConversation.push({ sender: 'You', message: prompt.trim() });
        await fetch('http://localhost:8000/query/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ query: prompt.trim() }),
        });
      }
      if (image) {
        newConversation.push({ sender: 'You', image });
        const formData = new FormData();
        formData.append('image', fileInputRef.current.files[0]);
        await fetch('http://localhost:8000/query/upload-image', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: formData,
        });
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
      textareaRef.current.style.height = 'auto';
      const newHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${newHeight}px`;
    }
  };

  const handleDiagnose = async () => {
    console.log('Diagnose button clicked');
    await fetch('http://localhost:8000/query/select/diagnose', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  };

  const handleTreat = async () => {
    console.log('Treat button clicked');
    await fetch('http://localhost:8000/query/select/treat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  };

  const handleAsk = async () => {
    console.log('Ask button clicked');
    await fetch('http://localhost:8000/query/select/ask', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="dashboard-container">
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
      </div>
    </div>
  );
};

export default Dashboard;
