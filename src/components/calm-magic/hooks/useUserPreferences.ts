
import { useState, useEffect } from 'react';

export interface UserPreferences {
  preferredViewMode: string;
  emotionalProfile: {
    dominantAxis: string;
    primaryGarden: string;
    lastAssessmentDate: string;
  };
  interfaceSettings: {
    compactMode: boolean;
    showGuides: boolean;
    animationsEnabled: boolean;
  };
  savedStates: any[];
}

const defaultPreferences: UserPreferences = {
  preferredViewMode: 'tools',
  emotionalProfile: {
    dominantAxis: 'calm',
    primaryGarden: 'intelligence',
    lastAssessmentDate: ''
  },
  interfaceSettings: {
    compactMode: false,
    showGuides: true,
    animationsEnabled: true
  },
  savedStates: []
};

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load preferences from localStorage
    const stored = localStorage.getItem('calmMagicPreferences');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setPreferences({ ...defaultPreferences, ...parsed });
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);
    localStorage.setItem('calmMagicPreferences', JSON.stringify(newPreferences));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    localStorage.removeItem('calmMagicPreferences');
  };

  return {
    preferences,
    updatePreferences,
    resetPreferences,
    isLoading
  };
};
