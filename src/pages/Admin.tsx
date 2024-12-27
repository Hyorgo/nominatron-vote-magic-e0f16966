import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
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
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', session.user.email)
        .maybeSingle();

      if (adminData) {
        navigate('/admin/dashboard');
      }
    }
  };

  const recordAuthAttempt = async (email: string, success: boolean) => {
    try {
      const userAgent = navigator.userAgent;
      const response = await fetch('https://api.ipify.org?format=json');
      const { ip } = await response.json();

      await supabase
        .from('auth_attempts')
        .insert([
          {
            email,
            ip_address: ip,
            success,
            user_agent: userAgent
          }
        ]);
    } catch (error) {
      console.error('Error recording auth attempt:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const { ip } = await response.json();
      
      const { data: checkResult } = await supabase
        .rpc('check_auth_attempts', {
          check_email: email,
          check_ip: ip
        });

      if (!checkResult) {
        toast({
          variant: "destructive",
          title: "Trop de tentatives",
          description: "Veuillez réessayer dans quelques minutes",
        });
        return;
      }

      const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        await recordAuthAttempt(email, false);
        throw authError;
      }

      if (session) {
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', session.user.email)
          .maybeSingle();

        if (adminError || !adminData) {
          await supabase.auth.signOut();
          await recordAuthAttempt(email, false);
          throw new Error("Accès non autorisé");
        }

        await recordAuthAttempt(email, true);
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans l'interface d'administration",
        });
        navigate('/admin/dashboard');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Email ou mot de passe incorrect",
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