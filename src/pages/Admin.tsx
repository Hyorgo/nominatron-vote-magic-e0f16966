import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Admin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      console.log("Vérification de la session admin...");
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Session actuelle:", session);
      
      if (session) {
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', session.user.email)
          .maybeSingle();

        console.log("Données admin:", adminData);
        if (adminData) {
          navigate('/admin/dashboard');
        }
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  const recordAuthAttempt = async (email: string, success: boolean) => {
    try {
      console.log("Enregistrement de la tentative de connexion...");
      const response = await fetch('https://api.ipify.org?format=json');
      const { ip } = await response.json();
      const userAgent = navigator.userAgent;

      const { error } = await supabase
        .from('auth_attempts')
        .insert([{
          email,
          ip_address: ip,
          success,
          user_agent: userAgent
        }]);

      if (error) {
        console.error("Erreur lors de l'enregistrement de la tentative:", error);
      }
    } catch (error) {
      console.error('Error recording auth attempt:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Début de la tentative de connexion");
    
    if (loading) {
      console.log("Déjà en cours de chargement, annulation");
      return;
    }
    
    if (!email || !password) {
      console.log("Email ou mot de passe manquant");
      toast({
        variant: "destructive",
        title: "Erreur de saisie",
        description: "Veuillez remplir tous les champs",
      });
      return;
    }

    setLoading(true);
    console.log("Tentative de connexion pour:", email);

    try {
      // Vérification du rate limit
      console.log("Vérification du rate limit...");
      const response = await fetch('https://api.ipify.org?format=json');
      const { ip } = await response.json();
      
      const { data: checkResult } = await supabase
        .rpc('check_auth_attempts', {
          check_email: email,
          check_ip: ip
        });

      console.log("Résultat du rate limit:", checkResult);

      if (!checkResult) {
        toast({
          variant: "destructive",
          title: "Trop de tentatives",
          description: "Veuillez réessayer dans quelques minutes",
        });
        setLoading(false);
        return;
      }

      // Tentative de connexion
      console.log("Tentative de connexion Supabase...");
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error("Erreur d'authentification:", authError);
        await recordAuthAttempt(email, false);
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: "Email ou mot de passe incorrect",
        });
        setLoading(false);
        return;
      }

      console.log("Résultat de la connexion:", data);

      if (data.session) {
        console.log("Session créée, vérification des droits admin...");
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', data.session.user.email)
          .maybeSingle();

        console.log("Résultat de la vérification admin:", adminData, adminError);

        if (adminError || !adminData) {
          console.error("Erreur ou pas de droits admin:", adminError);
          await supabase.auth.signOut();
          await recordAuthAttempt(email, false);
          toast({
            variant: "destructive",
            title: "Accès refusé",
            description: "Vous n'avez pas les droits d'administration",
          });
          setLoading(false);
          return;
        }

        console.log("Connexion réussie, redirection...");
        await recordAuthAttempt(email, true);
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans l'interface d'administration",
        });
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error("Erreur inattendue:", error);
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Une erreur est survenue lors de la connexion",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Administration</CardTitle>
          <CardDescription className="text-center">
            Connectez-vous à l'interface d'administration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="admin@example.com"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              className="w-full"
              type="submit"
              disabled={loading}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;