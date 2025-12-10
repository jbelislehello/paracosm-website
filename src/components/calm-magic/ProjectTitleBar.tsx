import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Check, X, FolderOpen } from 'lucide-react';
import { Project } from '@/hooks/useProjectContext';
import { getGardenByType } from '@/data/gardens';
import UserProfileMenu from '@/components/UserProfileMenu';

interface ProjectTitleBarProps {
  project: Project;
  onRename: (newName: string) => void;
}

const ProjectTitleBar: React.FC<ProjectTitleBarProps> = ({
  project,
  onRename,
}) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(project.projectName);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const garden = getGardenByType(project.garden);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    const trimmed = editValue.trim();
    if (trimmed.length >= 3) {
      onRename(trimmed);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(project.projectName);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div 
      className="shrink-0 px-6 py-2 border-b border-border/30" 
      style={{ backgroundColor: `${garden?.color}10` }}
    >
      <div className="max-w-[1800px] mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-2xl shrink-0">{garden?.icon}</span>
          
          {isEditing ? (
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <Input
                ref={inputRef}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSave}
                className="h-8 text-lg font-semibold"
                placeholder="Project name..."
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0"
                onClick={handleSave}
              >
                <Check className="w-4 h-4 text-primary" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0"
                onClick={handleCancel}
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsEditing(true)}>
              <h1 className="text-lg font-semibold text-foreground truncate">
                {project.projectName}
              </h1>
              <Pencil className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </div>
          )}
          
          <Badge 
            variant="outline" 
            className="text-xs shrink-0"
            style={{ borderColor: garden?.color, color: garden?.color }}
          >
            {garden?.name}
          </Badge>
          
          <Badge variant="outline" className="text-xs capitalize shrink-0">
            {project.mode}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <UserProfileMenu />
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => navigate('/projects')}
          >
            <FolderOpen className="w-4 h-4 mr-1.5" />
            All Projects
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectTitleBar;