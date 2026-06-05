import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

interface ChatState {
  sessions: ChatSession[];
  activeSessionId: string | null;
  createSession: (greeting: string) => string;
  setActiveSession: (id: string) => void;
  addMessage: (sessionId: string, message: ChatMessage) => void;
  updateSessionTitle: (sessionId: string, title: string) => void;
  deleteSession: (sessionId: string) => void;
  getActiveSession: () => ChatSession | undefined;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeSessionId: null,

      createSession: (greeting: string) => {
        const newSession: ChatSession = {
          id: Date.now().toString(),
          title: 'New Chat',
          messages: [
            {
              id: '1',
              role: 'assistant',
              content: greeting,
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          sessions: [newSession, ...state.sessions],
          activeSessionId: newSession.id,
        }));
        return newSession.id;
      },

      setActiveSession: (id: string) => {
        set({ activeSessionId: id });
      },

      addMessage: (sessionId: string, message: ChatMessage) => {
        set((state) => {
          const sessions = state.sessions.map((s) => {
            if (s.id !== sessionId) return s;

            const updatedMessages = [...s.messages, message];

            // Auto-generate title from first user message
            let title = s.title;
            if (title === 'New Chat' && message.role === 'user') {
              title = message.content.length > 40
                ? message.content.substring(0, 40) + '...'
                : message.content;
            }

            return {
              ...s,
              messages: updatedMessages,
              title,
              updatedAt: new Date().toISOString(),
            };
          });
          return { sessions };
        });
      },

      updateSessionTitle: (sessionId: string, title: string) => {
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === sessionId ? { ...s, title } : s
          ),
        }));
      },

      deleteSession: (sessionId: string) => {
        set((state) => {
          const remaining = state.sessions.filter((s) => s.id !== sessionId);
          const newActiveId =
            state.activeSessionId === sessionId
              ? remaining.length > 0
                ? remaining[0].id
                : null
              : state.activeSessionId;
          return { sessions: remaining, activeSessionId: newActiveId };
        });
      },

      getActiveSession: () => {
        const { sessions, activeSessionId } = get();
        return sessions.find((s) => s.id === activeSessionId);
      },
    }),
    {
      name: 'stockmate-chat-storage',
    }
  )
);
