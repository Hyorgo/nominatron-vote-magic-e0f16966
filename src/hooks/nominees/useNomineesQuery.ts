import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { logger } from '@/services/monitoring/logger';

const fetchNominees = async () => {
  logger.info('Fetching nominees');
  const { data, error } = await supabase
    .from("nominees")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    logger.error('Error fetching nominees:', error);
    throw error;
  }

  logger.info('Nominees fetched successfully:', { count: data?.length });
  return data;
};

export const useNomineesQuery = () => {
  return useQuery({
    queryKey: ["nominees"],
    queryFn: fetchNominees,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};