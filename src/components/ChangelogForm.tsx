import { useState } from 'react';
import { ChangelogEntry, ChangeType, Category, categoryLabels, changeTypeEmoji } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

interface ChangelogFormProps {
  entry?: ChangelogEntry;
  onSubmit: (entry: Omit<ChangelogEntry, 'id' | 'reactions'>) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function ChangelogForm({ entry, onSubmit, onCancel, isLoading }: ChangelogFormProps) {
  const [title, setTitle] = useState(entry?.title || '');
  const [description, setDescription] = useState(entry?.description || '');
  const [version, setVersion] = useState(entry?.version || '');
  const [date, setDate] = useState(entry?.date || new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<ChangeType>(entry?.type || 'new');
  const [category, setCategory] = useState<Category>(entry?.category || 'feature');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || !version.trim() || !date) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      await onSubmit({
        title,
        description,
        version,
        date,
        type,
        category,
      });
      
      // Reset form if it's a new entry
      if (!entry) {
        setTitle('');
        setDescription('');
        setVersion('');
        setDate(new Date().toISOString().split('T')[0]);
        setType('new');
        setCategory('feature');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{entry ? 'Edit Changelog Entry' : 'Create New Changelog Entry'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="version">Version</Label>
              <Input
                id="version"
                placeholder="e.g., v1.2.0"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={(value) => setType(value as ChangeType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">{changeTypeEmoji.new} New</SelectItem>
                  <SelectItem value="fix">{changeTypeEmoji.fix} Fix</SelectItem>
                  <SelectItem value="improvement">{changeTypeEmoji.improvement} Improvement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter a concise title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the changes in detail"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                {entry ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              entry ? 'Update Entry' : 'Create Entry'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}