export enum Screen {
  Splash = 'splash',
  Onboarding_Handle = 'onboarding_handle',
  Onboarding_Welcome = 'onboarding_welcome',
  Feed = 'feed',
  Discover = 'discover',
  Portfolio = 'portfolio',
  Profile = 'profile',
  BuyToken = 'buy_token',
  SellToken = 'sell_token',
  Withdraw = 'withdraw',
  Notifications = 'notifications',
  Settings = 'settings',
  Leaderboard = 'leaderboard',
  Signup = 'signup',
}

export interface Creator {
  id: string;
  name: string;
  handle: string;
  followers: string;
  price: string;
  change: string;
  avatar: string;
  bio?: string;
  joinedAt?: string;
  isVerified?: boolean;
}

export interface Post {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  content: string;
  likes: string;
  comments: string;
  timestamp: string;
  image?: string;
}

export interface Holding {
  id: string;
  name: string;
  symbol: string;
  value: string;
  amount: string;
  change?: string;
  icon: string;
  color: string;
}

export interface Notification {
  id: string;
  type: 'follower' | 'investment' | 'alert' | 'engagement' | 'update';
  title: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  color: string;
  icon: string;
}
