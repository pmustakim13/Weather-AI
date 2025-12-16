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
            let msg = 'Sorry, something went wrong. Please check the backend connection.';

            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                msg = `Server Error (${error.response.status}): ${JSON.stringify(error.response.data)}`;
                if (error.response.status === 404) {
                    msg = "Error 404: Endpoint not found. Please check Vercel configuration.";
                } else if (error.response.status === 500) {
                    msg = "Error 500: Server error. Likely missing OPENROUTER_API_KEY in Vercel Settings.";
                }
            } else if (error.request) {
                // The request was made but no response was received
                msg = "Network Error: No response received from server.";
            }

            const errorMessage = { sender: 'bot', text: msg };
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
