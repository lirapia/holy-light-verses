export interface BibleVerse {
  book: string;
  chapter: string;
  verse: string;
  text: string;
}

export interface BibleData {
  [version: string]: {
    [book: string]: {
      [chapter: string]: {
        [verse: string]: string;
      };
    };
  };
}

export const bibleData: BibleData = {
  "KJV": {
    "John": {
      "6": {
        "29": "Jesus answered and said unto them, This is the work of God, that ye believe on him whom he hath sent."
      },
      "3": {
        "16": "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life."
      }
    },
    "Romans": {
      "5": {
        "8": "But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us."
      }
    },
    "1 John": {
      "4": {
        "8": "He that loveth not knoweth not God; for God is love.",
        "16": "And we have known and believed the love that God hath to us. God is love; and he that dwelleth in love dwelleth in God, and God in him."
      }
    },
    "Jeremiah": {
      "31": {
        "3": "The LORD hath appeared of old unto me, saying, Yea, I have loved thee with an everlasting love: therefore with lovingkindness have I drawn thee."
      }
    },
    "Lamentations": {
      "3": {
        "22": "It is of the LORD'S mercies that we are not consumed, because his compassions fail not.",
        "23": "They are new every morning: great is thy faithfulness."
      }
    },
    "Psalms": {
      "136": {
        "1": "O give thanks unto the LORD; for he is good: for his mercy endureth for ever."
      },
      "103": {
        "8": "The LORD is merciful and gracious, slow to anger, and plenteous in mercy."
      }
    },
    "Ephesians": {
      "2": {
        "4": "But God, who is rich in mercy, for his great love wherewith he loved us,"
      }
    }
  },
  "NKJV": {
    "John": {
      "6": {
        "29": "Jesus answered and said to them, \"This is the work of God, that you believe in Him whom He sent.\""
      },
      "3": {
        "16": "For God so loved the world that He gave His only begotten Son, that whoever believes in Him should not perish but have everlasting life."
      }
    },
    "Romans": {
      "5": {
        "8": "But God demonstrates His own love toward us, in that while we were still sinners, Christ died for us."
      }
    },
    "1 John": {
      "4": {
        "8": "He who does not love does not know God, for God is love.",
        "16": "And we have known and believed the love that God has for us. God is love, and he who abides in love abides in God, and God in him."
      }
    },
    "Jeremiah": {
      "31": {
        "3": "The LORD has appeared of old to me, saying: \"Yes, I have loved you with an everlasting love; Therefore with lovingkindness I have drawn you.\""
      }
    },
    "Lamentations": {
      "3": {
        "22": "Through the LORD's mercies we are not consumed, Because His compassions fail not.",
        "23": "They are new every morning; Great is Your faithfulness."
      }
    },
    "Psalms": {
      "136": {
        "1": "Oh, give thanks to the LORD, for He is good! For His mercy endures forever."
      },
      "103": {
        "8": "The LORD is merciful and gracious, Slow to anger, and abounding in mercy."
      }
    },
    "Ephesians": {
      "2": {
        "4": "But God, who is rich in mercy, because of His great love with which He loved us,"
      }
    }
  },
  "MEV": {
    "John": {
      "6": {
        "29": "Jesus answered, 'This is the work of God: that you believe in Him whom He has sent.'"
      },
      "3": {
        "16": "For God so loved the world that He gave His only begotten Son, that whoever believes in Him should not perish, but have eternal life."
      }
    },
    "Romans": {
      "5": {
        "8": "But God demonstrates His love toward us in that while we were yet sinners, Christ died for us."
      }
    },
    "1 John": {
      "4": {
        "8": "He who does not love does not know God, for God is love.",
        "16": "We have known and believed the love that God has for us. God is love, and he who remains in love remains in God, and God in him."
      }
    },
    "Jeremiah": {
      "31": {
        "3": "The LORD appeared to me from afar, saying: I have loved you with an everlasting love; therefore with loving devotion I have drawn you."
      }
    },
    "Lamentations": {
      "3": {
        "22": "It is because of the LORD's loving kindnesses that we are not consumed, because His compassions do not fail.",
        "23": "They are new every morning; great is Your faithfulness."
      }
    },
    "Psalms": {
      "136": {
        "1": "Give thanks to the LORD, for He is good, for His lovingkindness endures forever."
      },
      "103": {
        "8": "The LORD is compassionate and gracious, slow to anger and abounding in lovingkindness."
      }
    },
    "Ephesians": {
      "2": {
        "4": "But God, being rich in mercy, because of His great love with which He loved us,"
      }
    }
  }
};

// Verses focused on God's love, mercy, and kindness
export const rotatingVerses: BibleVerse[] = [
  { book: "John", chapter: "6", verse: "29", text: "" },
  { book: "John", chapter: "3", verse: "16", text: "" },
  { book: "Romans", chapter: "5", verse: "8", text: "" },
  { book: "1 John", chapter: "4", verse: "8", text: "" },
  { book: "1 John", chapter: "4", verse: "16", text: "" },
  { book: "Jeremiah", chapter: "31", verse: "3", text: "" },
  { book: "Lamentations", chapter: "3", verse: "22", text: "" },
  { book: "Lamentations", chapter: "3", verse: "23", text: "" },
  { book: "Psalms", chapter: "136", verse: "1", text: "" },
  { book: "Psalms", chapter: "103", verse: "8", text: "" },
  { book: "Ephesians", chapter: "2", verse: "4", text: "" }
];

export const bibleBooks = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth",
  "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles",
  "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", 
  "Song of Songs", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel",
  "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk",
  "Zephaniah", "Haggai", "Zechariah", "Malachi", "Matthew", "Mark", "Luke", 
  "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians", "Galatians",
  "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians",
  "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", "1 Peter",
  "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"
];

export type BibleVersion = "KJV" | "NKJV" | "MEV";