// src/pages/Bookmarks.jsx
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { jsPDF } from 'jspdf';
const HRInterviewStyles = `
/* HR Interview Page Styles */
:root {
  /* Base Technical Colors */
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
  
  /* HR-Specific Colors */
  --behavioral-light: #8b5cf6;
  --behavioral-dark: #a78bfa;
  --situational-light: #10b981;
  --situational-dark: #34d399;
  --company-light: #ec4899;
  --company-dark: #f472b6;
  --general-light: #3b82f6;
  --general-dark: #60a5fa;
}

/* Animation Keyframes */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Base Styles */
.hr-interview-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
  animation: fadeInUp 0.5s ease forwards;
}

.dark .hr-interview-page {
  background-color: var(--bg-dark);
  color: var(--text-dark);
}

/* Card Styles */
.hr-card {
  background-color: var(--card-light);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: fadeIn 0.3s ease forwards;
}

.dark .hr-card {
  background-color: var(--card-dark);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.hr-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.dark .hr-card:hover {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.3);
}

.hr-card-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--primary-light);
  text-align: center;
}

.dark .hr-card-title {
  color: var(--primary-dark);
}

/* Form Elements */
.hr-form-control {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-light);
  background-color: var(--card-light);
  color: var(--text-light);
  font-family: inherit;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.dark .hr-form-control {
  border-color: var(--border-dark);
  background-color: var(--card-dark);
  color: var(--text-dark);
}

.hr-form-control:focus {
  outline: none;
  border-color: var(--primary-light);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
}

.dark .hr-form-control:focus {
  border-color: var(--primary-dark);
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
}

.hr-form-select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
}

/* Buttons */
.hr-btn {
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

.hr-btn-primary {
  background-color: var(--primary-light);
  color: white;
}

.dark .hr-btn-primary {
  background-color: var(--primary-dark);
}

.hr-btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.hr-btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.hr-btn-secondary {
  background-color: var(--card-light);
  color: var(--text-light);
  border: 1px solid var(--border-light);
}

.dark .hr-btn-secondary {
  background-color: var(--card-dark);
  color: var(--text-dark);
  border: 1px solid var(--border-dark);
}

/* Question Cards */
.hr-question-card {
  background-color: var(--card-light);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border-left: 4px solid var(--primary-light);
  transition: all 0.3s ease;
  animation: fadeIn 0.5s ease forwards;
}

.dark .hr-question-card {
  background-color: var(--card-dark);
  border-left-color: var(--primary-dark);
}

.hr-question-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.dark .hr-question-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.hr-question-text {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-light);
  line-height: 1.5;
}

.dark .hr-question-text {
  color: var(--text-dark);
}

.hr-question-meta {
  font-size: 0.85rem;
  opacity: 0.7;
}

/* Answer Input */
.hr-answer-input {
  width: 100%;
  min-height: 150px;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-light);
  background-color: var(--card-light);
  color: var(--text-light);
  font-family: inherit;
  font-size: 0.95rem;
  line-height: 1.6;
  resize: vertical;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.dark .hr-answer-input {
  border-color: var(--border-dark);
  background-color: var(--card-dark);
  color: var(--text-dark);
}

.hr-answer-input:focus {
  outline: none;
  border-color: var(--primary-light);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
}

.dark .hr-answer-input:focus {
  border-color: var(--primary-dark);
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
}

/* Feedback Section */
.hr-feedback-card {
  background-color: var(--card-light);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-top: 2rem;
  border-left: 4px solid var(--success-light);
  transition: all 0.3s ease;
}

.dark .hr-feedback-card {
  background-color: var(--card-dark);
  border-left-color: var(--success-dark);
}

.hr-feedback-score {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--success-light);
  text-align: center;
}

.dark .hr-feedback-score {
  color: var(--success-dark);
}

.hr-feedback-text {
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 500;
  font-size: 1.1rem;
}

.hr-feedback-section {
  margin-bottom: 1.5rem;
}

.hr-feedback-section-title {
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary-light);
  font-size: 1.2rem;
}

.dark .hr-feedback-section-title {
  color: var(--primary-dark);
}

/* Answer Display */
.hr-answer-display {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin: 0.5rem 0;
  white-space: pre-wrap;
  line-height: 1.6;
}

.dark .hr-answer-display {
  background-color: rgba(255, 255, 255, 0.05);
}

/* Category-specific colors */
.hr-question-card[data-category="General"] {
  border-left-color: var(--general-light);
}
.dark .hr-question-card[data-category="General"] {
  border-left-color: var(--general-dark);
}

.hr-question-card[data-category="Behavioral"] {
  border-left-color: var(--behavioral-light);
}
.dark .hr-question-card[data-category="Behavioral"] {
  border-left-color: var(--behavioral-dark);
}

.hr-question-card[data-category="Situational"] {
  border-left-color: var(--situational-light);
}
.dark .hr-question-card[data-category="Situational"] {
  border-left-color: var(--situational-dark);
}

.hr-question-card[data-category="Company Specific"] {
  border-left-color: var(--company-light);
}
.dark .hr-question-card[data-category="Company Specific"] {
  border-left-color: var(--company-dark);
}

/* Improvement Suggestions */
.hr-improvement-box {
  background-color: rgba(96, 165, 250, 0.1);
  border-radius: 0.5rem;
  padding: 0.75rem;
  margin-top: 0.5rem;
}

.dark .hr-improvement-box {
  background-color: rgba(96, 165, 250, 0.2);
}

/* Utility Classes */
.hr-text-green-600 {
  color: var(--success-light);
}
.dark .hr-text-green-600 {
  color: var(--success-dark);
}

.hr-text-red-600 {
  color: var(--error-light);
}
.dark .hr-text-red-600 {
  color: var(--error-dark);
}

.hr-text-blue-500 {
  color: var(--primary-light);
}
.dark .hr-text-blue-500 {
  color: var(--primary-dark);
}

.hr-flex {
  display: flex;
}
.hr-flex-col {
  flex-direction: column;
}
.hr-flex-row {
  flex-direction: row;
}
.hr-justify-between {
  justify-content: space-between;
}
.hr-justify-end {
  justify-content: flex-end;
}
.hr-items-center {
  align-items: center;
}
.hr-gap-4 {
  gap: 1rem;
}
.hr-space-y-6 > * + * {
  margin-top: 1.5rem;
}

/* Spinner */
.hr-spinner {
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: currentColor;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
}

/* Error Message */
.hr-error-message {
  color: var(--error-light);
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: rgba(239, 68, 68, 0.1);
  border-radius: 0.5rem;
  animation: fadeIn 0.3s ease;
}

.dark .hr-error-message {
  color: var(--error-dark);
  background-color: rgba(239, 68, 68, 0.2);
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .hr-interview-page {
    padding: 1rem 0.5rem;
  }
  
  .hr-question-card {
    padding: 1rem;
  }
  
  .hr-feedback-card {
    padding: 1rem;
  }
  
  .hr-answer-input {
    min-height: 120px;
  }
  
  .hr-card-title {
    font-size: 1.3rem;
  }
}

@media (max-width: 640px) {
  .hr-flex-col,
  .hr-flex-row {
    flex-direction: column;
  }
}
`
export default function Bookmarks() {
  const { t } = useLanguage();
  const [bookmarks, setBookmarks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [filteredBookmarks, setFilteredBookmarks] = useState([]);

  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarkedQuestions') || '[]');
    setBookmarks(savedBookmarks);
  }, []);

  useEffect(() => {
    const filtered = bookmarks.filter(bookmark => {
      const matchesSearch = bookmark.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (bookmark.category && bookmark.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (bookmark.topic && bookmark.topic.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = categoryFilter === 'All' || bookmark.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
    setFilteredBookmarks(filtered);
  }, [bookmarks, searchQuery, categoryFilter]);

  const removeBookmark = (id) => {
    const updatedBookmarks = bookmarks.filter(bookmark => bookmark.id !== id);
    setBookmarks(updatedBookmarks);
    localStorage.setItem('bookmarkedQuestions', JSON.stringify(updatedBookmarks));
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setProperties({
      title: 'Bookmarked Questions',
      subject: 'Interview Preparation',
      author: 'Interview Prep App'
    });

    doc.setFontSize(18);
    doc.text('Bookmarked Questions', 105, 15, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 22, { align: 'center' });

    let yPosition = 30;
    const margin = 15;
    const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;

    filteredBookmarks.forEach((bookmark, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      const questionLines = doc.splitTextToSize(`${index + 1}. ${bookmark.question}`, maxWidth);
      doc.text(questionLines, margin, yPosition);
      yPosition += questionLines.length * 7;

      if (bookmark.options) {
        doc.setFont(undefined, 'normal');
        const optionLines = bookmark.options.map((opt, j) => 
          `${String.fromCharCode(97 + j)}) ${opt}`
        ).join('\n');
        const optionsText = doc.splitTextToSize(optionLines, maxWidth - 10);
        doc.text(optionsText, margin + 5, yPosition);
        yPosition += optionsText.length * 7;
      }

      if (bookmark.correctAnswer) {
        doc.setFont(undefined, 'italic');
        doc.setTextColor(0, 100, 0);
        const answerText = doc.splitTextToSize(
          `Answer: ${bookmark.options ? 
            String.fromCharCode(97 + parseInt(bookmark.correctAnswer) - 1) + ') ' + 
            bookmark.options[parseInt(bookmark.correctAnswer) - 1] : 
            bookmark.correctAnswer}`,
          maxWidth - 10
        );
        doc.text(answerText, margin + 5, yPosition);
        doc.setTextColor(0, 0, 0);
        yPosition += answerText.length * 7;
      }

      // Add metadata
      doc.setFontSize(10);
      doc.setTextColor(100);
      const meta = [];
      if (bookmark.category) meta.push(bookmark.category);
      if (bookmark.difficulty) meta.push(bookmark.difficulty);
      if (bookmark.type) meta.push(bookmark.type);
      
      if (meta.length > 0) {
        doc.text(meta.join(' • '), margin, yPosition);
        yPosition += 7;
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

    doc.save(`bookmarked-questions-${new Date().toISOString().slice(0,10)}.pdf`);
  };

  const categories = ['All', ...new Set(bookmarks.map(b => b.category).filter(Boolean))];

  return (
    <><style dangerouslySetInnerHTML={{ __html: HRInterviewStyles }} />
    <div id="bookmarks-page" className="page fade-in">
      <div className="card">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">{t('Bookmarked Questions')}</h1>
          
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <input 
                type="text" 
                id="bookmark-search" 
                className="form-control pl-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('Search bookmarks...')}
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
            
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <label htmlFor="bookmark-category-filter">{t('Filter by')}:</label>
              <select 
                id="bookmark-category-filter" 
                className="form-control form-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredBookmarks.length === 0 ? (
          <div id="bookmarks-empty" className="text-center py-12">
            <i className="far fa-bookmark text-4xl text-gray-400 dark:text-gray-600 mb-4"></i>
            <p>{t('No bookmarked questions found')}</p>
          </div>
        ) : (
          <div id="bookmarks-list" className="space-y-6">
            {filteredBookmarks.map((bookmark, index) => (
              <div key={bookmark.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-gray-900 dark:text-white font-bold text-lg">
                    {index + 1}. {bookmark.question}
                  </h3>
                  <button 
                    className="bookmark-btn bookmarked"
                    onClick={() => removeBookmark(bookmark.id)}
                    title={t('Remove bookmark')}
                  >
                    <i className="fas fa-bookmark"></i>
                  </button>
                </div>
                
                {bookmark.options && (
                  <div className="mb-4">
                    {bookmark.options.map((option, i) => (
                      <div key={i} className="mb-2">
                        <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                          <input 
                            type="radio" 
                            name={`bookmark-${bookmark.id}`} 
                            className="form-radio" 
                            disabled 
                            checked={bookmark.correctAnswer === String(i + 1)}
                          />
                          <span>{option}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {bookmark.category && (
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                      {bookmark.category}
                    </span>
                  )}
                  {bookmark.topic && (
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs">
                      {bookmark.topic}
                    </span>
                  )}
                  {bookmark.difficulty && (
                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs">
                      {bookmark.difficulty}
                    </span>
                  )}
                </div>
              </div>
            ))}
            
            <div className="flex justify-end mt-6">
              <button 
                className="btn btn-secondary export-pdf"
                onClick={exportToPDF}
              >
                <i className="fas fa-file-pdf mr-2"></i>
                <span>{t('Export to PDF')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div></>
  );
}