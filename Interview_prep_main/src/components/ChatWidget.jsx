// src/components/ChatWidget.jsx
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext'; // Add this import
import { callGeminiAPI } from '../utils/api';
import "./ChatWidget.css"
export default function ChatWidget() {
  const { t, currentLanguage } = useLanguage();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const { isDarkMode } = useTheme();
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(prev => prev ? `${prev} ${transcript}` : transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        setMessages(prev => [...prev, {
          text: t('speech_recognition_error'),
          sender: 'bot',
          time: new Date()
        }]);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      console.warn('Speech recognition not supported');
      setIsSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [currentLanguage, t]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const toggleListening = () => {
    if (!isSpeechSupported) {
      setMessages(prev => [...prev, {
        text: t('voice_not_supported'),
        sender: 'bot',
        time: new Date()
      }]);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting recognition:', error);
        setIsListening(false);
        setMessages(prev => [...prev, {
          text: t('microphone_error'),
          sender: 'bot',
          time: new Date()
        }]);
      }
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      text: inputMessage,
      sender: 'user',
      time: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await callGeminiAPI(
        `You are an interview preparation assistant. The user asked: "${inputMessage}". 
        Provide a helpful response in 2-3 sentences. Respond in ${currentLanguage === 'hi' ? 'Hindi' : 'English'}.`,
        'questions'
      );

      const botMessage = {
        text: response,
        sender: 'bot',
        time: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        text: t('chat_error'),
        sender: 'bot',
        time: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <>
    {/* <style dangerouslySetInnerHTML={{ __html: ChatWidgetStyles }} /> */}
    <div className={`chat-widget ${isChatOpen ? 'active' : ''} ${isDarkMode ? 'dark' : ''}`}></div>
    <div className={`chat-widget ${isChatOpen ? 'active' : ''}`}>
      <button className="chat-toggle" onClick={toggleChat}>
        <i className="fas fa-comment-dots"></i>
      </button>
      
      <div className="chat-modal">
        <div className="chat-header">
          <h3>{t('interview_assistant')}</h3>
          <button className="close-chat" onClick={toggleChat}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="chat-body">
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}-message`}>
                <div>{msg.text}</div>
                <span className="message-time">
                  {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            {isTyping && (
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        <div className="chat-footer">
          <div className="chat-input-container">
            <textarea
              className="chat-input"
              placeholder={t('type_message')}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              rows="1"
            />
            <button 
              className={`mic-btn ${isListening ? 'active' : ''}`}
              onClick={toggleListening}
              title={t('voice_input')}
              disabled={!isSpeechSupported}
            >
              <i className={`fas ${isListening ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
            </button>
          </div>
          <button className="send-btn" onClick={sendMessage}>
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
    </>
  );
}