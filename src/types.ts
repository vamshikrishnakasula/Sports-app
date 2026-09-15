export type MoodType = 'great' | 'good' | 'okay' | 'anxious' | 'low' | 'overwhelmed';

export interface MoodOption {
  type: MoodType;
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
  score: number;
}

export interface MoodLog {
  id: string;
  mood: MoodType;
  score: number;
  emotionTags: string[];
  note?: string;
  timestamp: string; // ISO string
}

export type PracticeType = 'gratitude' | 'affirmation' | 'journal';

export interface PracticeEntry {
  id: string;
  type: PracticeType;
  title: string;
  content: string;
  promptUsed?: string;
  moodAssociated?: MoodType;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestions?: string[];
  isCrisisAlert?: boolean;
}

export interface OverthinkingAnalysis {
  coreProblem: string;
  distortionIdentified: string;
  whatIsFact: string[];
  whatIsAssumption: string[];
  inMyControl: string[];
  outsideMyControl: string[];
  calmingActionSteps: string[];
  reframedPerspective: string;
}

export type MoodChangerCategory = 'movie' | 'book' | 'activity';

export interface MoodChangerItem {
  id: string;
  category: MoodChangerCategory;
  title: string;
  creatorOrYear?: string;
  description: string;
  whyItHelps: string;
  moodTarget: string; // e.g., 'Anxiety & Racing Mind', 'Low Energy & Sadness', 'Overwhelmed & Burnt Out'
  durationOrLength?: string;
  tags: string[];
}

export interface CrisisResource {
  name: string;
  phone: string;
  sms?: string;
  website?: string;
  availableHours: string;
  description: string;
  region: string;
}

export interface AppServerStatus {
  mongodbConnected: boolean;
  databaseName?: string;
  aiReady: boolean;
  totalMoodLogs: number;
  totalPractices: number;
}
