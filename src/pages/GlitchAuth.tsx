import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

const GlitchAuth = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isFr = language === 'fr';
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const t = {
    kicker: isFr ? 'Vol. 02 · Passage GL!TCH' : 'Vol. 02 · GL!TCH Passage',
    title: 'Calm Magic Board',
    welcome: isFr ? 'Bon retour' : 'Welcome back',
    create: isFr ? 'Créez votre compte' : 'Create your account',
    email: isFr ? 'Courriel' : 'Email',
    password: isFr ? 'Mot de passe' : 'Password',
    loading: isFr ? 'Chargement…' : 'Loading...',
    signIn: isFr ? 'Se connecter' : 'Sign In',
    signUp: isFr ? "S'inscrire" : 'Sign Up',
    or: isFr ? 'Ou' : 'Or',
    demo: isFr ? 'Essayer le compte démo' : 'Try Demo Account',
    noAccount: isFr ? "Pas encore de compte ? S'inscrire" : "Don't have an account? Sign up",
    hasAccount: isFr ? 'Déjà un compte ? Se connecter' : 'Already have an account? Sign in',
    back: isFr ? "← Retour à l'accueil" : '← Back to home',
    invalidCreds: isFr
      ? "Courriel ou mot de passe invalide. Réessayez ou créez un compte."
      : 'Invalid email or password. Please try again or sign up for a new account.',
    alreadyRegistered: isFr
      ? 'Ce courriel est déjà enregistré. Veuillez vous connecter.'
      : 'This email is already registered. Please sign in instead.',
    welcomeBack: isFr ? 'Bon retour !' : 'Welcome back!',
    accountCreated: isFr ? 'Compte créé avec succès !' : 'Account created successfully!',
    accountCheckEmail: isFr
      ? 'Compte créé ! Vérifiez votre courriel pour confirmer.'
      : 'Account created! Please check your email to confirm your account.',
    demoCreated: isFr ? 'Compte démo créé et connecté !' : 'Demo account created and logged in!',
    demoCheckEmail: isFr
      ? 'Compte démo créé ! Vérifiez votre courriel pour confirmer.'
      : 'Demo account created! Please check email to confirm.',
    demoLogged: isFr ? 'Connecté comme utilisateur démo !' : 'Logged in as demo user!',
    demoFailed: isFr ? 'Échec de la connexion démo' : 'Demo login failed',
    demoSetupFailed: isFr ? 'Échec de la configuration du compte démo : ' : 'Demo account setup failed: ',
  };

  const handleDemoLogin = async () => {
    const demoEmail = 'demouser@glitchcompass.com';
    const demoPassword = 'P4r4c0$m2025';
    setLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword,
      });
      if (signInError) {
        const redirectUrl = `${window.location.origin}/calm-magic-board`;
        const { error: signUpError, data } = await supabase.auth.signUp({
          email: demoEmail,
          password: demoPassword,
          options: { emailRedirectTo: redirectUrl },
        });
        if (signUpError) {
          toast.error(t.demoSetupFailed + signUpError.message);
          return;
        }
        if (data.session) {
          toast.success(t.demoCreated);
          navigate('/calm-magic-board');
        } else {
          toast.success(t.demoCheckEmail);
        }
      } else {
        toast.success(t.demoLogged);
        navigate('/calm-magic-board');
      }
    } catch (error: any) {
      toast.error(t.demoFailed);
      console.error('Demo login error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      navigate('/calm-magic-board');
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error(t.invalidCreds);
          } else {
            toast.error(error.message);
          }
          throw error;
        }
        toast.success(t.welcomeBack);
        navigate('/calm-magic-board');
      } else {
        const redirectUrl = `${window.location.origin}/calm-magic-board`;
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirectUrl },
        });
        if (error) {
          if (error.message.includes('User already registered')) {
            toast.error(t.alreadyRegistered);
            setIsLogin(true);
          } else {
            toast.error(error.message);
          }
          throw error;
        }
        if (data.session) {
          toast.success(t.accountCreated);
          navigate('/calm-magic-board');
        } else {
          toast.success(t.accountCheckEmail);
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(230_35%_10%)] text-[hsl(35_20%_92%)] flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 space-y-6 bg-white/[0.03] border-white/10 backdrop-blur-sm">
        <div className="text-center space-y-3">
          <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-semibold text-[hsl(45_90%_65%)]">
            {t.kicker}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-tight">
            {t.title}
          </h1>
          <p className="text-sm opacity-70">{isLogin ? t.welcome : t.create}</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t.email}</Label>
            <Input id="email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t.password}</Label>
            <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t.loading : isLogin ? t.signIn : t.signUp}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">{t.or}</span>
          </div>
        </div>

        <Button variant="outline" className="w-full" onClick={handleDemoLogin} disabled={loading}>
          {t.demo}
        </Button>

        <div className="text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-muted-foreground hover:text-primary transition-colors">
            {isLogin ? t.noAccount : t.hasAccount}
          </button>
        </div>

        <div className="pt-4 border-t text-center">
          <button onClick={() => navigate('/')} className="text-sm text-muted-foreground hover:text-primary transition-colors">
            {t.back}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default GlitchAuth;
