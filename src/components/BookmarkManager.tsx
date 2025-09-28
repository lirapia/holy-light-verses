import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trash2, BookOpen, Download, Upload } from 'lucide-react';
import { useBookmarks, type Bookmark } from '@/hooks/useBookmarks';
import { bibleBooks, bibleData, type BibleVersion } from '@/data/bibleData';

interface BookmarkManagerProps {
  selectedVersion: BibleVersion;
}

const BookmarkManager = ({ selectedVersion }: BookmarkManagerProps) => {
  const { bookmarks, addBookmark, removeBookmark, exportBookmarks, importBookmarks } = useBookmarks();
  const [title, setTitle] = useState('');
  const [book, setBook] = useState('');
  const [chapter, setChapter] = useState('');
  const [verse, setVerse] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddBookmark = () => {
    if (!title || !book || !chapter || !verse) {
      return;
    }

    addBookmark({
      title,
      version: selectedVersion,
      book,
      chapter,
      verses: [verse]
    });

    // Reset form
    setTitle('');
    setBook('');
    setChapter('');
    setVerse('');
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importBookmarks(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getVerseText = (bookmark: Bookmark) => {
    const verseText = bibleData[bookmark.version]?.[bookmark.book]?.[bookmark.chapter]?.[bookmark.verses[0]];
    return verseText || 'Verse not found';
  };

  const availableChapters = book && bibleData[selectedVersion]?.[book] 
    ? Object.keys(bibleData[selectedVersion][book]) 
    : [];

  const availableVerses = book && chapter && bibleData[selectedVersion]?.[book]?.[chapter]
    ? Object.keys(bibleData[selectedVersion][book][chapter])
    : [];

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold holy-aura mb-4">My Bookmarks</h2>
        <p className="text-muted-foreground text-lg">Save and organize your favorite verses</p>
      </div>

      {/* Add Bookmark Form */}
      <Card className="mb-8 bg-card/60 backdrop-blur-sm border-divine-glow/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-divine-glow">
            <BookOpen className="w-5 h-5" />
            Add New Bookmark
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Bookmark Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., God's Love"
                className="bg-background/50 border-divine-glow/30"
              />
            </div>
            <div>
              <Label htmlFor="book">Book</Label>
              <Select value={book} onValueChange={setBook}>
                <SelectTrigger className="bg-background/50 border-divine-glow/30">
                  <SelectValue placeholder="Select book" />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-sm border-divine-glow/30 max-h-60">
                  {bibleBooks
                    .filter(bookName => bibleData[selectedVersion]?.[bookName])
                    .map(bookName => (
                    <SelectItem key={bookName} value={bookName}>
                      {bookName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="chapter">Chapter</Label>
              <Select value={chapter} onValueChange={setChapter} disabled={!book}>
                <SelectTrigger className="bg-background/50 border-divine-glow/30">
                  <SelectValue placeholder="Select chapter" />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-sm border-divine-glow/30">
                  {availableChapters.map(ch => (
                    <SelectItem key={ch} value={ch}>
                      Chapter {ch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="verse">Verse</Label>
              <Select value={verse} onValueChange={setVerse} disabled={!chapter}>
                <SelectTrigger className="bg-background/50 border-divine-glow/30">
                  <SelectValue placeholder="Select verse" />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-sm border-divine-glow/30">
                  {availableVerses.map(v => (
                    <SelectItem key={v} value={v}>
                      Verse {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleAddBookmark}
            disabled={!title || !book || !chapter || !verse}
            className="w-full bg-gradient-divine hover:shadow-holy transition-all"
          >
            Add Bookmark
          </Button>
        </CardContent>
      </Card>

      {/* Import/Export Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Button
          onClick={exportBookmarks}
          variant="outline"
          className="flex-1 border-divine-glow/30 hover:bg-divine-glow/10"
          disabled={bookmarks.length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          Export Bookmarks
        </Button>
        <Button
          onClick={handleImportClick}
          variant="outline"
          className="flex-1 border-divine-glow/30 hover:bg-divine-glow/10"
        >
          <Upload className="w-4 h-4 mr-2" />
          Import Bookmarks
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Bookmarks List */}
      <div className="space-y-4">
        {bookmarks.length === 0 ? (
          <Card className="bg-card/40 backdrop-blur-sm border-divine-glow/20">
            <CardContent className="text-center py-12">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">No bookmarks yet</p>
              <p className="text-muted-foreground">Add your first bookmark above</p>
            </CardContent>
          </Card>
        ) : (
          bookmarks.map((bookmark) => (
            <Card key={bookmark.id} className="bg-card/60 backdrop-blur-sm border-divine-glow/20 hover:shadow-holy transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-divine-glow mb-1">
                      {bookmark.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {bookmark.book} {bookmark.chapter}:{bookmark.verses.join(', ')} ({bookmark.version})
                    </p>
                  </div>
                  <Button
                    onClick={() => removeBookmark(bookmark.id)}
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Separator className="my-4 bg-divine-glow/20" />
                <blockquote className="text-foreground italic leading-relaxed">
                  "{getVerseText(bookmark)}"
                </blockquote>
                <p className="text-xs text-muted-foreground mt-4">
                  Added {new Date(bookmark.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default BookmarkManager;