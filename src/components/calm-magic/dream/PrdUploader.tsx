import React, { useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PrdUploaderProps {
  question: string;
  onSubmit: (file: File) => void;
  onBack: () => void;
}

const ACCEPTED = ['.pdf', '.docx', '.md', '.markdown', '.txt'];
const MAX = 10 * 1024 * 1024;

const PrdUploader: React.FC<PrdUploaderProps> = ({ question, onSubmit, onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validate = (f: File): boolean => {
    const ext = '.' + f.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED.includes(ext)) {
      toast({ title: 'Unsupported file', description: `Use PDF, DOCX, MD, or TXT.`, variant: 'destructive' });
      return false;
    }
    if (f.size > MAX) {
      toast({ title: 'File too large', description: 'Maximum 10 MB.', variant: 'destructive' });
      return false;
    }
    return true;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || !files[0]) return;
    if (validate(files[0])) setFile(files[0]);
  };

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <p className="text-sm text-muted-foreground">Sitting with</p>
        <p className="text-base italic">"{question}"</p>
      </div>

      <Card
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`p-8 border-2 border-dashed transition-colors ${drag ? 'border-primary bg-primary/5' : 'border-muted-foreground/30'}`}
      >
        {!file ? (
          <div className="text-center space-y-3">
            <Upload className="w-10 h-10 mx-auto text-muted-foreground" />
            <div>
              <p className="font-medium">Drop your PRD here</p>
              <p className="text-xs text-muted-foreground">PDF, DOCX, MD, TXT — up to 10 MB</p>
            </div>
            <Button onClick={() => inputRef.current?.click()} variant="outline" size="sm">
              Browse files
            </Button>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept={ACCEPTED.join(',')}
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <FileText className="w-8 h-8 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setFile(null)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </Card>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>← Different question</Button>
        <Button disabled={!file} onClick={() => file && onSubmit(file)}>
          Begin the dream →
        </Button>
      </div>
    </div>
  );
};

export default PrdUploader;
