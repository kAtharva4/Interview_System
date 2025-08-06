// src/pages/GroupDiscussion.jsx
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { callGeminiAPI } from '../utils/api';
const GroupDiscussionStyles = `/* Group Discussion Page Specific Styles */
:root {
    --bg-light: #f9fafb;
    --bg-dark: #111827;
    --text-light: #111827;
    --text-dark: #f3f4f6;
    --primary-light: #2563eb;
    --primary-dark: #60a5fa;
    --card-light: #ffffff;
    --card-dark: #1f2937;
    --border-light: #e5e7eb;
    --border-dark: #374151;
    --success-light: #10b981;
    --success-dark: #34d399;
    --error-light: #ef4444;
    --error-dark: #f87171;
    --warning-light: #f59e0b;
    --warning-dark: #fbbf24;
    --purple-light: #8b5cf6;
    --purple-dark: #7c3aed;
    --blue-light: #3b82f6;
    --blue-dark: #2563eb;
    --green-light: #10b981;
    --green-dark: #059669;
    --orange-light: #f97316;
    --orange-dark: #ea580c;
}

.fade-in {
  animation: fadeIn 0.2s ease-in forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Base Styles */
#group-discussion-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  animation: fadeInUp 0.8s ease forwards 0.2s;
}

/* Card Styles */
#group-discussion-page .card {
  background-color: var(--card-light);
  border-radius: 1rem;
  padding: 1.5rem;
  margin: 15px 0px 0px 0px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.dark #group-discussion-page .card {
  background-color: var(--card-dark);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

#group-discussion-page .card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.dark #group-discussion-page .card:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

/* Participant Cards */
.participant-card {
  text-align: center;
  padding: 1.5rem 1rem;
  border-radius: 0.75rem;
  background-color: var(--card-light);
}

.dark .participant-card {
  background-color: var(--card-dark);
}

.participant-avatar {
  width: 60px;
  height: 60px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.w-full {
    width: 100%;
}

/* Button Styles - Consistent Styling */
#group-discussion-page .btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  text-decoration: none;
  height: 44px; /* Fixed height for consistency */
  white-space: nowrap;
}

#group-discussion-page .btn-primaryi {
  background-color: var(--primary-light);
  color: white;
  height: 40px;
}

.dark #group-discussion-page .btn-primaryi {
  background-color: var(--primary-dark);
  height: 70px;
}

#group-discussion-page .btn-primary {
  background-color: var(--primary-light);
  color: white;
  height: 70px;
}

.dark #group-discussion-page .btn-primary {
  background-color: var(--primary-dark);
  height: 70px;
}

#group-discussion-page .btn-secondary {
  background-color: var(--border-light);
  color: var(--text-light);
  height: 70px;
}

.dark #group-discussion-page .btn-secondary {
  background-color: var(--border-dark);
  color: var(--text-dark);
  height: 70px;
}

#group-discussion-page .btn-error {
  background-color: var(--error-light);
  color: white;
}

.dark #group-discussion-page .btn-error {
  background-color: var(--error-dark);
}

#group-discussion-page .btn-warning {
  background-color: var(--warning-light);
  color: white;
}

.dark #group-discussion-page .btn-warning {
  background-color: var(--warning-dark);
}

#group-discussion-page .btn-success {
  background-color: var(--success-light);
  color: white;
}

.dark #group-discussion-page .btn-success {
  background-color: var(--success-dark);
}

/* Message Input Area Layout */
#gd-user-input-container {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  width: 100%;
}

#gd-user-input {
  flex: 1;
  min-height: 44px;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-light);
  background-color: var(--card-light);
  color: var(--text-light);
  font-size: 0.9rem;
  line-height: 1.5;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.dark #gd-user-input {
  border-color: var(--border-dark);
  background-color: var(--card-dark);
  color: var(--text-dark);
}

#gd-send {
  width: 44px;
  padding: 0;
  min-width: auto;
}

#gd-mic-toggle {
  width: 44px;
  padding: 0;
  min-width: auto;
}

/* Button hover states */
#group-discussion-page .btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

#group-discussion-page .btn:active {
  transform: translateY(0);
}

/* Recording indicator alignment */
#gd-recording-indicator {
  margin-left: 0.5rem;
  font-size: 0.875rem;
}

/* Form controls consistency */
#group-discussion-page .gap-2{
  display: flex;
}

#group-discussion-page .form-controlss{
  height: 35px;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-light);
  background-color: var(--card-light);
  color: var(--text-light);
  font-size: 0.9rem;
  transition: all 0.3s ease;
  width: 75%;
}

#group-discussion-page .form-controls,
#group-discussion-page .form-selects{
  height: 40px;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-light);
  background-color: var(--card-light);
  color: var(--text-light);
  font-size: 0.9rem;
  transition: all 0.3s ease;
  width: 100%;
}

#group-discussion-page .form-control,
#group-discussion-page .form-select {
  height: 30px;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-light);
  background-color: var(--card-light);
  color: var(--text-light);
  font-size: 0.9rem;
  transition: all 0.3s ease;
  width: 100%;
}

.dark #group-discussion-page .form-control,
.dark #group-discussion-page .form-select {
  border-color: var(--border-dark);
  background-color: var(--card-dark);
  color: var(--text-dark);
}

/* Focus states */
#group-discussion-page .form-control:focus,
#group-discussion-page .form-select:focus {
  outline: none;
  border-color: var(--primary-light);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
}

.dark #group-discussion-page .form-control:focus,
.dark #group-discussion-page .form-select:focus {
  border-color: var(--primary-dark);
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
}

/* Button icons */
#group-discussion-page .btn i {
  margin-right: 0.5rem;
}

#group-discussion-page .btn-icon-only i {
  margin-right: 0;
}

.bg-purple-100 { background-color: rgba(139, 92, 246, 0.1); }
.dark .bg-purple-900 { background-color: rgba(124, 58, 237, 0.2); }
.bg-blue-100 { background-color: rgba(59, 130, 246, 0.1); }
.dark .bg-blue-900 { background-color: rgba(37, 99, 235, 0.2); }
.bg-green-100 { background-color: rgba(16, 185, 129, 0.1); }
.dark .bg-green-900 { background-color: rgba(5, 150, 105, 0.2); }
.bg-orange-100 { background-color: rgba(249, 115, 22, 0.1); }
.dark .bg-orange-900 { background-color: rgba(234, 88, 12, 0.2); }

.participant-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--text-light);
}

.dark .participant-name {
  color: var(--text-dark);
}

.participant-role {
  font-size: 0.875rem;
  opacity: 0.7;
}

/* Discussion Chat Styles */
#gd-chatbox {
  background-color: var(--card-light);
  height: 400px;
  overflow-y: auto;
  padding: 1.5rem;
  scroll-behavior: smooth;
}

.dark #gd-chatbox {
  background-color: var(--card-dark);
}

.gd-message {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  animation: fadeIn 0.3s ease-out forwards;
  opacity: 0;
  transform: translateY(10px);
}

@keyframes fadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.gd-message-user {
  flex-direction: row-reverse;
  margin-left: auto;
}

.gd-message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;
  font-size: 1rem;
}

.gd-message-content {
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  background-color: #f3f4f6;
  position: relative;
  transition: all 0.3s ease;
}

.dark .gd-message-content {
  background-color: #374151;
}

.gd-message-user .gd-message-content {
  background-color: var(--primary-light);
  color: white;
}

.dark .gd-message-user .gd-message-content {
  background-color: var(--primary-dark);
}

.gd-message-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
}

.gd-message-text {
  line-height: 1.5;
}

.gd-message-time {
  font-size: 0.75rem;
  opacity: 0.7;
  margin-top: 0.25rem;
}

.speaker-btn {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.3s ease;
  position: absolute;
  right: 0.5rem;
  bottom: 0.5rem;
}

.speaker-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

.speaker-btn.active {
  color: var(--primary-light);
  opacity: 1;
}

.dark .speaker-btn.active {
  color: var(--primary-dark);
}

/* Timer Styles */
#gd-timer {
  font-family: 'Courier New', monospace;
  color: var(--primary-light);
  animation: pulse 2s infinite;
}

.dark #gd-timer {
  color: var(--primary-dark);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

/* Microphone Button */
#gd-mic-toggle.listening {
  color: var(--error-light);
  animation: pulse-wave 1.5s infinite;
}

.dark #gd-mic-toggle.listening {
  color: var(--error-dark);
}

@keyframes pulse-wave {
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}

/* Feedback Section */
#gd-feedback-content {
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.prose {
  color: var(--text-light);
}

.dark .prose {
  color: var(--text-dark);
}

.prose p {
  margin-bottom: 1rem;
  line-height: 1.6;
}

/* Input Area */
#gd-user-input {
  transition: all 0.3s ease;
}

#gd-user-input:focus {
  border-color: var(--primary-light);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
}

.dark #gd-user-input:focus {
  border-color: var(--primary-dark);
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
}

/* Recording Indicator */
#gd-recording-indicator {
  animation: fadeInOut 1.5s infinite;
}

@keyframes fadeInOut {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

/* Avatar Colors */
.gd-message-avatar[style*="purple"] {
  background-color: var(--purple-light);
}
.dark .gd-message-avatar[style*="purple"] {
  background-color: var(--purple-dark);
}

.gd-message-avatar[style*="blue"] {
  background-color: var(--blue-light);
}
.dark .gd-message-avatar[style*="blue"] {
  background-color: var(--blue-dark);
}

.gd-message-avatar[style*="green"] {
  background-color: var(--green-light);
}
.dark .gd-message-avatar[style*="green"] {
  background-color: var(--green-dark);
}

.gd-message-avatar[style*="orange"] {
  background-color: var(--orange-light);
}
.dark .gd-message-avatar[style*="orange"] {
  background-color: var(--orange-dark);
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  #group-discussion-page {
    padding: 1rem;
  }
  
  .participant-card {
    padding: 1rem 0.5rem;
  }
  
  .gd-message-content {
    max-width: 80%;
  }
  
  #gd-chatbox {
    height: 300px;
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .gd-message {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .gd-message-user {
    align-items: flex-end;
  }
  
  .gd-message-content {
    max-width: 100%;
  }
  
  .gd-message-avatar {
    margin-bottom: 0.5rem;
  }
}`;
export default function GroupDiscussion() {
  const { t, currentLanguage } = useLanguage();
  const [currentTopic, setCurrentTopic] = useState(null);
  const [gdTimeLeft, setGdTimeLeft] = useState(600);
  const [gdTimer, setGdTimer] = useState(null);
  const [gdMessages, setGdMessages] = useState([]);
  const [userName, setUserName] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [currentSpeakingMessage, setCurrentSpeakingMessage] = useState(null);
  const [phase, setPhase] = useState('setup');
  const [feedback, setFeedback] = useState('');
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const [spokenLanguage, setSpokenLanguage] = useState(currentLanguage);

  const gdParticipants = [
    { name: "Jarvis", role: "AI", avatar: "purple" },
    { name: "Friday", role: "AI", avatar: "blue" },
    { name: "Shuri", role: "AI", avatar: "green" },
    { name: userName || t("You"), role: "user", avatar: "orange" }
  ];

  const getLanguageCode = () => {
    switch(currentLanguage) {
      case 'en': return 'en-US';
      case 'hi': return 'hi-IN';
      case 'mr': return 'mr-IN';
      case 'ta': return 'ta-IN';
      default: return 'en-US';
    }
  };
  const detectSpokenLanguage = (text) => {
    // Simple language detection based on character ranges
    if (/[\u0900-\u097F]/.test(text)) return 'hi'; // Hindi
    if (/[\u0B80-\u0BFF]/.test(text)) return 'ta'; // Tamil
    if (/[\u0900-\u097F\u1CD0-\u1CFF]/.test(text)) return 'mr'; // Marathi
    return 'en'; // Default to English
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = getLanguageCode();

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserInput(prev => prev ? `${prev} ${transcript}` : transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        addSystemMessage(t('speech_recognition_error'));
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      console.warn('Speech recognition not supported');
      setIsSpeechSupported(false);
      addSystemMessage(t('voice_not_supported'));
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [currentLanguage, t]);

  const addSystemMessage = (text) => {
    setGdMessages(prev => [...prev, {
      text,
      sender: "System",
      time: new Date(),
      isUser: false
    }]);
  };

  const toggleListening = () => {
    if (!isSpeechSupported) {
      addSystemMessage(t('voice_not_supported'));
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = getLanguageCode();
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting recognition:', error);
        setIsListening(false);
        addSystemMessage(t('microphone_error'));
      }
    }
  };

  const generateGDTopic = async () => {
    try {
      const prompt = t("Generate a group discussion topic for interview preparation with a brief description (2-3 sentences). ") +
        t("Format: Topic: [topic title]\nDescription: [description]");
      
      const response = await callGeminiAPI(prompt, 'questions', currentLanguage);

      const topicMatch = response.match(/Topic:\s*(.+)/);
      const descMatch = response.match(/Description:\s*(.+)/);

      if (topicMatch && descMatch) {
        setCurrentTopic({
          title: topicMatch[1].trim(),
          description: descMatch[1].trim()
        });
      } else {
        throw new Error("Couldn't generate topic");
      }
    } catch (error) {
      alert(t("Failed to generate topic. Please try again."));
      console.error(error);
    }
  };

  const startGD = () => {
    if (!userName.trim()) {
      alert(t("Please enter your name"));
      return;
    }
    if (!currentTopic) {
      alert(t("Please generate a discussion topic first"));
      return;
    }

    const duration = parseInt(document.getElementById('gd-duration').value);
    setGdTimeLeft(duration * 60);
    setGdMessages([]);
    setPhase('discussion');

    // Start timer
    const timer = setInterval(() => {
      setGdTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          endGD();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setGdTimer(timer);

    // Start discussion with AI
    setTimeout(() => {
      aiGDResponse();
    }, 1500);
  };

  const pauseGD = () => {
    if (gdTimer) {
      clearInterval(gdTimer);
      setGdTimer(null);
    }
  };

  const resumeGD = () => {
    if (!gdTimer) {
      const timer = setInterval(() => {
        setGdTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            endGD();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setGdTimer(timer);
    }
  };

  const endGD = () => {
    if (gdTimer) {
      clearInterval(gdTimer);
      setGdTimer(null);
    }
    setPhase('feedback');
    generateGDFeedback();
  };

  const generateGDFeedback = async () => {
    try {
      const conversation = gdMessages.map(m => `${m.sender}: ${m.text}`).join('\n');
      const prompt = t(`Analyze this group discussion and provide:
        1. Overall feedback (4-5 lines)
        2. Key strengths
        3. Areas for improvement
        4. Suggestions for better participation
        
        Discussion Topic: ${currentTopic.title}
        Participants: ${gdParticipants.map(p => p.name).join(', ')}
        Conversation:\n${conversation}`);

      const response = await callGeminiAPI(prompt, 'feedback', currentLanguage);
      setFeedback(response);
    } catch (error) {
      setFeedback(t("Failed to generate feedback. Please try again."));
      console.error(error);
    }
  };

  const sendGDMessage = () => {
    if (!userInput.trim()) return;

    const newMessage = {
      sender: userName || t("You"),
      text: userInput,
      time: new Date(),
      isUser: true,
      language: currentLanguage
    };

    setGdMessages(prev => [...prev, newMessage]);
    setUserInput('');

    setTimeout(() => {
      aiGDResponse();
    }, 1000 + Math.random() * 5000);
  };
  const aiGDResponse = async () => {
    if (gdTimeLeft <= 0) return;

    const aiParticipants = gdParticipants.filter(p => p.role === "AI");
    const participant = aiParticipants[Math.floor(Math.random() * aiParticipants.length)];

    try {
      const prompt = t(`As ${participant.name} in a group discussion about "${currentTopic.title}", respond naturally in ${currentLanguage} to: ${gdMessages.slice(-3).map(m => `${m.sender}: ${m.text}`).join('\n')}`);
      
      const response = await callGeminiAPI(prompt, 'questions', currentLanguage);
      const newMessage = {
        sender: participant.name,
        text: response,
        time: new Date(),
        isUser: false,
        language: currentLanguage
      };

      setGdMessages(prev => [...prev, newMessage]);
      
      if (isSpeakerOn) {
        speakMessage(response, currentLanguage);
      }
      
      if (gdTimeLeft > 0 && Math.random() > 0.3) {
        setTimeout(aiGDResponse, 2000 + Math.random() * 3000);
      }
    } catch (error) {
      console.error("AI response error:", error);
    }
  };

  const toggleGDMicrophone = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert(t('Speech recognition not supported in your browser'));
      return;
    }
    
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      // Use spokenLanguage state instead of currentLanguage
      recognition.lang = getLanguageCode(spokenLanguage);
      recognition.interimResults = false;
      recognition.continuous = false;
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserInput(transcript);
        
        // Detect language from speech
        const detectedLang = detectSpokenLanguage(transcript);
        setSpokenLanguage(detectedLang);
        
        // Auto-send the message
        sendGDMessage();
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      try {
        recognition.start();
        recognitionRef.current = recognition;
        setIsListening(true);
      } catch (error) {
        console.error('Error starting recognition:', error);
        setIsListening(false);
      }
    }
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    if (!isSpeakerOn && currentSpeakingMessage) {
      speakMessage(currentSpeakingMessage.text, currentSpeakingMessage.language);
    } else {
      window.speechSynthesis.cancel();
    }
  };

  const speakMessage = (text, lang = currentLanguage) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getLanguageCode(lang);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      // Find a voice that matches the language
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang === getLanguageCode(lang)
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const restartGD = () => {
    if (gdTimer) {
      clearInterval(gdTimer);
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    window.speechSynthesis?.cancel();
    setGdTimer(null);
    setCurrentTopic(null);
    setGdMessages([]);
    setFeedback('');
    setPhase('setup');
    setIsListening(false);
    setSpokenLanguage(currentLanguage);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [gdMessages]);

  useEffect(() => {
    // Load voices when they become available
    const handleVoicesChanged = () => {
      // This forces the voices to be loaded
      window.speechSynthesis.getVoices();
    };
    
    window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
    
    return () => {
      if (gdTimer) {
        clearInterval(gdTimer);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis?.cancel();
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [gdTimer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GroupDiscussionStyles }} />
      <div id="group-discussion-page" className="page fade-in">
        <div className="card">
          <h1 className="card-title">{t('Group Discussion Simulation')}</h1>
          
          {/* Setup Phase */}
          {phase === 'setup' && (
            <div id="gd-setup" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card">
                  <h2 className="font-semibold mb-4">{t('Discussion Topic')}</h2>
                  <div className="flex flex-col space-y-4">
                    <button 
                      id="generate-gd-topic" 
                      className="btn btn-primaryi"
                      onClick={generateGDTopic}
                    >
                      <i className="fas fa-lightbulb mr-2"></i> 
                      <span>{t('Generate Topic')}</span>
                    </button>
                    {currentTopic && (
                      <div id="gd-topic-display" className="p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                        <h3 className="font-semibold">{currentTopic.title}</h3>
                        <p className="mt-2">{currentTopic.description}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="card">
                  <h2 className="font-semibold mb-4">{t('Discussion Settings')}</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="form-label">{t('Your Name')}</label>
                      <input 
                        type="text" 
                        id="user-name" 
                        className="form-control" 
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder={t('Enter your name')}
                      />
                    </div>
                    <div>
                      <label className="form-label">{t('Discussion Duration (minutes)')}</label>
                      <select id="gd-duration" className="form-controls form-selects">
                        <option value="1">1 {t('minute')}</option>
                        <option value="3">3 {t('minutes')}</option>
                        <option value="5">5 {t('minutes')}</option>
                        <option value="10" selected>10 {t('minutes')}</option>
                        <option value="15">15 {t('minutes')}</option>
                        <option value="20">20 {t('minutes')}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <h2 className="font-semibold mb-4">{t('Participants')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {gdParticipants.map((participant, index) => (
                    <div key={index} className="participant-card">
                      <div className={`participant-avatar bg-${participant.avatar}-100 dark:bg-${participant.avatar}-900`}>
                        <i className={participant.role === "AI" ? "fas fa-robot" : "fas fa-user"}></i>
                      </div>
                      <h3 className="participant-name">{participant.name}</h3>
                      <p className="participant-role">
                        {participant.role === "AI" ? t("AI Participant") : t("Participant")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {currentTopic && (
                <button 
                  id="start-gd" 
                  className="btn btn-primary w-full"
                  onClick={startGD}
                >
                  <i className="fas fa-users mr-2"></i> 
                  <span>{t('Start Group Discussion')}</span>
                </button>
              )}
            </div>
          )}

          {/* Discussion Phase */}
          {phase === 'discussion' && (
            <div id="gd-discussion" className="space-y-6">
              <div className="flex justify-between items-center">
                <div id="gd-timer" className="text-2xl font-mono font-bold bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                  {formatTime(gdTimeLeft)}
                </div>
                <div className="gap-2">
                  {gdTimer ? (
                    <button 
                      id="pause-gd" 
                      className="btn btn-warning"
                      onClick={pauseGD}
                    >
                      <i className="fas fa-pause"></i> 
                      <span>{t('Pause')}</span>
                    </button>
                  ) : (
                    <button 
                      id="resume-gd" 
                      className="btn btn-success"
                      onClick={resumeGD}
                    >
                      <i className="fas fa-play"></i> 
                      <span>{t('Resume')}</span>
                    </button>
                  )}
                  <button 
                    id="end-gd" 
                    className="btn btn-error"
                    onClick={endGD}
                  >
                    <i className="fas fa-stop"></i> 
                    <span>{t('End Discussion')}</span>
                  </button>
                </div>
              </div>

              <div className="card !p-0 overflow-hidden">
                <div id="gd-chatbox" className="h-96 overflow-y-auto p-4 space-y-4">
                  {gdMessages.map((message, index) => (
                    <div 
                      key={index} 
                      className={`gd-message ${message.isUser ? 'gd-message-user' : ''}`}
                      ref={index === gdMessages.length - 1 ? messagesEndRef : null}
                    >
                      <div className={`gd-message-avatar bg-${gdParticipants.find(p => p.name === message.sender)?.avatar}-100 dark:bg-${gdParticipants.find(p => p.name === message.sender)?.avatar}-900`}>
                        <i className={message.isUser ? "fas fa-user" : "fas fa-robot"}></i>
                      </div>
                      <div className="gd-message-content">
                        <div className="gd-message-name">{message.sender}</div>
                        <div className="gd-message-text">{message.text}</div>
                        <div className="gd-message-time">
                          {message.time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                        {!message.isUser && (
                          <button 
                            className="speaker-btn ml-2"
                            onClick={() => {
                              setCurrentSpeakingMessage(message);
                              speakMessage(message.text, message.language);
                            }}
                          >
                            <i className="fas fa-volume-up"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex gap-2">
            <input 
              type="text" 
              id="gd-user-input" 
              className="form-controlss" 
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') sendGDMessage();
              }}
              placeholder={t('Type your message...')}
            />
            <button 
              id="gd-send" 
              className="btn btn-primary"
              onClick={sendGDMessage}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
            <div className="flex gap-2 items-center">
              <button 
                id="gd-mic-toggle" 
                className={`btn btn-secondary ${isListening ? 'listening' : ''}`}
                onClick={toggleListening}
                disabled={!isSpeechSupported}
                title={t('voice_input')}
              >
                <i className={`fas ${isListening ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
              </button>
              {isListening && (
                <div id="gd-recording-indicator" className="flex items-center text-red-500">
                  <span className="animate-pulse">{t('Recording...')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
              </div>
            </div>
          )}

          {/* Feedback Phase */}
          {phase === 'feedback' && (
            <div id="gd-feedback" className="space-y-6">
              <div className="card bg-green-50 dark:bg-green-900 dark:bg-opacity-20">
                <h2 className="font-semibold text-green-700 dark:text-green-300">
                  <i className="fas fa-star mr-2"></i> 
                  <span>{t('Group Discussion Feedback')}</span>
                </h2>
                <div id="gd-feedback-content" className="mt-4 space-y-4">
                  {feedback ? (
                    <div className="prose dark:prose-invert max-w-none">
                      {feedback.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <span className="spinner"></span> 
                      <span>{t('Generating feedback...')}</span>
                    </div>
                  )}
                </div>
              </div>
              <button 
                id="gd-restart" 
                className="btn btn-primary w-full"
                onClick={restartGD}
              >
                <i className="fas fa-redo mr-2"></i> 
                <span>{t('Start New Discussion')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}