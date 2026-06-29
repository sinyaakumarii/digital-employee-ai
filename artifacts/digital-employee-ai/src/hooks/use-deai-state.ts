import { useState, useEffect } from 'react';

export interface Settings {
  temperature: number;
  maxTokens: number;
  outputLength: 'Short' | 'Medium' | 'Long';
}

export interface HistoryEntry {
  id: string;
  contentTypeId: string;
  timestamp: number;
  result: string;
  fields: Record<string, string>;
  taskType: string;
}

export interface Stats {
  date: string;
  todayGenerations: number;
  wordsGenerated: number;
  lastGeneratedTime: number | null;
}

const DEFAULT_SETTINGS: Settings = {
  temperature: 0.7,
  maxTokens: 1024,
  outputLength: 'Medium',
};

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const DEFAULT_STATS: Stats = {
  date: getTodayDateString(),
  todayGenerations: 0,
  wordsGenerated: 0,
  lastGeneratedTime: null,
};

export function useDEAIState() {
  const [settings, setSettingsState] = useState<Settings>(() => {
    const saved = localStorage.getItem('deai-settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [history, setHistoryState] = useState<HistoryEntry[]>(() => {
    const saved = localStorage.getItem('deai-history');
    return saved ? JSON.parse(saved) : [];
  });

  const [stats, setStatsState] = useState<Stats>(() => {
    const saved = localStorage.getItem('deai-stats');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.date === getTodayDateString()) return parsed;
      return { ...DEFAULT_STATS, wordsGenerated: parsed.wordsGenerated }; // keep total words? let's keep all-time words or reset? Prompt says "Words Generated". Usually total or today. Let's keep it total.
    }
    return DEFAULT_STATS;
  });

  const [lastContentType, setLastContentType] = useState<string>(() => {
    return localStorage.getItem('deai-last-content-type') || 'linkedin_post';
  });

  const setSettings = (newSettings: Settings) => {
    setSettingsState(newSettings);
    localStorage.setItem('deai-settings', JSON.stringify(newSettings));
  };

  const addHistory = (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
    const newEntry: HistoryEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    const newHistory = [newEntry, ...history].slice(0, 50);
    setHistoryState(newHistory);
    localStorage.setItem('deai-history', JSON.stringify(newHistory));
  };

  const deleteHistory = (id: string) => {
    const newHistory = history.filter(h => h.id !== id);
    setHistoryState(newHistory);
    localStorage.setItem('deai-history', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistoryState([]);
    localStorage.removeItem('deai-history');
  };

  const updateStats = (words: number) => {
    const today = getTodayDateString();
    setStatsState(prev => {
      const isNewDay = prev.date !== today;
      const newStats = {
        date: today,
        todayGenerations: (isNewDay ? 0 : prev.todayGenerations) + 1,
        wordsGenerated: prev.wordsGenerated + words,
        lastGeneratedTime: Date.now(),
      };
      localStorage.setItem('deai-stats', JSON.stringify(newStats));
      return newStats;
    });
  };

  const updateLastContentType = (id: string) => {
    setLastContentType(id);
    localStorage.setItem('deai-last-content-type', id);
  };

  return {
    settings,
    setSettings,
    history,
    addHistory,
    deleteHistory,
    clearHistory,
    stats,
    updateStats,
    lastContentType,
    updateLastContentType
  };
}
