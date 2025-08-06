// src/hooks/useProgress.js
import { useState, useEffect } from 'react';

export function useProgress() {
  const [progress, setProgress] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('userProgress'));
    return saved || {
      aptitude: { completed: 0, totalScore: 0, sessions: 0 },
      technical: { completed: 0, totalScore: 0, sessions: 0 },
      hr: { completed: 0, totalScore: 0, sessions: 0 },
      coding: { completed: 0, totalScore: 0, sessions: 0 },
      gd: { completed: 0, totalScore: 0, sessions: 0 }
    };
  });

  const updateProgress = (category, score) => {
    setProgress(prev => {
      const newProgress = {
        ...prev,
        [category]: {
          completed: (prev[category]?.completed || 0) + 1,
          totalScore: (prev[category]?.totalScore || 0) + score,
          sessions: (prev[category]?.sessions || 0) + 1
        }
      };
      localStorage.setItem('userProgress', JSON.stringify(newProgress));
      return newProgress;
    });
  };

  return { progress, updateProgress };
}