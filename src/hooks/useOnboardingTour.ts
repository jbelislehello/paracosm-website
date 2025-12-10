import { useState, useEffect, useCallback } from 'react';

const TOUR_STORAGE_KEY = 'calm-magic-tour-completed';

interface UseOnboardingTourOptions {
  projectId?: string | null;
  autoStart?: boolean;
}

export const useOnboardingTour = (options: UseOnboardingTourOptions = {}) => {
  const { projectId, autoStart = true } = options;
  const [isOpen, setIsOpen] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  // Check if tour has been completed
  useEffect(() => {
    const storageKey = projectId 
      ? `${TOUR_STORAGE_KEY}-${projectId}` 
      : TOUR_STORAGE_KEY;
    const completed = localStorage.getItem(storageKey) === 'true';
    setHasCompleted(completed);

    // Auto-start tour for first-time users
    if (autoStart && !completed) {
      // Delay to let the page render first
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [projectId, autoStart]);

  const startTour = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeTour = useCallback(() => {
    setIsOpen(false);
  }, []);

  const completeTour = useCallback(() => {
    const storageKey = projectId 
      ? `${TOUR_STORAGE_KEY}-${projectId}` 
      : TOUR_STORAGE_KEY;
    localStorage.setItem(storageKey, 'true');
    setHasCompleted(true);
    setIsOpen(false);
  }, [projectId]);

  const resetTour = useCallback(() => {
    const storageKey = projectId 
      ? `${TOUR_STORAGE_KEY}-${projectId}` 
      : TOUR_STORAGE_KEY;
    localStorage.removeItem(storageKey);
    setHasCompleted(false);
  }, [projectId]);

  return {
    isOpen,
    hasCompleted,
    startTour,
    closeTour,
    completeTour,
    resetTour,
  };
};
