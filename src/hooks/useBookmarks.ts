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
  collection?: string;
}

export interface Collection {
  id: string;
  name: string;
  createdAt: string;
}

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadBookmarks();
    loadCollections();
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

  const loadCollections = () => {
    try {
      const saved = localStorage.getItem('bible-collections');
      if (saved) {
        setCollections(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading collections:', error);
    }
  };

  const saveCollections = (newCollections: Collection[]) => {
    try {
      localStorage.setItem('bible-collections', JSON.stringify(newCollections));
      setCollections(newCollections);
    } catch (error) {
      console.error('Error saving collections:', error);
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

  const addCollection = (name: string) => {
    const newCollection: Collection = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date().toISOString()
    };
    const updated = [...collections, newCollection];
    saveCollections(updated);
    toast({
      title: "Collection Created",
      description: `"${name}" collection has been created`,
    });
    return newCollection.id;
  };

  const removeCollection = (id: string) => {
    const updated = collections.filter(c => c.id !== id);
    saveCollections(updated);
    // Remove collection from bookmarks
    const updatedBookmarks = bookmarks.map(b => 
      b.collection === id ? { ...b, collection: undefined } : b
    );
    saveBookmarks(updatedBookmarks);
    toast({
      title: "Collection Removed",
      description: "Collection has been deleted",
    });
  };

  const exportBookmarks = async (exportTitle?: string) => {
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

      const exportData = {
        title: exportTitle || 'My Bible Bookmarks',
        exportedAt: new Date().toISOString(),
        bookmarks: bookmarksWithContent,
        collections: collections
      };

      const data = JSON.stringify(exportData, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const filename = exportTitle 
        ? `${exportTitle.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`
        : `bible-bookmarks-${new Date().toISOString().split('T')[0]}.json`;
      link.download = filename;
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
        const importedData = JSON.parse(e.target?.result as string);
        
        // Support both old and new format
        let importedBookmarks: Bookmark[];
        let importedCollections: Collection[] = [];
        
        if (Array.isArray(importedData)) {
          // Old format: just array of bookmarks
          importedBookmarks = importedData;
        } else {
          // New format: object with bookmarks and collections
          importedBookmarks = importedData.bookmarks || [];
          importedCollections = importedData.collections || [];
        }
        
        // Validate imported data structure
        const validBookmarks = importedBookmarks.filter(b => 
          b.title && b.version && b.book && b.chapter && b.verses && Array.isArray(b.verses)
        );

        if (validBookmarks.length === 0) {
          throw new Error('No valid bookmarks found');
        }

        // Import collections first
        if (importedCollections.length > 0) {
          const existingCollectionNames = new Set(collections.map(c => c.name));
          const newCollections = importedCollections.filter(c => !existingCollectionNames.has(c.name));
          if (newCollections.length > 0) {
            const updatedCollections = [...collections, ...newCollections.map(c => ({
              ...c,
              id: crypto.randomUUID(),
              createdAt: c.createdAt || new Date().toISOString()
            }))];
            saveCollections(updatedCollections);
          }
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
          description: `Imported ${newBookmarks.length} bookmarks${importedCollections.length > 0 ? ` and ${importedCollections.length} collections` : ''}`,
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
    collections,
    addBookmark,
    removeBookmark,
    exportBookmarks,
    importBookmarks,
    addCollection,
    removeCollection
  };
};