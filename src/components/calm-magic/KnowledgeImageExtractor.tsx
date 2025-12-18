import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Upload, 
  Brain, 
  Loader2, 
  FileImage, 
  Network, 
  BookOpen,
  Lightbulb,
  Check,
  X
} from 'lucide-react';
import { useKnowledgeExtraction } from '@/hooks/useKnowledgeExtraction';
import { KnowledgeExtraction } from '@/types/knowledge';

interface KnowledgeImageExtractorProps {
  onExtracted?: (content: string, tags: string[], extraction: KnowledgeExtraction) => void;
  onCancel?: () => void;
}

export const KnowledgeImageExtractor: React.FC<KnowledgeImageExtractorProps> = ({
  onExtracted,
  onCancel
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { 
    extracting, 
    extraction, 
    knowledgeObjects,
    error,
    extractFromImage,
    getPolenContent,
    getTags,
    reset
  } = useKnowledgeExtraction();

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }
    
    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    reset();
  }, [reset]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleExtract = async () => {
    if (!imageFile) return;
    await extractFromImage(imageFile);
  };

  const handleConfirm = () => {
    if (extraction && onExtracted) {
      const content = getPolenContent() || '';
      const tags = getTags();
      onExtracted(content, tags, extraction);
    }
  };

  const getLayerColor = (layer: string) => {
    switch (layer) {
      case 'A': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'B': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'C': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ontology': return 'bg-emerald-500/20 text-emerald-300';
      case 'thesaurus': return 'bg-cyan-500/20 text-cyan-300';
      case 'taxonomy': return 'bg-amber-500/20 text-amber-300';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-violet-950/30 to-indigo-950/30 border-violet-500/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2 text-violet-300">
          <Brain className="h-5 w-5" />
          Knowledge Image Extractor
        </CardTitle>
        <p className="text-sm text-violet-200/60">
          Upload an image to extract knowledge objects for Prodago
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Zone */}
        {!extraction && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`
              border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
              ${isDragging 
                ? 'border-violet-400 bg-violet-500/10' 
                : 'border-violet-500/30 hover:border-violet-400/50 hover:bg-violet-500/5'
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
            />
            
            {imagePreview ? (
              <div className="space-y-4">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="max-h-48 mx-auto rounded-lg border border-violet-500/30"
                />
                <p className="text-sm text-violet-200/80">{imageFile?.name}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-10 w-10 mx-auto text-violet-400/60" />
                <p className="text-violet-200/80">
                  Drop an image here or click to upload
                </p>
                <p className="text-xs text-violet-200/40">
                  Supports diagrams, frameworks, mind maps, org charts
                </p>
              </div>
            )}
          </div>
        )}

        {/* Extract Button */}
        {imageFile && !extraction && (
          <Button
            onClick={handleExtract}
            disabled={extracting}
            className="w-full bg-violet-600 hover:bg-violet-700"
          >
            {extracting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Extracting Knowledge...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Extract Knowledge Objects
              </>
            )}
          </Button>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Extraction Results */}
        {extraction && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/30">
              <p className="text-sm text-violet-200">{extraction.summary}</p>
            </div>

            {/* Meta Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge className={getTypeColor(extraction.knowledgeType)}>
                <FileImage className="h-3 w-3 mr-1" />
                {extraction.knowledgeType.toUpperCase()}
              </Badge>
              {extraction.governanceLayer && (
                <Badge className={getLayerColor(extraction.governanceLayer)}>
                  Layer {extraction.governanceLayer}
                </Badge>
              )}
              <Badge variant="outline" className="border-violet-500/30 text-violet-300">
                <Network className="h-3 w-3 mr-1" />
                {extraction.entities.length} entities
              </Badge>
              <Badge variant="outline" className="border-violet-500/30 text-violet-300">
                {extraction.relations.length} relations
              </Badge>
            </div>

            {/* Entities Preview */}
            <ScrollArea className="h-32">
              <div className="space-y-1">
                {extraction.entities.map((entity, i) => (
                  <div 
                    key={i}
                    className="flex items-center gap-2 p-2 rounded bg-background/30 text-sm"
                  >
                    <span className="font-medium text-violet-200">{entity.name}</span>
                    <Badge variant="secondary" className="text-xs">{entity.type}</Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Playbook Seeds */}
            {extraction.playbookSeeds.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-violet-300 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Playbook Seeds
                </h4>
                {extraction.playbookSeeds.map((seed, i) => (
                  <div 
                    key={i}
                    className="p-2 rounded bg-amber-500/10 border border-amber-500/30 text-sm"
                  >
                    <p className="font-medium text-amber-200">{seed.title}</p>
                    <p className="text-amber-200/60 text-xs">{seed.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={handleConfirm}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                <Check className="h-4 w-4 mr-2" />
                Save as Polen
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  reset();
                  setImageFile(null);
                  setImagePreview(null);
                }}
                className="border-violet-500/30"
              >
                <X className="h-4 w-4 mr-2" />
                Reset
              </Button>
              {onCancel && (
                <Button
                  variant="ghost"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KnowledgeImageExtractor;
