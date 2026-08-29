export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  response_style: 'concise' | 'balanced' | 'detailed';
  use_emojis: boolean;
  theme: 'light' | 'dark';
  updated_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood: string | null;
  created_at: string;
  updated_at: string;
}

export interface MoodCheckIn {
  id: string;
  user_id: string;
  mood: MoodType;
  note: string | null;
  created_at: string;
}

export type ResponseStyle = 'concise' | 'balanced' | 'detailed';
export type Theme = 'light' | 'dark';
export type MoodType = 'great' | 'good' | 'okay' | 'low' | 'overwhelmed';

export const MOODS: { value: MoodType; label: string; emoji: string; color: string; bg: string }[] = [
  { value: 'great', label: 'Great', emoji: '😊', color: '#7C3AED', bg: '#EDE9FE' },
  { value: 'good', label: 'Good', emoji: '🙂', color: '#8B5CF6', bg: '#EDE9FE' },
  { value: 'okay', label: 'Okay', emoji: '😐', color: '#A78BFA', bg: '#F7F3FF' },
  { value: 'low', label: 'Low', emoji: '😔', color: '#6D28D9', bg: '#DDD6FE' },
  { value: 'overwhelmed', label: 'Overwhelmed', emoji: '😮‍💨', color: '#4C1D95', bg: '#C4B5FD' },
];
