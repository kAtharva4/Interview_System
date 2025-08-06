// src/pages/HRInterview.jsx
import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { callGeminiAPI } from '../utils/api';
import { jsPDF } from 'jspdf';
// const TechnicalStyles = `
import { saveAnswerToDatabase } from "../utils/serverHelpers";
import { saveAnswerToDatabaseWithFallback } from "../utils/serverHelpers";
import "./HRInterview.css"
export default function HRInterview() {
  const { t } = useLanguage();
  const [category, setCategory] = useState('Behavioral');
  const [topic, setTopic] = useState('');
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
      const fullTopic = topic ? `${category} (${topic})` : category;
      const prompt = `Generate 5 HR interview questions about ${fullTopic}.
        Include a mix of common and challenging questions.
        Format each question exactly as follows:
        
        Question: [question text]
        Expected Answer: [detailed expected answer]
        
        ---`;
      
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
      if (lines.length < 2) return null;
      
      const question = {
        id: `hr-${Date.now()}-${index}`,
        question: lines[0].replace('Question:', '').trim(),
        correctAnswer: '',
        category,
        topic: topic || category
      };

      const answerLines = [];
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].startsWith('Expected Answer:')) {
          answerLines.push(lines[i].replace('Expected Answer:', '').trim());
        } else {
          answerLines.push(lines[i].trim());
        }
      }
      question.correctAnswer = answerLines.join('\n');

      return question;
    }).filter(q => q !== null);
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

      const prompt = `Evaluate this HR interview answer on a scale of 1-10:
        Question: ${question.question}
        Expected Answer: ${question.correctAnswer}
        User Answer: ${userAnswer || t("No answer provided")}
        
        Provide feedback in this format:
        Score: [score]/10
        Feedback: [2-3 line feedback]
        Improvement Suggestions: [2-3 suggestions]`;

      const response = await callGeminiAPI(prompt, "feedback");
      const parsedFeedback = parseFeedback(response);

      newFeedback.push(parsedFeedback);
      totalScore += parsedFeedback.score;

      // ✅ Save answer and feedback to DB
      try {
        await saveAnswerToDatabase({
          question: question.question,
          userAnswer,
          category: question.category || "hr",
          topic: question.topic || "general",
          feedback: parsedFeedback
        });
        const answerPayload = {
                question: question.question,
                userAnswer,
                category: question.category || "technical",
                topic: question.topic || "general",
                feedback: parsedFeedback,
              };
        
              const saveRes1 = await saveAnswerToDatabaseWithFallback(answerPayload);
        
      } catch (dbErr) {
        console.error(`Failed to save answer for Q${i + 1}:`, dbErr);
      }
    }

    setFeedback(newFeedback);
    setShowFeedback(true);
  } catch (err) {
    setError(t("Failed to evaluate answers. Please try again."));
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
      improvementSuggestions: ''
    };

    let currentSection = '';
    lines.forEach(line => {
      if (line.startsWith('Score:')) {
        feedback.score = parseInt(line.match(/\d+/)?.[0] || 0);
      } else if (line.startsWith('Feedback:')) {
        currentSection = 'feedback';
        feedback.feedback = line.replace('Feedback:', '').trim();
      } else if (line.startsWith('Improvement Suggestions:')) {
        currentSection = 'improvementSuggestions';
        feedback.improvementSuggestions = line.replace('Improvement Suggestions:', '').trim();
      } else {
        if (currentSection === 'feedback') {
          feedback.feedback += '\n' + line.trim();
        } else if (currentSection === 'improvementSuggestions') {
          feedback.improvementSuggestions += '\n' + line.trim();
        }
      }
    });

    return feedback;
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setProperties({
      title: `HR Interview Questions - ${category}`,
      subject: 'HR Interview Practice',
      author: 'Interview Prep App'
    });

    doc.setFontSize(18);
    doc.text(`HR Interview Questions: ${category}${topic ? ` (${topic})` : ''}`, 105, 15, { align: 'center' });
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

      doc.setFont(undefined, 'normal');
      const answerLines = doc.splitTextToSize(
        `Your answer: ${answers[i] || t('No answer')}`,
        maxWidth - 10
      );
      doc.text(answerLines, margin + 5, yPosition);
      yPosition += answerLines.length * 7;

      if (showFeedback && feedback[i]) {
        doc.setFont(undefined, 'italic');
        doc.setTextColor(0, 100, 0);
        const feedbackText = doc.splitTextToSize(
          `Score: ${feedback[i].score}/10\n` +
          `Feedback: ${feedback[i].feedback}\n` +
          `Improvement Suggestions: ${feedback[i].improvementSuggestions}\n` +
          `Expected Answer: ${q.correctAnswer}`,
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

    doc.save(`hr-questions-${new Date().toISOString().slice(0,10)}.pdf`);
  };

  return (
    
    // <><style dangerouslySetInnerHTML={{ __html: TechnicalStyles }} />
    <div id="hr-interview-page" className="page fade-in">
      <div className="card">
        <h1 className="card-title">{t('HR Interview Preparation')}</h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <select 
            id="hr-category" 
            className="form-control form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="General">{t('General HR')}</option>
            <option value="Behavioral">{t('Behavioral')}</option>
            <option value="Situational">{t('Situational')}</option>
            <option value="Company Specific">{t('Company Specific')}</option>
          </select>
          
          <input 
            type="text" 
            id="hr-topic" 
            className="form-control"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={t('Enter specific focus area...')}
          />
          
          <button 
            id="generate-hr-questions" 
            className="btn btn-primary"
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
      </div>
    
      {error && <div className="text-red-500 mb-4">{error}</div>}
    
      {questions.length > 0 && (
        <div id="hr-questions-container">
          <div id="hr-questions-list" className="space-y-6">
            {questions.map((question, index) => (
              <div key={question.id} className="question-card">
                <div className="question-header">
                  <h3 className="question-text">
                    {t('Question')} {index + 1}: {question.question}
                  </h3>
                </div>

                <div className="input-group mt-4">
                  <textarea 
                    className="answer-input w-full"
                    value={answers[index] || ''}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    placeholder={t('Enter your answer...')}
                    rows="5"
                  />
                </div>

                <div className="question-meta mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {question.category} • {question.topic}
                </div>
              </div>
            ))}
          </div>
          
          <button 
            id="submit-all-hr-answers" 
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
            <div id="hr-overall-feedback" className="feedback-card mt-6">
              <div className="feedback-score">
                {t('Overall Score')}: {Math.round(
                  feedback.reduce((sum, fb) => sum + fb.score, 0) / questions.length
                )}/10
              </div>
              <div className="feedback-text">
                {feedback[0]?.score >= 8 ? t('Excellent! Your answers demonstrate strong communication skills and preparation.') :
                 feedback[0]?.score >= 5 ? t('Good job! You have solid answers but could improve in some areas.') :
                 t('Keep practicing! Review the feedback to improve your interview skills.')}
              </div>
              
              <div className="feedback-section mt-6">
                <div className="feedback-section-title">
                  <i className="fas fa-lightbulb text-blue-500"></i>
                  <span>{t('Detailed Feedback')}</span>
                </div>

                {questions.map((question, index) => (
                  <div key={index} className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="font-semibold">
                      {t('Question')} {index + 1}: {question.question}
                    </p>
                    <div className="answer-display mt-2">
                      {t('Your answer')}: {answers[index] || t('No answer provided')}
                    </div>
                    <p className={`mt-1 text-sm ${
                      feedback[index].score > 5 ? 
                      'text-green-600 dark:text-green-400' : 
                      'text-red-600 dark:text-red-400'
                    }`}>
                      {t('Score')}: {feedback[index].score}/10
                    </p>
                    <p className="mt-1">{feedback[index].feedback}</p>
                    {feedback[index].improvementSuggestions && (
                      <div className="mt-2 p-2 bg-blue-50 dark:bg-gray-800 rounded">
                        <p className="text-sm font-semibold">{t('Improvement Suggestions')}:</p>
                        <p>{feedback[index].improvementSuggestions}</p>
                      </div>
                    )}
                    <div className="mt-2 p-2 bg-green-50 dark:bg-gray-800 rounded">
                      <p className="text-sm font-semibold">{t('Expected Answer')}:</p>
                      <p>{question.correctAnswer}</p>
                    </div>
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
    </div>
  );
}