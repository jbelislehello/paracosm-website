import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  ArrowLeft,
  Copy,
  Check,
  RefreshCw,
  Database,
  HardDrive,
  AlertTriangle,
  ChevronDown,
  Download,
  Trash2,
  User,
  Sparkles,
  Activity,
  Shield,
} from 'lucide-react';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { useUserSession } from '@/hooks/useUserSession';
import { useSubscription } from '@/hooks/useSubscription';
import { useProjectContext, getLocalStorageProjects, getBackupProjects } from '@/hooks/useProjectContext';
import { getTierDisplayName } from '@/data/subscriptionTiers';
import { useToast } from '@/hooks/use-toast';

interface DiagnosticsResult {
  timestamp: string;
  localStorage: {
    projectCount: number;
    projectNames: string[];
    rawSize: number;
  };
  backup: {
    projectCount: number;
    projectNames: string[];
  };
  supabase: {
    projectCount: number;
    connected: boolean;
  };
  migrationStatus: string;
}

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, isLoading: userLoading } = useUserSession();
  const { tier, isSubscribed, isLoading: subLoading } = useSubscription();
  const { isAdmin } = useAdminStatus();
  const { 
    projects, 
    localStorageCount, 
    backupCount, 
    migrationStatus,
    recoverProjects,
    clearBackup,
  } = useProjectContext(user?.id);
  const { toast } = useToast();

  const [copied, setCopied] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryResult, setRecoveryResult] = useState<{ success: boolean; message: string } | null>(null);
  const [diagnostics, setDiagnostics] = useState<DiagnosticsResult | null>(null);
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [isDebugOpen, setIsDebugOpen] = useState(false);

  // Capture console logs related to ProjectContext
  useEffect(() => {
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    const captureLog = (type: string, args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      if (message.includes('[ProjectContext]')) {
        setDebugLogs(prev => [...prev.slice(-49), `[${type}] ${new Date().toISOString()}: ${message}`]);
      }
    };

    console.log = (...args) => {
      captureLog('LOG', args);
      originalLog.apply(console, args);
    };
    console.error = (...args) => {
      captureLog('ERROR', args);
      originalError.apply(console, args);
    };
    console.warn = (...args) => {
      captureLog('WARN', args);
      originalWarn.apply(console, args);
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  const copyUserId = async () => {
    if (user?.id) {
      await navigator.clipboard.writeText(user.id);
      setCopied(true);
      toast({ title: 'Copied!', description: 'User ID copied to clipboard' });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRecoverProjects = async () => {
    setIsRecovering(true);
    setRecoveryResult(null);
    
    try {
      const result = await recoverProjects();
      if (result.recovered > 0) {
        setRecoveryResult({ success: true, message: `Successfully recovered ${result.recovered} project(s)` });
        toast({ title: 'Recovery Complete', description: `Recovered ${result.recovered} project(s)` });
      } else if (result.error) {
        setRecoveryResult({ success: false, message: result.error });
        toast({ title: 'Recovery Info', description: result.error, variant: 'destructive' });
      } else {
        setRecoveryResult({ success: true, message: 'No projects to recover - all are already synced' });
      }
    } catch (error: any) {
      setRecoveryResult({ success: false, message: error.message || 'Recovery failed' });
      toast({ title: 'Recovery Failed', description: error.message, variant: 'destructive' });
    } finally {
      setIsRecovering(false);
    }
  };

  const handleClearBackup = () => {
    clearBackup();
    toast({ title: 'Backup Cleared', description: 'Local backup data has been removed' });
    setRecoveryResult(null);
  };

  const runDiagnostics = async () => {
    setIsRunningDiagnostics(true);
    
    try {
      const localProjects = getLocalStorageProjects();
      const backupProjects = getBackupProjects();
      
      // Calculate localStorage size
      let rawSize = 0;
      for (let key in localStorage) {
        if (key.includes('calm-magic')) {
          rawSize += localStorage.getItem(key)?.length || 0;
        }
      }

      const result: DiagnosticsResult = {
        timestamp: new Date().toISOString(),
        localStorage: {
          projectCount: localProjects.length,
          projectNames: localProjects.map(p => p.projectName),
          rawSize,
        },
        backup: {
          projectCount: backupProjects.length,
          projectNames: backupProjects.map(p => p.projectName),
        },
        supabase: {
          projectCount: projects.length,
          connected: !!user,
        },
        migrationStatus,
      };

      setDiagnostics(result);
      console.log('[ProjectContext] Diagnostics run:', result);
      toast({ title: 'Diagnostics Complete', description: 'Check the results below' });
    } catch (error: any) {
      toast({ title: 'Diagnostics Failed', description: error.message, variant: 'destructive' });
    } finally {
      setIsRunningDiagnostics(false);
    }
  };

  const exportDebugInfo = () => {
    const debugData = {
      timestamp: new Date().toISOString(),
      userId: user?.id,
      email: user?.email,
      diagnostics,
      logs: debugLogs,
      projects: projects.map(p => ({ id: p.id, name: p.projectName, createdAt: p.createdAt })),
    };

    const blob = new Blob([JSON.stringify(debugData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calm-magic-debug-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ title: 'Exported', description: 'Debug info downloaded' });
  };

  const hasRecoverableProjects = localStorageCount > 0 || backupCount > 0;

  if (userLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-8 px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Settings & Diagnostics</h1>
            <p className="text-muted-foreground text-sm">View account info, run diagnostics, and recover projects</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5" />
                Account Information
              </CardTitle>
              <CardDescription>Your user details and subscription status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground uppercase tracking-wide">User ID</label>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-3 py-2 bg-muted rounded-md text-sm font-mono truncate">
                          {user.id}
                        </code>
                        <Button variant="outline" size="icon" onClick={copyUserId}>
                          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground uppercase tracking-wide">Email</label>
                      <p className="px-3 py-2 bg-muted rounded-md text-sm truncate">{user.email}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground uppercase tracking-wide">Subscription</label>
                      {subLoading ? (
                        <div className="h-6 w-20 bg-muted animate-pulse rounded" />
                      ) : (
                        <Badge variant={isSubscribed ? 'default' : 'secondary'} className="gap-1">
                          <Sparkles className="w-3 h-3" />
                          {getTierDisplayName(tier)}
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground uppercase tracking-wide">Mode</label>
                      <Badge variant="outline" className="capitalize">{profile?.mode || 'Solo'}</Badge>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground uppercase tracking-wide">Projects</label>
                      <Badge variant="outline">{projects.length} in Supabase</Badge>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">Sign in to view your account details</p>
                  <Button onClick={() => navigate('/auth')}>Sign In</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Storage Diagnostics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <HardDrive className="w-5 h-5" />
                Storage Diagnostics
              </CardTitle>
              <CardDescription>Check localStorage and backup status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <div className="text-2xl font-bold">{localStorageCount}</div>
                  <div className="text-xs text-muted-foreground">localStorage Projects</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <div className="text-2xl font-bold">{backupCount}</div>
                  <div className="text-xs text-muted-foreground">Backup Projects</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <Badge variant={
                    migrationStatus === 'success' ? 'default' : 
                    migrationStatus === 'error' ? 'destructive' : 
                    migrationStatus === 'pending' ? 'secondary' : 
                    'outline'
                  }>
                    {migrationStatus}
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-1">Migration Status</div>
                </div>
              </div>

              <Button 
                onClick={runDiagnostics} 
                disabled={isRunningDiagnostics}
                className="w-full"
                variant="outline"
              >
                {isRunningDiagnostics ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Activity className="w-4 h-4 mr-2" />
                )}
                Run Diagnostics
              </Button>

              {diagnostics && (
                <div className="p-4 bg-muted rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ran at:</span>
                    <span>{new Date(diagnostics.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">localStorage size:</span>
                    <span>{(diagnostics.localStorage.rawSize / 1024).toFixed(2)} KB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Supabase connected:</span>
                    <span>{diagnostics.supabase.connected ? 'Yes' : 'No'}</span>
                  </div>
                  {diagnostics.localStorage.projectNames.length > 0 && (
                    <div>
                      <span className="text-muted-foreground">localStorage projects:</span>
                      <ul className="list-disc list-inside ml-2">
                        {diagnostics.localStorage.projectNames.map((name, i) => (
                          <li key={i} className="truncate">{name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project Recovery */}
          <Card className={hasRecoverableProjects ? 'border-amber-500/50' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Database className="w-5 h-5" />
                Project Recovery
                {hasRecoverableProjects && (
                  <Badge variant="outline" className="ml-2 text-amber-600 border-amber-500">
                    {localStorageCount + backupCount} recoverable
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Recover projects from localStorage or backup</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!user ? (
                <div className="flex items-center gap-3 p-4 bg-amber-500/10 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <p className="text-sm">Sign in to recover projects to your account</p>
                </div>
              ) : hasRecoverableProjects ? (
                <>
                  <div className="flex items-center gap-3 p-4 bg-amber-500/10 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    <p className="text-sm">
                      Found {localStorageCount + backupCount} project(s) that may not be synced to Supabase
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={handleRecoverProjects} 
                      disabled={isRecovering}
                      className="flex-1"
                    >
                      {isRecovering ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Database className="w-4 h-4 mr-2" />
                      )}
                      Recover Projects
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleClearBackup}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear Backup
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recoverable projects found. All data is synced.
                </p>
              )}

              {recoveryResult && (
                <div className={`p-4 rounded-lg ${recoveryResult.success ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                  <p className={`text-sm ${recoveryResult.success ? 'text-green-600' : 'text-red-600'}`}>
                    {recoveryResult.message}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Admin Tools */}
          {isAdmin && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="w-5 h-5" />
                  Admin Tools
                </CardTitle>
                <CardDescription>Manage platform settings and users</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate('/admin/subscriptions')} variant="outline" className="w-full">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Manage Subscription Overrides
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Debug Console */}
          <Card>
            <Collapsible open={isDebugOpen} onOpenChange={setIsDebugOpen}>
              <CardHeader className="cursor-pointer" onClick={() => setIsDebugOpen(!isDebugOpen)}>
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Activity className="w-5 h-5" />
                      Debug Console
                    </CardTitle>
                    <ChevronDown className={`w-5 h-5 transition-transform ${isDebugOpen ? 'rotate-180' : ''}`} />
                  </div>
                </CollapsibleTrigger>
                <CardDescription>View recent logs and export debug info</CardDescription>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <ScrollArea className="h-48 w-full rounded-md border bg-muted/30 p-4">
                    {debugLogs.length > 0 ? (
                      <div className="space-y-1 font-mono text-xs">
                        {debugLogs.map((log, i) => (
                          <div key={i} className={`${log.includes('ERROR') ? 'text-red-500' : log.includes('WARN') ? 'text-amber-500' : 'text-muted-foreground'}`}>
                            {log}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm text-center">
                        No logs captured yet. Logs will appear here as you use the app.
                      </p>
                    )}
                  </ScrollArea>
                  
                  <Button variant="outline" onClick={exportDebugInfo} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export Debug Info
                  </Button>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
