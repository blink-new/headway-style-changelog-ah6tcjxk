import { ChangelogEntry, Reaction } from '../types';

// Simple function to generate unique IDs
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Mock data
const mockData: ChangelogEntry[] = [
  {
    id: '1',
    version: 'v1.2.0',
    date: '2023-06-15',
    title: 'New Dashboard Layout',
    description: 'We\'ve completely redesigned the dashboard to make it more intuitive and user-friendly. The new layout provides better visibility of key metrics and improves navigation.',
    type: 'new',
    category: 'ui',
    reactions: [
      { type: '👍', count: 24 },
      { type: '❤️', count: 18 },
      { type: '🎉', count: 12 },
      { type: '👀', count: 5 },
    ],
  },
  {
    id: '2',
    version: 'v1.1.2',
    date: '2023-06-10',
    title: 'Fixed Login Issues',
    description: 'Resolved an issue where some users were experiencing login failures after the recent update. This fix ensures a smooth login experience for all users.',
    type: 'fix',
    category: 'security',
    reactions: [
      { type: '👍', count: 15 },
      { type: '❤️', count: 7 },
      { type: '🎉', count: 3 },
      { type: '👀', count: 2 },
    ],
  },
  {
    id: '3',
    version: 'v1.1.1',
    date: '2023-06-05',
    title: 'Performance Improvements',
    description: 'Optimized database queries and reduced page load times by 40%. The application should now feel much more responsive, especially on slower connections.',
    type: 'improvement',
    category: 'performance',
    reactions: [
      { type: '👍', count: 32 },
      { type: '❤️', count: 14 },
      { type: '🎉', count: 8 },
      { type: '👀', count: 3 },
    ],
  },
  {
    id: '4',
    version: 'v1.1.0',
    date: '2023-05-28',
    title: 'Added Export Functionality',
    description: 'You can now export your data in CSV and PDF formats. Look for the new export button in the top right corner of your reports.',
    type: 'new',
    category: 'feature',
    reactions: [
      { type: '👍', count: 45 },
      { type: '❤️', count: 22 },
      { type: '🎉', count: 18 },
      { type: '👀', count: 7 },
    ],
  },
  {
    id: '5',
    version: 'v1.0.2',
    date: '2023-05-20',
    title: 'API Rate Limiting Improvements',
    description: 'We\'ve improved our API rate limiting to better handle traffic spikes. This should result in more consistent performance during high-traffic periods.',
    type: 'improvement',
    category: 'api',
    reactions: [
      { type: '👍', count: 19 },
      { type: '❤️', count: 5 },
      { type: '🎉', count: 2 },
      { type: '👀', count: 8 },
    ],
  },
];

// In-memory storage
let changelogEntries = [...mockData];

// Get all changelog entries
export const getChangelogEntries = (): Promise<ChangelogEntry[]> => {
  return Promise.resolve([...changelogEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
};

// Get a single changelog entry by ID
export const getChangelogEntry = (id: string): Promise<ChangelogEntry | undefined> => {
  return Promise.resolve(changelogEntries.find(entry => entry.id === id));
};

// Create a new changelog entry
export const createChangelogEntry = (entry: Omit<ChangelogEntry, 'id' | 'reactions'>): Promise<ChangelogEntry> => {
  const newEntry: ChangelogEntry = {
    ...entry,
    id: generateId(),
    reactions: [
      { type: '👍', count: 0 },
      { type: '❤️', count: 0 },
      { type: '🎉', count: 0 },
      { type: '👀', count: 0 },
    ],
  };
  
  changelogEntries.push(newEntry);
  return Promise.resolve(newEntry);
};

// Update an existing changelog entry
export const updateChangelogEntry = (id: string, updates: Partial<Omit<ChangelogEntry, 'id' | 'reactions'>>): Promise<ChangelogEntry | undefined> => {
  const index = changelogEntries.findIndex(entry => entry.id === id);
  
  if (index === -1) {
    return Promise.resolve(undefined);
  }
  
  const updatedEntry = {
    ...changelogEntries[index],
    ...updates,
  };
  
  changelogEntries[index] = updatedEntry;
  return Promise.resolve(updatedEntry);
};

// Delete a changelog entry
export const deleteChangelogEntry = (id: string): Promise<boolean> => {
  const initialLength = changelogEntries.length;
  changelogEntries = changelogEntries.filter(entry => entry.id !== id);
  
  return Promise.resolve(changelogEntries.length < initialLength);
};

// Add a reaction to a changelog entry
export const addReaction = (entryId: string, reactionType: Reaction['type']): Promise<ChangelogEntry | undefined> => {
  const entry = changelogEntries.find(entry => entry.id === entryId);
  
  if (!entry) {
    return Promise.resolve(undefined);
  }
  
  const updatedReactions = entry.reactions.map(reaction => {
    if (reaction.type === reactionType) {
      return {
        ...reaction,
        count: reaction.count + 1,
        userReacted: true,
      };
    }
    return reaction;
  });
  
  const updatedEntry = {
    ...entry,
    reactions: updatedReactions,
  };
  
  changelogEntries = changelogEntries.map(e => e.id === entryId ? updatedEntry : e);
  
  return Promise.resolve(updatedEntry);
};