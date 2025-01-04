import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css'; // Import du fichier CSS
<<<<<<< HEAD
import Message from "./Message"
import {getMessageFromChat} from "../services/chatbootService"
=======

>>>>>>> 997ea82082d4edfed7cf41a30aa5cc3d2d1a1479

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content:
        "Bonsoir! Je suis votre assistant virtuel. Je peux vous aider avec toutes vos questions concernant la gestion des surveillances d'examens. N'hésitez pas à me poser vos questions! 🤖",
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
<<<<<<< HEAD
  const handleSendMessage = async () => {
    if (newMessage.trim()) {
        const userMessage = {
            type: 'user',
            content: newMessage,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setNewMessage('');

        const typingMessage = {
            type: 'bot',
            content: 'En train d\'écrire...',
            timestamp: new Date(),
            isTyping: true
        };
        setMessages((prev) => [...prev, typingMessage]);

        try {
            const response = await getMessageFromChat(newMessage);
            
            // Assurez-vous que le contenu est une chaîne de caractères
            const formattedContent = String(response.response);

            setMessages((prev) => prev.map((msg, index) => {
                if (index === prev.length - 1 && msg.isTyping) {
                    return {
                        type: 'bot',
                        content: formattedContent,
                        timestamp: new Date(),
                        isTyping: false
                    };
                }
                return msg;
            }));
        } catch (error) {
            setMessages((prev) => prev.map((msg, index) => {
                if (index === prev.length - 1 && msg.isTyping) {
                    return {
                        type: 'bot',
                        content: 'Désolé, une erreur est survenue. Veuillez réessayer.',
                        timestamp: new Date(),
                        isTyping: false
                    };
                }
                return msg;
            }));
        }
    }
};
=======

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const userMessage = {
        type: 'user',
        content: newMessage,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setNewMessage('');

      // // Simulate bot response
      // setTimeout(() => {
      //   const botMessage = {
      //     type: 'bot',
      //     content:
      //       'Je traite votre demande... Je reviendrai vers vous très rapidement.',
      //     timestamp: new Date(),
      //   };
      //   setMessages((prev) => [...prev, botMessage]);
      // }, 1000);
    }
  };
>>>>>>> 997ea82082d4edfed7cf41a30aa5cc3d2d1a1479

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="chat-container">
      <div className="chat-card">
        {/* Header */}
        <div className="chat-header">
          <div className="bot-avatar">
            <span>🤖</span>
          </div>
          <h2>Assistant de Surveillance</h2>
        </div>

        {/* Messages Container */}
        <div className="messages-container">
          {messages.map((msg, index) => (
<<<<<<< HEAD
             <Message
             key={index}
             content={msg.content}
             type={msg.type}
             timestamp={msg.timestamp}
           />
         ))}
         <div ref={messagesEndRef} />
=======
            <div
              key={index}
              className={`message-wrapper ${
                msg.type === 'user' ? 'user-message' : 'bot-message'
              }`}
            >
              <div className="message-bubble">
                <p>{msg.content}</p>
                <span className="timestamp">{formatTime(msg.timestamp)}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
>>>>>>> 997ea82082d4edfed7cf41a30aa5cc3d2d1a1479
        </div>

        {/* Input Area */}
        <div className="input-area">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Écrivez votre message..."
            className="message-input"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="send-button"
          >
            ↗️
          </button>
        </div>
      </div>

      <style>{`
        .chat-container {
  width: 100%;
  height: 100%;
  display: flex;
   background-color: #f1f5f9
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  padding: 2rem;
}

       
      `}</style>
    </div>
  );
};

export default ChatBot;
