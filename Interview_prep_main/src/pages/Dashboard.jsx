import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import './Dashboard.css';

export default function Dashboard() {
  const getToken = () => {
    return document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
  };

  const { t } = useLanguage();
  const { isDarkMode } = useTheme();
  const token = getToken();

  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:8000/ans/detail', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await res.json();
        setUserInfo(data);
        console.log(data);
        console.log(data.averageScore)
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div id="dashboard-page" className={`page ${isDarkMode ? 'dark' : ''}`}>
      <div className="dashboard-card">
        <h1 className="dashboard-title">{t('Your Progress Dashboard')}</h1>

        {/* ✅ User Info */}
        {userInfo && (
          <>
            <div className="user-info mb-6">
              <p><strong>{t('User ID')}:</strong> {userInfo.user.firstName}</p>
              <p><strong>{t('Answered Questions')}:</strong> {userInfo.totalAnswered}</p>
              <p><strong>{t('Total Score')}:</strong> {userInfo.totalScore}</p>
              <p><strong>{t('Average Score')}:</strong> {userInfo.averageScore} / 10</p>
            </div>

            {/* ✅ Category Wise Score */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">{t('Category Scores')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userInfo.categories &&
                  Object.entries(userInfo.categories).map(([category, details]) => (
                    <div key={category} className="progress-card">
                      <h3>{category}</h3>
                      <p><strong>{t('Answered')}:</strong> {details.attempted}</p>
                      <p><strong>{t('Score')}:</strong> {details.score}</p>
                      <p><strong>{t('Average')}:</strong> {details.attempted > 0 ? (details.score / details.attempted) : 0} / 10</p>
                    </div>
                  ))
                }
              </div>
            </div>
          </>
        )}

        {!userInfo && (
          <div className="loading mt-8">{t('Loading user progress...')}</div>
        )}
      </div>
    </div>
  );
}
