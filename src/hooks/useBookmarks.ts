import { useState, useEffect } from 'react';
import { type BibleVersion } from '@/data/bibleData';
import { useToast } from '@/hooks/use-toast';
import { fetchVerse } from '@/services/bibleApi';

export interface Bookmark {
  id: string;
  title: string;
  version: BibleVersion;
  book: string;
  chapter: string;
  verses: string[];
  createdAt: string;
  text?: string;
}

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = () => {
    try {
      const saved = localStorage.getItem('bible-bookmarks');
      if (saved) {
        setBookmarks(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  };

  const saveBookmarks = (newBookmarks: Bookmark[]) => {
    try {
      localStorage.setItem('bible-bookmarks', JSON.stringify(newBookmarks));
      setBookmarks(newBookmarks);
    } catch (error) {
      console.error('Error saving bookmarks:', error);
      toast({
        title: "Error",
        description: "Failed to save bookmarks",
        variant: "destructive"
      });
    }
  };

  const addBookmark = (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => {
    const newBookmark: Bookmark = {
      ...bookmark,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };

    const updated = [...bookmarks, newBookmark];
    saveBookmarks(updated);

    toast({
      title: "✅ Bookmark Added",
      description: `"${bookmark.title}" has been saved`,
    });
  };

  const removeBookmark = (id: string) => {
    const updated = bookmarks.filter(b => b.id !== id);
    saveBookmarks(updated);

    toast({
      title: "Bookmark Removed",
      description: "Bookmark has been deleted",
    });
  };

  const exportBookmarks = async () => {
    try {
      toast({
        title: "Preparing Export",
        description: "Fetching verse content...",
      });

      // Fetch verse content for each bookmark
      const versionMap: Record<string, string> = {
        'KJV': 'kjv',
        'NKJV': 'kjv',
        'MEV': 'kjv'
      };

      const bookmarksWithContent = await Promise.all(
        bookmarks.map(async (bookmark) => {
          try {
            const apiVersion = versionMap[bookmark.version] || 'kjv';
            const verseData = await fetchVerse(
              bookmark.book,
              parseInt(bookmark.chapter),
              parseInt(bookmark.verses[0]),
              apiVersion
            );
            return {
              ...bookmark,
              text: verseData.text
            };
          } catch (error) {
            console.error(`Failed to fetch verse for ${bookmark.title}:`, error);
            return bookmark;
          }
        })
      );

      const data = JSON.stringify(bookmarksWithContent, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bible-bookmarks-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "📥 Export Successful",
        description: "Bookmarks with verse content have been exported",
      });
    } catch (error) {
      console.error('Error exporting bookmarks:', error);
      toast({
        title: "Error",
        description: "Failed to export bookmarks",
        variant: "destructive"
      });
    }
  };

  const importBookmarks = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string) as Bookmark[];
        
        // Validate imported data structure
        const validBookmarks = imported.filter(b => 
          b.title && b.version && b.book && b.chapter && b.verses && Array.isArray(b.verses)
        );

        if (validBookmarks.length === 0) {
          throw new Error('No valid bookmarks found');
        }

        // Merge with existing bookmarks (avoid duplicates by title)
        const existingTitles = new Set(bookmarks.map(b => b.title));
        const newBookmarks = validBookmarks.filter(b => !existingTitles.has(b.title));
        
        const updated = [...bookmarks, ...newBookmarks.map(b => ({
          ...b,
          id: crypto.randomUUID(),
          createdAt: b.createdAt || new Date().toISOString()
        }))];

        saveBookmarks(updated);

        toast({
          title: "✅ Bookmarks Successfully Imported!",
          description: `Imported ${newBookmarks.length} new bookmarks`,
        });
      } catch (error) {
        console.error('Error importing bookmarks:', error);
        toast({
          title: "Import Error",
          description: "Invalid file format or corrupted data",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    exportBookmarks,
    importBookmarks
  };
};