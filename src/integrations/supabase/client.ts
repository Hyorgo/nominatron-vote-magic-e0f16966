import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://psnxgyuomxstuzrqfcwy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzbnhneXVvbXhzdHV6cnFmY3d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MzA5MzAsImV4cCI6MjA1MDIwNjkzMH0.mdJ2LsqiRlsU3ngJ69YWLiKe65hA9xDeejagwDzuJZs";

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.error('Erreur: Identifiants Supabase manquants');
}

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_PUBLISHABLE_KEY
      },
    },
    db: {
      schema: 'public'
    }
  }
);

// Ajout de logs détaillés pour le développement
if (import.meta.env.DEV) {
  console.log('Client Supabase initialisé avec URL:', SUPABASE_URL);
  
  // Écoute des changements de configuration
  const channel = supabase.channel('config-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'site_settings'
      },
      (payload) => {
        console.log('Changement de configuration détecté:', payload);
      }
    )
    .subscribe((status) => {
      console.log('Statut de la souscription aux changements:', status);
    });

  // Log de toutes les requêtes en développement
  const originalFrom = supabase.from.bind(supabase);
  supabase.from = (table: string) => {
    console.log(`Requête vers la table: ${table}`);
    const client = originalFrom(table);
    
    // Ajout de logs pour les erreurs
    const originalSelect = client.select.bind(client);
    client.select = (...args: any[]) => {
      console.log(`Sélection dans la table ${table} avec les arguments:`, args);
      return originalSelect(...args);
    };
    
    return client;
  };

  // Nettoyage lors de la fermeture de la fenêtre
  window.addEventListener('beforeunload', () => {
    channel.unsubscribe();
  });
}