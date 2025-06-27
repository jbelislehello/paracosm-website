
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Settings, Save, RotateCcw, Sparkles } from 'lucide-react';
import { useUserPreferences } from '../hooks/useUserPreferences';

interface SettingsPanelProps {
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose }) => {
  const { preferences, updatePreferences, resetPreferences } = useUserPreferences();

  const handleInterfaceSettingChange = (key: string, value: boolean) => {
    updatePreferences({
      interfaceSettings: {
        ...preferences.interfaceSettings,
        [key]: value
      }
    });
  };

  const handleViewModeChange = (mode: string) => {
    updatePreferences({
      preferredViewMode: mode
    });
  };

  const handleSave = () => {
    onClose();
  };

  const handleReset = () => {
    resetPreferences();
  };

  return (
    <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm z-50 p-4 overflow-y-auto">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-600" />
            Paramètres Calm Magic
            <Badge variant="outline" className="ml-auto">
              <Sparkles className="w-3 h-3 mr-1" />
              Personnalisation
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Vue par défaut */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Mode de vue préféré</Label>
            <Select value={preferences.preferredViewMode} onValueChange={handleViewModeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tools">🛠️ Outils Interactifs</SelectItem>
                <SelectItem value="journey">🗺️ Voyage Paysager</SelectItem>
                <SelectItem value="spiral">🌀 Navigation Spirale</SelectItem>
                <SelectItem value="overview">📊 Vue d'ensemble</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Paramètres d'interface */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Interface</Label>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="compact-mode">Mode compact</Label>
                  <p className="text-sm text-slate-600">Interface plus dense avec moins d'espacement</p>
                </div>
                <Switch
                  id="compact-mode"
                  checked={preferences.interfaceSettings.compactMode}
                  onCheckedChange={(checked) => handleInterfaceSettingChange('compactMode', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="show-guides">Guides contextuels</Label>
                  <p className="text-sm text-slate-600">Afficher les conseils et instructions</p>
                </div>
                <Switch
                  id="show-guides"
                  checked={preferences.interfaceSettings.showGuides}
                  onCheckedChange={(checked) => handleInterfaceSettingChange('showGuides', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="animations">Animations</Label>
                  <p className="text-sm text-slate-600">Transitions et effets visuels</p>
                </div>
                <Switch
                  id="animations"
                  checked={preferences.interfaceSettings.animationsEnabled}
                  onCheckedChange={(checked) => handleInterfaceSettingChange('animationsEnabled', checked)}
                />
              </div>
            </div>
          </div>

          {/* Profil émotionnel */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Profil Émotionnel</Label>
            <div className="p-4 bg-slate-50 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Axe dominant:</span>
                <Badge variant="outline">
                  {preferences.emotionalProfile.dominantAxis || 'Non déterminé'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Jardin prioritaire:</span>
                <Badge variant="outline">
                  {preferences.emotionalProfile.primaryGarden || 'Non déterminé'}
                </Badge>
              </div>
              {preferences.emotionalProfile.lastAssessmentDate && (
                <div className="flex justify-between">
                  <span className="text-sm">Dernière évaluation:</span>
                  <span className="text-sm text-slate-600">
                    {new Date(preferences.emotionalProfile.lastAssessmentDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={handleSave} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
            <Button onClick={handleReset} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Réinitialiser
            </Button>
            <Button onClick={onClose} variant="ghost">
              Annuler
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPanel;
