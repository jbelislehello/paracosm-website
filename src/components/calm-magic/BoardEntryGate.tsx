import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Heart, 
  Briefcase, 
  Compass, 
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Target,
  Check,
  LogIn,
  Rocket
} from 'lucide-react';
import { MODE_CONTENT, MODE_THEMES, JOURNEY_MODES_DESCRIPTION, ModeType } from '@/data/modeAwareContent';
import { AssessmentResult, generateBoardEntryParams } from '@/utils/assessmentToTolerance';
import { gardens, ExtendedGarden } from '@/data/gardens';
import { GardenType } from '@/types/journal';
import { useProjects } from '@/context/ProjectsContext';
import { useUserSession } from '@/hooks/useUserSession';
import { useSubscription } from '@/hooks/useSubscription';
import { 
  canCreateProject, 
  getProjectLimit, 
  getTierDisplayName,
  getNextUpgradeTier,
  SUBSCRIPTION_TIERS 
} from '@/data/subscriptionTiers';

type EntryStep = 'limit' | 'mode' | 'garden' | 'name' | 'signup';

interface BoardEntryGateProps {
  isOpen: boolean;
  onClose: () => void;
  sourceContext?: 'relational' | 'agentic' | 'direct';
  assessmentResult?: AssessmentResult;
  preselectedMode?: ModeType;
}

const BoardEntryGate: React.FC<BoardEntryGateProps> = ({
  isOpen,
  onClose,
  sourceContext = 'direct',
  assessmentResult,
  preselectedMode
}) => {
  const navigate = useNavigate();
  const { user } = useUserSession();
  const { projects, createProject } = useProjects();
  const { tier, createCheckout, isLoading: isSubLoading } = useSubscription();
  const [currentStep, setCurrentStep] = useState<EntryStep>(preselectedMode ? 'garden' : 'mode');
  const [selectedMode, setSelectedMode] = useState<ModeType | null>(preselectedMode || null);
  const [selectedGarden, setSelectedGarden] = useState<GardenType | null>(null);
  const [projectName, setProjectName] = useState('');
  const [pendingProject, setPendingProject] = useState<{ id: string } | null>(null);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  
  const isGuest = !user;
  const projectCount = projects.length;
  const canCreate = canCreateProject(tier, projectCount);
  const projectLimit = getProjectLimit(tier);
  const tierName = getTierDisplayName(tier);
  const nextTierKey = getNextUpgradeTier(tier);
  const nextTier = nextTierKey ? SUBSCRIPTION_TIERS[nextTierKey] : null;

  // Check project limit when modal opens
  useEffect(() => {
    if (isOpen && !canCreate) {
      setCurrentStep('limit');
    } else if (isOpen) {
      setCurrentStep(preselectedMode ? 'garden' : 'mode');
    }
  }, [isOpen, canCreate, preselectedMode]);

  const handleModeSelect = (mode: ModeType) => {
    setSelectedMode(mode);
  };

  const handleGardenSelect = (gardenType: GardenType) => {
    setSelectedGarden(gardenType);
  };

  const handleNext = async () => {
    if (currentStep === 'mode' && selectedMode) {
      setCurrentStep('garden');
    } else if (currentStep === 'garden' && selectedGarden) {
      setCurrentStep('name');
    } else if (currentStep === 'name' && projectName.trim().length >= 3) {
      // Create project first (saves to localStorage for guests)
      const newProject = await createProject(projectName.trim(), selectedGarden!, selectedMode!);
      setPendingProject(newProject);
      
      if (isGuest) {
        setCurrentStep('signup');
      } else {
        // Navigate directly for authenticated users
        navigateToBoard(newProject.id);
      }
    }
  };

  const navigateToBoard = (projectId: string) => {
    let url = '/calm-magic-board';
    const params = new URLSearchParams();
    
    params.set('projectId', projectId);
    
    if (assessmentResult) {
      const assessmentParams = generateBoardEntryParams(assessmentResult, selectedMode!);
      const assessmentSearchParams = new URLSearchParams(assessmentParams);
      assessmentSearchParams.forEach((value, key) => {
        if (key !== 'mode') {
          params.set(key, value);
        }
      });
    }

    url += `?${params.toString()}`;
    onClose();
    navigate(url);
  };

  const handleBack = () => {
    if (currentStep === 'garden') {
      setCurrentStep('mode');
    } else if (currentStep === 'name') {
      setCurrentStep('garden');
    } else if (currentStep === 'signup') {
      setCurrentStep('name');
    }
  };

  const handleSignIn = () => {
    onClose();
    navigate('/auth', { state: { returnTo: '/projects' } });
  };

  const canProceed = () => {
    if (currentStep === 'mode') return !!selectedMode;
    if (currentStep === 'garden') return !!selectedGarden;
    if (currentStep === 'name') return projectName.trim().length >= 3;
    if (currentStep === 'signup') return true;
    return false;
  };

  const visibleSteps: EntryStep[] = isGuest ? ['mode', 'garden', 'name', 'signup'] : ['mode', 'garden', 'name'];

  const isStepComplete = (step: EntryStep) => {
    if (step === 'mode') return !!selectedMode;
    if (step === 'garden') return !!selectedGarden;
    if (step === 'name') return projectName.trim().length >= 3;
    if (step === 'signup') return false;
    return false;
  };

  const isStepActive = (step: EntryStep) => currentStep === step;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Compass className="w-6 h-6 text-primary" />
            Create Your Board
          </DialogTitle>
          <DialogDescription>
            Set up your project space in the Calm Magic Board
          </DialogDescription>
        </DialogHeader>

        {/* Step Indicator - hide when at limit */}
        {currentStep !== 'limit' && (
          <div className="flex items-center justify-center gap-2 py-2">
            {visibleSteps.filter(s => s !== 'signup' && s !== 'limit').map((step, index) => (
              <React.Fragment key={step}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      isStepComplete(step)
                        ? 'bg-primary text-primary-foreground'
                        : isStepActive(step)
                        ? 'bg-primary/20 text-primary border-2 border-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {isStepComplete(step) && !isStepActive(step) ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className={`text-sm hidden sm:inline ${isStepActive(step) ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                    {step === 'mode' ? 'Mode' : step === 'garden' ? 'Garden' : 'Name'}
                  </span>
                </div>
                {index < 2 && (
                  <div className={`w-8 h-0.5 ${isStepComplete(step) ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        <div className="space-y-6 py-4">
          {/* Project Limit Reached */}
          {currentStep === 'limit' && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 flex items-center justify-center mb-4">
                  <Rocket className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold">Project Limit Reached</h3>
                <p className="text-sm text-muted-foreground">
                  You've used all {projectLimit} project{projectLimit !== 1 ? 's' : ''} on the {tierName} plan
                </p>
              </div>

              {/* Current Usage */}
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">Projects Used</span>
                  <span className="font-semibold">{projectCount} / {projectLimit}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              {/* Upgrade Option */}
              {nextTier ? (
                <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border border-primary/20">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center shrink-0">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{nextTier.name}</h4>
                        <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white border-0">
                          ${nextTier.price}/mo
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {nextTier.projects === -1 ? 'Unlimited projects' : `Up to ${nextTier.projects} projects`}
                      </p>
                      <ul className="space-y-1">
                        {nextTier.features.slice(0, 3).map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Check className="w-3 h-3 text-primary" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-muted/50 border border-border text-center">
                  <p className="text-sm text-muted-foreground">
                    You're on the highest tier.{' '}
                    <a href="/contact" className="text-primary hover:underline">
                      Contact us
                    </a>{' '}
                    for enterprise options.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 1: Mode Selection */}
          {currentStep === 'mode' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">Choose Your Journey Mode</h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Personal Mode */}
                <button
                  onClick={() => handleModeSelect('personal')}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    selectedMode === 'personal'
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/30'
                      : 'border-border hover:border-rose-300 hover:bg-rose-50/50 dark:hover:bg-rose-950/20'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Personal</h3>
                      <p className="text-xs text-muted-foreground">Relational Design</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {JOURNEY_MODES_DESCRIPTION.personal.subtitle}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {JOURNEY_MODES_DESCRIPTION.personal.focus.slice(0, 2).map((item) => (
                      <Badge key={item} variant="secondary" className="text-xs bg-rose-100 dark:bg-rose-900/30">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </button>

                {/* Professional Mode */}
                <button
                  onClick={() => handleModeSelect('professional')}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    selectedMode === 'professional'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                      : 'border-border hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-950/20'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Professional</h3>
                      <p className="text-xs text-muted-foreground">Product Design</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {JOURNEY_MODES_DESCRIPTION.professional.subtitle}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {JOURNEY_MODES_DESCRIPTION.professional.focus.slice(0, 2).map((item) => (
                      <Badge key={item} variant="secondary" className="text-xs bg-blue-100 dark:bg-blue-900/30">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Garden Selection */}
          {currentStep === 'garden' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">Choose Your Garden</h3>
              <p className="text-sm text-muted-foreground text-center">
                Where will your project take root?
              </p>
              <div className="grid grid-cols-1 gap-3">
                {gardens.map((garden) => (
                  <button
                    key={garden.type}
                    onClick={() => handleGardenSelect(garden.type)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      selectedGarden === garden.type
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${garden.color}20` }}
                      >
                        {garden.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground">{garden.name}</h4>
                          {selectedGarden === garden.type && (
                            <Check className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {garden.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className="text-xs"
                            style={{ borderColor: garden.color, color: garden.color }}
                          >
                            {garden.semanticStage}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {garden.stageDetails.slice(0, 2).join(' • ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Project Name */}
          {currentStep === 'name' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">Name Your Project</h3>
              <p className="text-sm text-muted-foreground text-center">
                Give your initiative a meaningful name
              </p>
              
              <div className="space-y-2">
                <Label htmlFor="projectName">Project / Initiative Name</Label>
                <Input
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g., Q1 Product Redesign, Team Wellness Initiative"
                  className="text-lg"
                  autoFocus
                />
                {projectName.length > 0 && projectName.length < 3 && (
                  <p className="text-xs text-destructive">Name must be at least 3 characters</p>
                )}
              </div>

              {/* Summary Preview */}
              {selectedMode && selectedGarden && projectName.trim().length >= 3 && (
                <div className="p-4 rounded-lg bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 border border-border/50">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-foreground">{projectName}</h4>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs capitalize">
                          {selectedMode}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className="text-xs"
                          style={{ 
                            borderColor: gardens.find(g => g.type === selectedGarden)?.color,
                            color: gardens.find(g => g.type === selectedGarden)?.color
                          }}
                        >
                          {gardens.find(g => g.type === selectedGarden)?.icon} {gardens.find(g => g.type === selectedGarden)?.name}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Signup Prompt (Guests Only) */}
          {currentStep === 'signup' && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Project Created!</h3>
                <p className="text-sm text-muted-foreground">
                  Your project "{projectName}" has been saved locally.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                <div className="flex items-start gap-3">
                  <LogIn className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-medium text-foreground">Sign in to continue</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Create an account or sign in to access the full Calm Magic Board experience and sync your projects across devices.
                    </p>
                  </div>
                </div>
              </div>

              {/* Project Summary */}
              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">{projectName}</h4>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs capitalize">
                        {selectedMode}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                        style={{ 
                          borderColor: gardens.find(g => g.type === selectedGarden)?.color,
                          color: gardens.find(g => g.type === selectedGarden)?.color
                        }}
                      >
                        {gardens.find(g => g.type === selectedGarden)?.icon} {gardens.find(g => g.type === selectedGarden)?.name}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Assessment Context (if available) */}
          {assessmentResult && currentStep === 'mode' && (
            <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Assessment Context Available</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  {assessmentResult.dominantAxis.toUpperCase()} axis
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {assessmentResult.primaryGarden} garden
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {assessmentResult.connectorMagnesorType}
                </Badge>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          {currentStep === 'limit' ? (
            <>
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              {nextTier ? (
                <Button 
                  onClick={async () => {
                    setIsCheckoutLoading(true);
                    try {
                      await createCheckout(nextTier.priceId);
                    } catch (e) {
                      console.error('Checkout error:', e);
                    } finally {
                      setIsCheckoutLoading(false);
                    }
                  }}
                  disabled={isCheckoutLoading || isSubLoading}
                  className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                >
                  {isCheckoutLoading ? 'Opening...' : `Upgrade to ${nextTier.name}`}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={() => { onClose(); navigate('/pricing'); }}
                  className="flex-1"
                >
                  View Plans
                </Button>
              )}
            </>
          ) : currentStep !== 'mode' && currentStep !== 'signup' ? (
            <Button variant="outline" onClick={handleBack} className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          ) : currentStep === 'signup' ? (
            <Button variant="outline" onClick={onClose} className="flex-1">
              Maybe Later
            </Button>
          ) : (
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          )}
          
          {currentStep !== 'limit' && currentStep === 'signup' ? (
            <Button 
              onClick={handleSignIn}
              className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In / Sign Up
            </Button>
          ) : currentStep !== 'limit' && (
            <Button 
              onClick={handleNext} 
              disabled={!canProceed()}
              className={`flex-1 ${
                currentStep === 'name' && selectedMode
                  ? selectedMode === 'personal' 
                    ? 'bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                  : ''
              }`}
            >
              {currentStep === 'name' ? 'Create Project' : 'Next'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BoardEntryGate;
