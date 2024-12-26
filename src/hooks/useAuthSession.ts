import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const useAuthSession = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const checkSession = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Session expirée",
        description: "Veuillez vous reconnecter",
        variant: "destructive",
      });
      navigate('/');
      return false;
    }
    return true;
  }, [toast, navigate]);

  return { checkSession };
};