import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import { useUserStore } from './useUserStore';

interface ModuleProgress {
  moduleId: string;
  completed: boolean;
  score?: number;
}

interface LearningState {
  progress: Record<string, ModuleProgress>;
  markCompleted: (moduleId: string, score: number, backendCourseId?: number) => Promise<void>;
  isUnlocked: (moduleId: string, requiredModuleId?: string) => boolean;
}

export const useLearningStore = create<LearningState>()(
  persist(
    (set, get) => ({
      progress: {},

      markCompleted: async (moduleId, score, backendCourseId) => {
        // Update local state immediately for snappy UI
        set((state) => ({
          progress: {
            ...state.progress,
            [moduleId]: { moduleId, completed: true, score },
          },
        }));

        // Sync XP to backend if courseId is provided
        if (backendCourseId) {
          try {
            const response = await api.post('/course/complete', { courseId: backendCourseId });
            if (response.data?.success) {
              console.log('XP added to backend successfully');
              // Optionally update local XP (the backend tracks this on the user record)
              // We don't know the exact XP value here so we trigger a sync
              await useUserStore.getState().syncFromBackend();
            }
          } catch (error) {
            console.error('Failed to sync course completion to backend:', error);
          }
        }
      },

      isUnlocked: (_moduleId, requiredModuleId) => {
        if (!requiredModuleId) return true; // No prerequisite
        const prereq = get().progress[requiredModuleId];
        return prereq?.completed === true;
      },
    }),
    {
      name: 'stockmate-learning-storage',
    }
  )
);
