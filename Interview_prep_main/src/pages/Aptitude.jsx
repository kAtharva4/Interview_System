// src/pages/Aptitude.jsx
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { callGeminiAPI } from '../utils/api';
import { jsPDF } from 'jspdf';
const AptituteStyles = `/* Aptitude Page Specific Styles */
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
#aptitude-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

#aptitude-page .card {
  background-color: var(--card-light);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.dark #aptitude-page .card {
  background-color: var(--card-dark);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

#aptitude-page .card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.dark #aptitude-page .card:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

/* Question Grid Layout */
.grid {
  display: grid;
  gap: 1.5rem;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, 1fr);
}

@media (min-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Form Elements */
.form-label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: var(--text-light);
}

.dark .form-label {
  color: var(--text-dark);
}

.form-control {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-light);
  background-color: var(--card-light);
  color: var(--text-light);
  font-family: inherit;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.dark .form-control {
  border-color: var(--border-dark);
  background-color: var(--card-dark);
  color: var(--text-dark);
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-light);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
}

.dark .form-control:focus {
  border-color: var(--primary-dark);
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
}

/* Buttons */
.btn {
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
}

.btn-primary {
  background-color: var(--primary-light);
  color: white;
}

.dark .btn-primary {
  background-color: var(--primary-dark);
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background-color: var(--card-light);
  color: var(--text-light);
  border: 1px solid var(--border-light);
}

.dark .btn-secondary {
  background-color: var(--card-dark);
  color: var(--text-dark);
  border: 1px solid var(--border-dark);
}

.btn-secondary:hover {
  background-color: rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.dark .btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.w-full {
  width: 100%;
}

/* Question Cards */
.question-card {
  background-color: var(--card-light);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border-left: 4px solid var(--primary-light);
  transition: all 0.3s ease;
}

.dark .question-card {
  background-color: var(--card-dark);
  border-left-color: var(--primary-dark);
}

.question-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.dark .question-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.question-text {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-light);
}

.dark .question-text {
  color: var(--text-dark);
}

.question-meta {
  font-size: 0.85rem;
  opacity: 0.7;
}

/* Radio Options */
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.radio-option:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.dark .radio-option:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.radio-input {
  appearance: none;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--border-light);
  border-radius: 50%;
  margin: 0;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.dark .radio-input {
  border-color: var(--border-dark);
}

.radio-input:checked {
  border-color: var(--primary-light);
}

.dark .radio-input:checked {
  border-color: var(--primary-dark);
}

.radio-input:checked::after {
  content: '';
  position: absolute;
  width: 0.75rem;
  height: 0.75rem;
  background-color: var(--primary-light);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.dark .radio-input:checked::after {
  background-color: var(--primary-dark);
}

/* Answer Input */
.answer-input {
  width: 98%;
  min-height: 100px;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-light);
  background-color: var(--card-light);
  color: var(--text-light);
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.dark .answer-input {
  border-color: var(--border-dark);
  background-color: var(--card-dark);
  color: var(--text-dark);
}

.answer-input:focus {
  outline: none;
  border-color: var(--primary-light);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
}

.dark .answer-input:focus {
  border-color: var(--primary-dark);
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
}

/* Feedback Section */
.feedback-card {
  background-color: var(--card-light);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-top: 2rem;
  border-left: 4px solid var(--success-light);
  transition: all 0.3s ease;
}

.dark .feedback-card {
  background-color: var(--card-dark);
  border-left-color: var(--success-dark);
}

.feedback-score {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--success-light);
  text-align: center;
}

.dark .feedback-score {
  color: var(--success-dark);
}

.feedback-section {
  margin-bottom: 1.5rem;
}

.feedback-section-title {
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary-light);
}

.dark .feedback-section-title {
  color: var(--primary-dark);
}

/* Question-wise Feedback */
.question-wise-feedback {
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 0.75rem;
  padding: 1.25rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.dark .question-wise-feedback {
  background-color: rgba(255, 255, 255, 0.03);
}

.text-green-600 {
  color: var(--success-light);
}

.dark .text-green-600 {
  color: var(--success-dark);
}

.text-red-600 {
  color: var(--error-light);
}

.dark .text-red-600 {
  color: var(--error-dark);
}

.text-blue-500 {
  color: var(--primary-light);
}

.dark .text-blue-500 {
  color: var(--primary-dark);
}

/* Spinner */
.spinner {
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: currentColor;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Utility Classes */
.space-y-6 > * + * {
  margin-top: 1.5rem;
}

.mt-1 { margin-top: 0.25rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-3 { margin-top: 0.75rem; }
.mt-4 { margin-top: 1rem; }
.mt-5 { margin-top: 1.25rem; }
.mt-6 { margin-top: 1.5rem; }

.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 0.75rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-5 { margin-bottom: 1.25rem; }
.mb-6 { margin-bottom: 1.5rem; }

.text-sm { font-size: 0.875rem; }
.text-red-500 { color: var(--error-light); }
.dark .text-red-500 { color: var(--error-dark); }

.flex { display: flex; }
.justify-between { justify-content: space-between; }
.justify-end { justify-content: flex-end; }
.items-center { align-items: center; }
.gap-4 { gap: 1rem; }

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.question-card {
  animation: fadeIn 0.5s ease forwards;
}

/* Responsive Adjustments */
@media (max-width: 640px) {
  #aptitude-page {
    padding: 1rem 0.5rem;
  }
  
  .question-card {
    padding: 1rem;
  }
  
  .feedback-card {
    padding: 1rem;
  }
}

/* Enhanced PDF Export Button */
.export-pdf {
  position: relative;
  overflow: hidden;
}

.export-pdf::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0.3),
    rgba(255, 255, 255, 0)
  );
  transform: rotate(30deg);
  transition: all 0.3s ease;
}

.export-pdf:hover::after {
  left: 100%;
}

.dark .export-pdf::after {
  background: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0)
  );
}

/* Category-specific colors */
#aptitude-page .question-card[data-category="Quantitative"] {
  border-left-color: #3b82f6;
}

#aptitude-page .question-card[data-category="Logical"] {
  border-left-color: #10b981;
}

#aptitude-page .question-card[data-category="Verbal"] {
  border-left-color: #8b5cf6;
}

#aptitude-page .question-card[data-category="Data Interpretation"] {
  border-left-color: #f59e0b;
}

#aptitude-page .question-card[data-category="Puzzles"] {
  border-left-color: #ef4444;
}`

export default function Aptitude() {
  const { t } = useLanguage();
  const [category, setCategory] = useState('Quantitative');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const generateQuestions = async () => {
    setIsLoading(true);
    setError('');
    try {
      const prompt = `Generate 5 unique aptitude questions on ${category} (${difficulty} level):
        - First 3 questions should be theoretical/conceptual (no options)
        - Last 2 questions should be MCQ with 4 options each
        - Format exactly as follows:
        
        Question 1: [theoretical question]
        ---
        Question 2: [theoretical question]
        ---
        Question 3: [theoretical question]
        ---
        Question 4: [MCQ question]
        Options:
        1) [option1]
        2) [option2]
        3) [option3]
        4) [option4]
        Correct Answer: [number]
        ---
        Question 5: [MCQ question]
        Options:
        1) [option1]
        2) [option2]
        3) [option3]
        4) [option4]
        Correct Answer: [number]`;

      const response = await callGeminiAPI(prompt, 'questions');
      const parsedQuestions = parseQuestions(response);
      setQuestions(parsedQuestions);
      setAnswers(Array(parsedQuestions.length).fill(''));
      setFeedback([]);
      setShowFeedback(false);
    } catch (err) {
      setError(t('Failed to generate questions. Please try again.'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const parseQuestions = (text) => {
    const questionBlocks = text.split('---').filter(block => block.trim() !== '');
    return questionBlocks.map((block, index) => {
      const lines = block.split('\n').filter(line => line.trim() !== '');
      const question = {
        id: `apt-${Date.now()}-${index}`,
        question: lines[0].replace(/Question \d+:/i, '').trim(),
        options: [],
        correctAnswer: '',
        category,
        difficulty,
        type: index >= 3 ? 'MCQ' : 'Theory'
      };

      if (question.type === 'MCQ') {
        let optionsStart = lines.findIndex(line => line.includes('Options:'));
        if (optionsStart >= 0) {
          for (let i = optionsStart + 1; i < lines.length; i++) {
            const optionMatch = lines[i].match(/^\d+\)\s*(.+)/);
            if (optionMatch) {
              question.options.push(optionMatch[1].trim());
            } else if (lines[i].includes('Correct Answer:')) {
              question.correctAnswer = lines[i].replace('Correct Answer:', '').trim();
              break;
            }
          }
        }
      }

      return question;
    });
  };

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const submitAnswers = async () => {
    setIsLoading(true);
    try {
      const newFeedback = [];
      let totalScore = 0;

      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const userAnswer = answers[i];

        if (question.type === 'MCQ') {
          const isCorrect = userAnswer === question.correctAnswer;
          newFeedback.push({
            score: isCorrect ? 10 : 0,
            feedback: isCorrect ? t('Correct answer!') : 
              `${t('Incorrect. The correct answer was option')} ${question.correctAnswer}.`,
            expectedAnswer: question.options[parseInt(question.correctAnswer) - 1]
          });
          totalScore += isCorrect ? 10 : 0;
        } else {
          const prompt = `Evaluate this aptitude question answer (1-10 scale):
            Question: ${question.question}
            User Answer: ${userAnswer || t('No answer provided')}
            
            Provide feedback in format:
            Score: [score]/10
            Feedback: [feedback text]
            Expected Answer: [expected answer]`;

          const response = await callGeminiAPI(prompt, 'feedback');
          const parsedFeedback = parseFeedback(response);
          newFeedback.push(parsedFeedback);
          totalScore += parsedFeedback.score;
        }
      }

      // Save progress to localStorage
      const currentProgress = JSON.parse(localStorage.getItem('userProgress')) || {
        aptitude: { 
          categories: {
            Quantitative: { completed: 0, totalScore: 0, sessions: 0 },
            Logical: { completed: 0, totalScore: 0, sessions: 0 },
            Verbal: { completed: 0, totalScore: 0, sessions: 0 },
            Data: { completed: 0, totalScore: 0, sessions: 0 },
            Puzzles: { completed: 0, totalScore: 0, sessions: 0 }
          },
          sessions: []
        }
      };

      const updatedProgress = {
        ...currentProgress,
        aptitude: {
          ...currentProgress.aptitude,
          categories: {
            ...currentProgress.aptitude.categories,
            [category]: {
              completed: (currentProgress.aptitude.categories[category]?.completed || 0) + questions.length,
              totalScore: (currentProgress.aptitude.categories[category]?.totalScore || 0) + totalScore,
              sessions: (currentProgress.aptitude.categories[category]?.sessions || 0) + 1
            }
          },
          sessions: [
            ...currentProgress.aptitude.sessions,
            {
              date: new Date().toISOString(),
              category,
              difficulty,
              score: Math.round(totalScore / questions.length),
              questionsAttempted: questions.length,
              details: questions.map((q, i) => ({
                question: q.question,
                userAnswer: answers[i],
                score: newFeedback[i].score,
                feedback: newFeedback[i].feedback
              }))
            }
          ]
        }
      };

      localStorage.setItem('userProgress', JSON.stringify(updatedProgress));

      setFeedback(newFeedback);
      setShowFeedback(true);
    } catch (err) {
      setError(t('Failed to evaluate answers. Please try again.'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const parseFeedback = (text) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const feedback = {
      score: 0,
      feedback: '',
      expectedAnswer: ''
    };

    lines.forEach(line => {
      if (line.startsWith('Score:')) {
        feedback.score = parseInt(line.match(/\d+/)?.[0] || 0);
      } else if (line.startsWith('Feedback:')) {
        feedback.feedback = line.replace('Feedback:', '').trim();
      } else if (line.startsWith('Expected Answer:')) {
        feedback.expectedAnswer = line.replace('Expected Answer:', '').trim();
      } else if (!feedback.feedback) {
        feedback.feedback = line.trim();
      }
    });

    return feedback;
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setProperties({
      title: `Aptitude Questions - ${category}`,
      subject: 'Aptitude Practice',
      author: 'Interview Prep App'
    });

    doc.setFontSize(18);
    doc.text(`Aptitude Questions: ${category} (${difficulty})`, 105, 15, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 22, { align: 'center' });

    let yPosition = 30;
    const margin = 15;
    const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;

    questions.forEach((q, i) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      const questionLines = doc.splitTextToSize(`${i+1}. ${q.question}`, maxWidth);
      doc.text(questionLines, margin, yPosition);
      yPosition += questionLines.length * 7;

      if (q.options.length > 0) {
        doc.setFont(undefined, 'normal');
        const optionLines = q.options.map((opt, j) => 
          `${String.fromCharCode(97 + j)}) ${opt}`
        ).join('\n');
        const optionsText = doc.splitTextToSize(optionLines, maxWidth - 10);
        doc.text(optionsText, margin + 5, yPosition);
        yPosition += optionsText.length * 7;
      }

      if (showFeedback && feedback[i]) {
        doc.setFont(undefined, 'italic');
        doc.setTextColor(0, 100, 0);
        const feedbackText = doc.splitTextToSize(
          `Your answer: ${answers[i] || t('No answer')}\n` +
          `Score: ${feedback[i].score}/10\n` +
          `Feedback: ${feedback[i].feedback}\n` +
          `Expected Answer: ${feedback[i].expectedAnswer || q.correctAnswer}`,
          maxWidth - 10
        );
        doc.text(feedbackText, margin + 5, yPosition);
        doc.setTextColor(0, 0, 0);
        yPosition += feedbackText.length * 7;
      }

      yPosition += 10;
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(`Page ${i} of ${pageCount}`, 105, 287, { align: 'center' });
    }

    doc.save(`aptitude-questions-${new Date().toISOString().slice(0,10)}.pdf`);
  };

  return (
    <>
    <style dangerouslySetInnerHTML={{ __html: AptituteStyles }} />
    <div id="aptitude-page" className="page">
      <div className="card">
        <h1 className="card-title">{t('Aptitude Practice')}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="card">
            <h2 className="form-label">{t('Select Category')}</h2>
            <select 
              className="form-control form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Quantitative">{t('Quantitative')}</option>
              <option value="Logical">{t('Logical Reasoning')}</option>
              <option value="Verbal">{t('Verbal Ability')}</option>
              <option value="Data Interpretation">{t('Data Interpretation')}</option>
              <option value="Puzzles">{t('Puzzles')}</option>
            </select>
          </div>

          <div className="card">
            <h2 className="form-label">{t('Select Difficulty')}</h2>
            <select 
              className="form-control form-select"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="Easy">{t('Easy')}</option>
              <option value="Medium">{t('Medium')}</option>
              <option value="Hard">{t('Hard')}</option>
            </select>
          </div>
        </div>

        <button 
          className="btn btn-primary w-full"
          onClick={generateQuestions}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="spinner"></span>
          ) : (
            t('Generate Questions')
          )}
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {questions.length > 0 && (
        <div id="aptitude-questions-container">
          <div id="aptitude-questions-list" className="space-y-6">
            {questions.map((question, index) => (
              <div key={question.id} className="question-card">
                <div className="question-header">
                  <h3 className="question-text">
                    {t('Question')} {index + 1}: {question.question}
                  </h3>
                </div>

                {question.options.length > 0 ? (
                  <div className="radio-group mt-4">
                    {question.options.map((opt, i) => (
                      <label key={i} className="radio-option">
                        <input 
                          type="radio" 
                          name={`aptitude-${question.id}`} 
                          value={i + 1}
                          checked={answers[index] === String(i + 1)}
                          onChange={() => handleAnswerChange(index, String(i + 1))}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="input-group mt-4">
                    <textarea 
                      className="answer-input w-full" 
                      value={answers[index] || ''}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      placeholder={t('Enter your answer...')}
                      rows="3"
                    />
                  </div>
                )}

                <div className="question-meta mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {question.category} • {question.difficulty} • {question.type}
                </div>
              </div>
            ))}
          </div>
          
          <button 
            className="btn btn-primary w-full mt-6"
            onClick={submitAnswers}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spinner"></span>
            ) : (
              t('Submit All Answers')
            )}
          </button>
          
          {showFeedback && (
            <div id="aptitude-overall-feedback" className="feedback-card mt-6">
              <div className="feedback-score">
                {t('Overall Score')}: {Math.round(
                  feedback.reduce((sum, fb) => sum + fb.score, 0) / questions.length
                )}/10
              </div>
              
              <div className="feedback-section mt-6">
                <div className="feedback-section-title">
                  <i className="fas fa-lightbulb text-blue-500"></i>
                  <span>{t('Question-wise Feedback')}</span>
                </div>

                {questions.map((question, index) => (
                  <div key={index} className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="font-semibold">
                      {t('Question')} {index + 1}: {question.question}
                    </p>
                    <p className="mt-2">
                      {t('Your answer')}: {answers[index] || t('No answer provided')}
                    </p>
                    <p className={`mt-1 text-sm ${
                      feedback[index].score > 5 ? 
                      'text-green-600 dark:text-green-400' : 
                      'text-red-600 dark:text-red-400'
                    }`}>
                      {t('Score')}: {feedback[index].score}/10
                    </p>
                    <p className="mt-1">{feedback[index].feedback}</p>
                    {feedback[index].expectedAnswer && (
                      <div className="mt-2 p-2 bg-blue-50 dark:bg-gray-800 rounded">
                        <p className="text-sm font-semibold">{t('Expected Answer')}:</p>
                        <p>{feedback[index].expectedAnswer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {showFeedback && (
            <div className="flex justify-end gap-4 mt-6">
              <button 
                className="btn btn-secondary export-pdf"
                onClick={exportToPDF}
              >
                <i className="fas fa-file-pdf mr-2"></i> 
                <span>{t('Export to PDF')}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div></>
  );
}