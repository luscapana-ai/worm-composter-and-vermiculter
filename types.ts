export enum AppView {
  HOME = 'HOME',
  COMPOSTING = 'COMPOSTING',
  VERMICULTURE = 'VERMICULTURE',
  DIAGNOSTICS = 'DIAGNOSTICS',
  MARKETPLACE = 'MARKETPLACE',
  PROFILE = 'PROFILE',
  CALCULATOR = 'CALCULATOR',
  COMMUNITY = 'COMMUNITY',
  TRACKER = 'TRACKER',
  NEWS = 'NEWS'
}

export interface SearchResultSource {
  title: string;
  uri: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  sources?: SearchResultSource[];
  isThinking?: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'worms' | 'bins' | 'tools' | 'starters';
  description: string;
  imageUrl: string;
  verificationVideoUrl?: string;
  rating: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface PortfolioItem {
  id: string;
  imageUrl: string;
  caption: string;
  date: string;
  likes: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Emoji character
  earnedDate?: string; // If undefined, it's locked
  color: string; // Tailwind color class for background
}

export interface UserProfile {
  name: string;
  email: string;
  address: string;
  portfolio: PortfolioItem[];
  badges: Badge[];
  xp: number;
  level: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'delivered' | 'processing' | 'shipped';
}

export enum DiagnosticMode {
  PHOTO = 'PHOTO',
  VIDEO = 'VIDEO',
  THINKING = 'THINKING'
}

// Social Community Types
export interface Comment {
  id: string;
  author: string;
  text: string;
  isAi?: boolean;
  timestamp: string;
}

export interface Post {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: Comment[];
  timestamp: string;
  tags: string[];
}

// Bin Tracker Types
export interface BinLog {
  id: string;
  date: string;
  temperature?: number;
  moisture: 'dry' | 'ideal' | 'wet';
  smell: 'earthy' | 'sour' | 'ammonia' | 'none';
  notes: string;
}

export interface CompostBin {
  id: string;
  name: string;
  type: 'hot' | 'cold' | 'vermicompost';
  startDate: string;
  logs: BinLog[];
}