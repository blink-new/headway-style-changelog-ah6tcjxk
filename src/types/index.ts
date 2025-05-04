export type ChangeType = 'new' | 'fix' | 'improvement';

export type Category = 'ui' | 'performance' | 'security' | 'feature' | 'api' | 'other';

export interface Reaction {
  type: '👍' | '❤️' | '🎉' | '👀';
  count: number;
  userReacted?: boolean;
}

export interface ChangelogEntry {
  id: string;
  version: string;
  date: string;
  title: string;
  description: string;
  type: ChangeType;
  category: Category;
  reactions: Reaction[];
}

export const changeTypeEmoji: Record<ChangeType, string> = {
  new: '✨',
  fix: '🐛',
  improvement: '🛠️',
};

export const categoryLabels: Record<Category, string> = {
  ui: 'UI',
  performance: 'Performance',
  security: 'Security',
  feature: 'Feature',
  api: 'API',
  other: 'Other',
};

export const reactionEmojis = ['👍', '❤️', '🎉', '👀'] as const;