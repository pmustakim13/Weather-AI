import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const WeatherChat = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setLoading(true);

        try {
            const res = await axios.post('/api/chat', { message: currentInput });
            const botMessage = { sender: 'bot', text: res.data.response };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Error fetching response:", error);
            const errorMessage = { sender: 'bot', text: 'Sorry, something went wrong. Please check the backend connection.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleClearChat = () => {
        if (window.confirm("Are you sure you want to clear the chat?")) {
            setMessages([]);
        }
    };

    const handleEditMessage = (text) => {
        setInput(text);
        inputRef.current?.focus();
    };

    return (
        <div className="chat-container">
            <header className="chat-header">
                <h1>🌤️ Weather AI</h1>
                {messages.length > 0 && (
                    <button onClick={handleClearChat} className="clear-btn" title="Clear Chat">
                        Clear
                    </button>
                )}
            </header>

            <div className="messages">
                {messages.length === 0 && (
                    <div className="welcome-message">
                        <h2>Hello! 👋</h2>
                        <p>Ask me about the weather in any city.</p>
                        <p className="example-text">"What's the weather in Tokyo?"</p>
                    </div>
                )}
                {messages.map((msg, index) => (
                    <div key={index} className={`message-wrapper ${msg.sender}`}>
                        <div className={`message ${msg.sender}`}>

                            <div className="message-content">
                                {msg.text}
                            </div>

                            {msg.sender === 'user' && (
                                <button
                                    className="edit-btn"
                                    onClick={() => handleEditMessage(msg.text)}
                                    title="Edit and resend"
                                >
                                    ✏️
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="message-wrapper bot">
                        <div className="message bot loading">
                            <div className="dot-typing"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="input-area">
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about the weather..."
                    disabled={loading}
                />
                <button type="submit" disabled={loading || !input.trim()}>
                    {loading ? '...' : 'Send'}
                </button>
            </form>
        </div>
    );
};

export default WeatherChat;
