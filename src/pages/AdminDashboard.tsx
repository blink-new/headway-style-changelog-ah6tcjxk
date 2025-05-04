import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getChangelogEntries, createChangelogEntry, updateChangelogEntry, deleteChangelogEntry } from '../services/changelogService';
import { ChangelogEntry } from '../types';
import ChangelogForm from '../components/ChangelogForm';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { Pencil, Trash2 } from 'lucide-react';

export default function AdminDashboard() {
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<ChangelogEntry | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('entries');
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/login');
      return;
    }

    const fetchEntries = async () => {
      try {
        const data = await getChangelogEntries();
        setEntries(data);
      } catch (err) {
        toast.error('Failed to load changelog entries');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntries();
  }, [isAuthenticated, isAdmin, navigate]);

  const handleCreateEntry = async (entry: Omit<ChangelogEntry, 'id' | 'reactions'>) => {
    setIsSubmitting(true);
    try {
      const newEntry = await createChangelogEntry(entry);
      setEntries([newEntry, ...entries]);
      toast.success('Changelog entry created successfully');
      setActiveTab('entries');
    } catch (error) {
      toast.error('Failed to create changelog entry');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateEntry = async (entry: Omit<ChangelogEntry, 'id' | 'reactions'>) => {
    if (!selectedEntry) return;
    
    setIsSubmitting(true);
    try {
      const updatedEntry = await updateChangelogEntry(selectedEntry.id, entry);
      if (updatedEntry) {
        setEntries(entries.map(e => e.id === updatedEntry.id ? updatedEntry : e));
        toast.success('Changelog entry updated successfully');
        setSelectedEntry(undefined);
        setActiveTab('entries');
      }
    } catch (error) {
      toast.error('Failed to update changelog entry');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      const success = await deleteChangelogEntry(id);
      if (success) {
        setEntries(entries.filter(entry => entry.id !== id));
        toast.success('Changelog entry deleted successfully');
      } else {
        toast.error('Failed to delete changelog entry');
      }
    } catch (error) {
      toast.error('Failed to delete changelog entry');
      console.error(error);
    }
  };

  const handleEditClick = (entry: ChangelogEntry) => {
    setSelectedEntry(entry);
    setActiveTab('edit');
  };

  const handleCancelEdit = () => {
    setSelectedEntry(undefined);
    setActiveTab('entries');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="entries">Manage Entries</TabsTrigger>
          <TabsTrigger value="create">Create New Entry</TabsTrigger>
          {selectedEntry && <TabsTrigger value="edit">Edit Entry</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="entries">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Changelog Entries</h2>
              <Button onClick={() => setActiveTab('create')}>Create New Entry</Button>
            </div>
            
            {entries.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-gray-500">No changelog entries yet. Create your first one!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {entries.map((entry) => (
                  <Card key={entry.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{entry.title}</CardTitle>
                          <div className="text-sm text-gray-500 mt-1">
                            <span className="font-mono">{entry.version}</span>
                            <span className="mx-2">•</span>
                            <span>{format(new Date(entry.date), 'MMM d, yyyy')}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(entry)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the changelog entry.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-500 hover:bg-red-600"
                                  onClick={() => handleDeleteEntry(entry.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 dark:text-gray-300 line-clamp-2">{entry.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="create">
          <ChangelogForm
            onSubmit={handleCreateEntry}
            onCancel={() => setActiveTab('entries')}
            isLoading={isSubmitting}
          />
        </TabsContent>
        
        <TabsContent value="edit">
          {selectedEntry && (
            <ChangelogForm
              entry={selectedEntry}
              onSubmit={handleUpdateEntry}
              onCancel={handleCancelEdit}
              isLoading={isSubmitting}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}