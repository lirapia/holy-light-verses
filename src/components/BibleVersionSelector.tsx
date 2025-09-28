import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type BibleVersion } from '@/data/bibleData';

interface BibleVersionSelectorProps {
  selectedVersion: BibleVersion;
  onVersionChange: (version: BibleVersion) => void;
}

const BibleVersionSelector = ({ selectedVersion, onVersionChange }: BibleVersionSelectorProps) => {
  return (
    <div className="fixed top-6 right-6 z-50">
      <Select value={selectedVersion} onValueChange={onVersionChange}>
        <SelectTrigger className="w-32 bg-card/80 backdrop-blur-sm border-divine-glow/30 text-foreground">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-card/95 backdrop-blur-sm border-divine-glow/30">
          <SelectItem value="KJV" className="text-foreground hover:bg-divine-glow/20">
            KJV
          </SelectItem>
          <SelectItem value="NKJV" className="text-foreground hover:bg-divine-glow/20">
            NKJV
          </SelectItem>
          <SelectItem value="MEV" className="text-foreground hover:bg-divine-glow/20">
            MEV
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default BibleVersionSelector;