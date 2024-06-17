import React, { useState, useRef, useEffect } from 'react';
import './Dashboard.css';
import logo from '../assets/AIlogo.png';

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
    let combinedQuery = prompt.trim();
    const newConversation = currentConversation ? [...currentConversation] : [];
    if(combinedQuery){
      newConversation.push({ sender: 'You', message: combinedQuery });
    }
  
    // Step 1: Handle image upload if there's an image
    if (image) {
      newConversation.push({ sender: 'You', image });
      const formData = new FormData();
      formData.append('file', fileInputRef.current.files[0]);
      try {
        const response = await fetch('http://localhost:8000/query/classify_xray', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: formData,
        });
        const result = await response.json();
        // Append the output of the image upload to the user's query
        combinedQuery += " These are the results of the Chest-Xray. Please answer with the top 2 (or 3 if it is significant and do not give out the probabilities) most probable diagnosis in order that you can give (in 150 words): " + JSON.stringify(result);
        // Removed the part where the x-ray classification result is added to the conversation
      } catch (error) {
        console.error('Error uploading image:', error);
        newConversation.push({ sender: 'AI', message: 'Error processing image.' });
      }
      setImage(null); // Reset image after submission
    }
  
    // Proceed with sending the combined query to the /query/message endpoint
    if (combinedQuery !== '') {
      try {
        const response = await fetch('http://localhost:8000/query/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ query: combinedQuery }),
        });
        const result = await response.json();

        setTimeout(() => {
          setIsTyping(true);
          simulateTyping(result.output, newConversation);
        }, 1000);

        newConversation.push({ sender: 'AI', message: result.output });
      } catch (error) {
        console.error('Error fetching AI response:', error);
        newConversation.push({ sender: 'AI', message: 'Sorry, something went wrong.' });
      }
    }
  

    setCurrentConversation(newConversation);

    setPrompt('');
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
    }, 10);
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
