import { useState, useEffect } from 'react';
import { getChangelogEntries } from '../services/changelogService';
import { ChangelogEntry } from '../types';
import ChangelogItem from '../components/ChangelogItem';
import { Separator } from '../components/ui/separator';

export default function Changelog() {
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const data = await getChangelogEntries();
        setEntries(data);
      } catch (err) {
        setError('Failed to load changelog entries');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntries();
  }, []);

  const handleReactionUpdate = (updatedEntry: ChangelogEntry) => {
    setEntries(entries.map(entry => 
      entry.id === updatedEntry.id ? updatedEntry : entry
    ));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-700 mb-2">No Updates Yet</h2>
        <p className="text-gray-600">Check back soon for product updates!</p>
      </div>
    );
  }

  // Group entries by month and year
  const groupedEntries: Record<string, ChangelogEntry[]> = {};
  
  entries.forEach(entry => {
    const date = new Date(entry.date);
    const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    if (!groupedEntries[monthYear]) {
      groupedEntries[monthYear] = [];
    }
    
    groupedEntries[monthYear].push(entry);
  });

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Product Changelog</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Stay up to date with all the latest changes and improvements.
        </p>
      </div>

      <div className="relative">
        {Object.entries(groupedEntries).map(([monthYear, monthEntries], index) => (
          <div key={monthYear} className="mb-10">
            <div className="sticky top-4 z-10 bg-gray-50 dark:bg-gray-900 py-2">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{monthYear}</h2>
              <Separator className="mt-2 mb-6" />
            </div>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700 ml-3"></div>
              
              {monthEntries.map((entry) => (
                <div key={entry.id} className="relative pl-10 mb-8">
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-6 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 border-2 border-indigo-500 dark:border-indigo-400 z-10"></div>
                  
                  <ChangelogItem entry={entry} onReactionUpdate={handleReactionUpdate} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}