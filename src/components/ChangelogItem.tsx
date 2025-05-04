import { useState } from 'react';
import { format } from 'date-fns';
import { ChangelogEntry, changeTypeEmoji, categoryLabels } from '../types';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { addReaction } from '../services/changelogService';
import { toast } from 'sonner';

interface ChangelogItemProps {
  entry: ChangelogEntry;
  onReactionUpdate: (updatedEntry: ChangelogEntry) => void;
}

export default function ChangelogItem({ entry, onReactionUpdate }: ChangelogItemProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleReaction = async (reactionType: '👍' | '❤️' | '🎉' | '👀') => {
    setIsLoading(true);
    try {
      const updatedEntry = await addReaction(entry.id, reactionType);
      if (updatedEntry) {
        onReactionUpdate(updatedEntry);
      }
    } catch (error) {
      toast.error('Failed to add reaction');
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeColor = (type: ChangelogEntry['type']) => {
    switch (type) {
      case 'new':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300';
      case 'fix':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'improvement':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getCategoryColor = (category: ChangelogEntry['category']) => {
    switch (category) {
      case 'ui':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'performance':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'security':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'feature':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'api':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <Card className="mb-6 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-semibold text-gray-600 dark:text-gray-400">
              {entry.version}
            </span>
            <span className="text-gray-400 dark:text-gray-500">•</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {format(new Date(entry.date), 'MMM d, yyyy')}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={getTypeColor(entry.type)}>
              {changeTypeEmoji[entry.type]} {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
            </Badge>
            <Badge variant="outline" className={getCategoryColor(entry.category)}>
              {categoryLabels[entry.category]}
            </Badge>
          </div>
        </div>
        <h3 className="text-xl font-semibold mt-2">{entry.title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{entry.description}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex flex-wrap gap-2">
          {entry.reactions.map((reaction) => (
            <Button
              key={reaction.type}
              variant={reaction.userReacted ? "default" : "outline"}
              size="sm"
              className={`text-sm ${reaction.userReacted ? 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-800' : ''}`}
              onClick={() => handleReaction(reaction.type)}
              disabled={isLoading || reaction.userReacted}
            >
              <span className="mr-1">{reaction.type}</span>
              <span>{reaction.count}</span>
            </Button>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}