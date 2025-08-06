// src/pages/Welcome.jsx
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
// const navbarStyles = `

// `
import "./Welcome.css"
export default function Welcome() {
  const { t } = useLanguage();

  return (
    <>
    {/* <style dangerouslySetInnerHTML={{ __html: navbarStyles }} /> */}
    <div id="welcome-page" className="page active">
      <header className="welcome-header">
        <h1 className="welcome-title">
          {t('Welcome to')} <span className="text-blue-600 dark:text-blue-400">{t('Interview Prep')}</span>
        </h1>
        <p className="welcome-subtitle">{t('Your personal interview preparation assistant')}</p>
      </header>

      <div className="features-grid">
        <Link to="/aptitude" className="feature-card" style={{ animation: 'fadeInUp 1s ease forwards 0.1s' }}>
          <div className="feature-icon">
            <i className="fas fa-brain"></i>
          </div>
          <h3 className="feature-title">{t('Aptitude Questions')}</h3>
          <p className="feature-desc">{t('Practice numerical, logical, and verbal reasoning')}</p>
          <i className="fas fa-arrow-right feature-arrow"></i>
        </Link>

        <Link to="/technical" className="feature-card" style={{ animation: 'fadeInUp 1s ease forwards 0.2s' }}>
          <div className="feature-icon">
            <i className="fas fa-laptop-code"></i>
          </div>
          <h3 className="feature-title">{t('Technical Interview')}</h3>
          <p className="feature-desc">{t('Prepare for coding and system design interviews')}</p>
          <i className="fas fa-arrow-right feature-arrow"></i>
        </Link>

        <Link to="/group-discussion" className="feature-card" style={{ animation: 'fadeInUp 1s ease forwards 0.3s' }}>
          <div className="feature-icon">
            <i className="fas fa-users"></i>
          </div>
          <h3 className="feature-title">{t('Group Discussion')}</h3>
          <p className="feature-desc">{t('Practice with discussion topics and timer')}</p>
          <i className="fas fa-arrow-right feature-arrow"></i>
        </Link>

        <Link to="/hr-interview" className="feature-card" style={{ animation: 'fadeInUp 1s ease forwards 0.5s' }}>
          <div className="feature-icon">
            <i className="fas fa-user-tie"></i>
          </div>
          <h3 className="feature-title">{t('HR Interview')}</h3>
          <p className="feature-desc">{t('Prepare for common HR interview questions')}</p>
          <i className="fas fa-arrow-right feature-arrow"></i>
        </Link>

        <Link to="/coding" className="feature-card" style={{ animation: 'fadeInUp 1s ease forwards 0.6s' }}>
          <div className="feature-icon">
            <i className="fas fa-code"></i>
          </div>
          <h3 className="feature-title">{t('Coding Challenges')}</h3>
          <p className="feature-desc">{t('Solve coding problems with feedback')}</p>
          <i className="fas fa-arrow-right feature-arrow"></i>
        </Link>

        <Link to="/bookmarks" className="feature-card" style={{ animation: 'fadeInUp 1s ease forwards 0.4s' }}>
          <div className="feature-icon">
            <i className="fas fa-bookmark"></i>
          </div>
          <h3 className="feature-title">{t('Bookmarked Questions')}</h3>
          <p className="feature-desc">{t('Review your saved questions')}</p>
          <i className="fas fa-arrow-right feature-arrow"></i>
        </Link>
      </div>
    </div>
    </>
  );
}