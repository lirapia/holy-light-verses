import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, BookOpen, Download, Upload, FolderPlus, Folder, Sparkles } from 'lucide-react';
import { useBookmarks, type Bookmark } from '@/hooks/useBookmarks';
import { bibleBooks, bibleData, type BibleVersion } from '@/data/bibleData';

interface BookmarkManagerProps {
  selectedVersion: BibleVersion;
}

const BookmarkManager = ({ selectedVersion }: BookmarkManagerProps) => {
  const { bookmarks, collections, addBookmark, removeBookmark, exportBookmarks, importBookmarks, addCollection, removeCollection } = useBookmarks();
  const [title, setTitle] = useState('');
  const [book, setBook] = useState('');
  const [chapter, setChapter] = useState('');
  const [verse, setVerse] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [filterCollection, setFilterCollection] = useState<string>('all');
  const [newCollectionName, setNewCollectionName] = useState('');
  const [exportTitle, setExportTitle] = useState('');
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [collectionDialogOpen, setCollectionDialogOpen] = useState(false);
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
      verses: [verse],
      collection: selectedCollection || undefined
    });

    // Reset form
    setTitle('');
    setBook('');
    setChapter('');
    setVerse('');
  };

  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) return;
    addCollection(newCollectionName);
    setNewCollectionName('');
    setCollectionDialogOpen(false);
  };

  const handleExport = async () => {
    await exportBookmarks(exportTitle || undefined);
    setExportTitle('');
    setExportDialogOpen(false);
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

  const filteredBookmarks = filterCollection === 'all' 
    ? bookmarks 
    : bookmarks.filter(b => b.collection === filterCollection);

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
              <Label htmlFor="collection">Collection (Optional)</Label>
              <Select value={selectedCollection} onValueChange={setSelectedCollection}>
                <SelectTrigger className="bg-background/50 border-divine-glow/30">
                  <SelectValue placeholder="No collection" />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-sm border-divine-glow/30">
                  <SelectItem value="">No collection</SelectItem>
                  {collections.map(collection => (
                    <SelectItem key={collection.id} value={collection.id}>
                      {collection.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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

      {/* Collections & Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="bg-card/40 backdrop-blur-sm border-divine-glow/20">
          <CardContent className="p-4">
            <Label className="text-sm font-semibold mb-2 block">Filter by Collection</Label>
            <Select value={filterCollection} onValueChange={setFilterCollection}>
              <SelectTrigger className="bg-background/50 border-divine-glow/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card/95 backdrop-blur-sm border-divine-glow/30">
                <SelectItem value="all">All Bookmarks</SelectItem>
                {collections.map(collection => (
                  <SelectItem key={collection.id} value={collection.id}>
                    {collection.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-2">
          <Dialog open={collectionDialogOpen} onOpenChange={setCollectionDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-divine-glow/30 hover:bg-divine-glow/10">
                <FolderPlus className="w-4 h-4 mr-2" />
                New Collection
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card/95 backdrop-blur-sm border-divine-glow/30">
              <DialogHeader>
                <DialogTitle className="text-divine-glow">Create Collection</DialogTitle>
                <DialogDescription>
                  Organize your bookmarks into collections
                </DialogDescription>
              </DialogHeader>
              <Input
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="Collection name"
                className="bg-background/50 border-divine-glow/30"
              />
              <DialogFooter>
                <Button onClick={handleCreateCollection} className="bg-gradient-divine">
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="grid grid-cols-2 gap-2">
            <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-divine-glow/30 hover:bg-divine-glow/10"
                  disabled={bookmarks.length === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card/95 backdrop-blur-sm border-divine-glow/30">
                <DialogHeader>
                  <DialogTitle className="text-divine-glow">Export Bookmarks</DialogTitle>
                  <DialogDescription>
                    Give your export a title (optional)
                  </DialogDescription>
                </DialogHeader>
                <Input
                  value={exportTitle}
                  onChange={(e) => setExportTitle(e.target.value)}
                  placeholder="e.g., My Favorite Verses"
                  className="bg-background/50 border-divine-glow/30"
                />
                <DialogFooter>
                  <Button onClick={handleExport} className="bg-gradient-divine">
                    Export
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              onClick={handleImportClick}
              variant="outline"
              className="border-divine-glow/30 hover:bg-divine-glow/10"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Bookmarks List */}
      <div className="space-y-4">
        {filteredBookmarks.length === 0 ? (
          <Card className="bg-card/40 backdrop-blur-sm border-divine-glow/20">
            <CardContent className="text-center py-12">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">No bookmarks yet</p>
              <p className="text-muted-foreground">Add your first bookmark above</p>
            </CardContent>
          </Card>
        ) : (
          filteredBookmarks.map((bookmark) => {
            const collectionName = bookmark.collection 
              ? collections.find(c => c.id === bookmark.collection)?.name 
              : null;
            
            return (
              <Card 
                key={bookmark.id} 
                className="group relative bg-card/70 backdrop-blur-md border-divine-glow/30 hover:border-divine-glow/60 hover:shadow-holy transition-all duration-500 overflow-hidden"
              >
                {/* Divine glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-divine opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
                
                <CardContent className="p-6 relative">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-divine-glow animate-pulse" />
                        <h3 className="font-bold text-xl bg-gradient-divine bg-clip-text text-transparent">
                          {bookmark.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm text-muted-foreground font-medium">
                          {bookmark.book} {bookmark.chapter}:{bookmark.verses.join(', ')} ({bookmark.version})
                        </p>
                        {collectionName && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-divine-glow/10 border border-divine-glow/30 text-xs text-divine-glow">
                            <Folder className="w-3 h-3" />
                            {collectionName}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => removeBookmark(bookmark.id)}
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <Separator className="my-4 bg-gradient-to-r from-transparent via-divine-glow/30 to-transparent" />
                  
                  <blockquote className="text-foreground/90 leading-relaxed text-lg font-serif italic px-4 py-2 border-l-4 border-divine-glow/50 bg-divine-glow/5 rounded-r-lg">
                    "{getVerseText(bookmark)}"
                  </blockquote>
                  
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-xs text-muted-foreground">
                      Added {new Date(bookmark.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <div 
                          key={i} 
                          className="w-1 h-1 rounded-full bg-divine-glow/40 animate-pulse"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BookmarkManager;