// Using bible-api.com - free, no authentication required
const BASE_URL = 'https://bible-api.com';

export interface BibleChapter {
  reference: string;
  verses: Array<{
    book_id: string;
    book_name: string;
    chapter: number;
    verse: number;
    text: string;
  }>;
  text: string;
  translation_id: string;
  translation_name: string;
  translation_note: string;
}

// Normalize book names to match API format
const normalizeBookName = (book: string): string => {
  const bookMap: Record<string, string> = {
    '1 Samuel': '1samuel',
    '2 Samuel': '2samuel',
    '1 Kings': '1kings',
    '2 Kings': '2kings',
    '1 Chronicles': '1chronicles',
    '2 Chronicles': '2chronicles',
    'Song of Songs': 'songofsolomon',
    '1 Corinthians': '1corinthians',
    '2 Corinthians': '2corinthians',
    '1 Thessalonians': '1thessalonians',
    '2 Thessalonians': '2thessalonians',
    '1 Timothy': '1timothy',
    '2 Timothy': '2timothy',
    '1 Peter': '1peter',
    '2 Peter': '2peter',
    '1 John': '1john',
    '2 John': '2john',
    '3 John': '3john',
  };
  
  return bookMap[book] || book.toLowerCase().replace(/\s+/g, '');
};

export const fetchChapter = async (book: string, chapter: number, translation: string = 'kjv'): Promise<BibleChapter> => {
  const normalizedBook = normalizeBookName(book);
  const url = `${BASE_URL}/${normalizedBook}+${chapter}?translation=${translation}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${book} ${chapter}`);
  }
  
  return response.json();
};

export const fetchVerse = async (book: string, chapter: number, verse: number, translation: string = 'kjv'): Promise<BibleChapter> => {
  const normalizedBook = normalizeBookName(book);
  const url = `${BASE_URL}/${normalizedBook}+${chapter}:${verse}?translation=${translation}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${book} ${chapter}:${verse}`);
  }
  
  return response.json();
};

// Book chapter counts (from the Bible structure)
export const bookChapterCounts: Record<string, number> = {
  'Genesis': 50, 'Exodus': 40, 'Leviticus': 27, 'Numbers': 36, 'Deuteronomy': 34,
  'Joshua': 24, 'Judges': 21, 'Ruth': 4, '1 Samuel': 31, '2 Samuel': 24,
  '1 Kings': 22, '2 Kings': 25, '1 Chronicles': 29, '2 Chronicles': 36,
  'Ezra': 10, 'Nehemiah': 13, 'Esther': 10, 'Job': 42, 'Psalms': 150,
  'Proverbs': 31, 'Ecclesiastes': 12, 'Song of Songs': 8, 'Isaiah': 66,
  'Jeremiah': 52, 'Lamentations': 5, 'Ezekiel': 48, 'Daniel': 12,
  'Hosea': 14, 'Joel': 3, 'Amos': 9, 'Obadiah': 1, 'Jonah': 4,
  'Micah': 7, 'Nahum': 3, 'Habakkuk': 3, 'Zephaniah': 3, 'Haggai': 2,
  'Zechariah': 14, 'Malachi': 4, 'Matthew': 28, 'Mark': 16, 'Luke': 24,
  'John': 21, 'Acts': 28, 'Romans': 16, '1 Corinthians': 16, '2 Corinthians': 13,
  'Galatians': 6, 'Ephesians': 6, 'Philippians': 4, 'Colossians': 4,
  '1 Thessalonians': 5, '2 Thessalonians': 3, '1 Timothy': 6, '2 Timothy': 4,
  'Titus': 3, 'Philemon': 1, 'Hebrews': 13, 'James': 5, '1 Peter': 5,
  '2 Peter': 3, '1 John': 5, '2 John': 1, '3 John': 1, 'Jude': 1, 'Revelation': 22
};
