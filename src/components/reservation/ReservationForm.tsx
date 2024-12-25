import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ReservationFormProps {
  isLoading: boolean;
  onSubmit: (formData: FormData) => Promise<void>;
}

export const ReservationForm = ({ isLoading, onSubmit }: ReservationFormProps) => {
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(new FormData(e.currentTarget));
    }} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-gold/90">Prénom</Label>
          <Input 
            id="name" 
            name="name"
            placeholder="Votre prénom" 
            required 
            className="bg-white/5 border-white/10 focus:border-gold/50 transition-all duration-300"
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-gold/90">Nom</Label>
          <Input 
            id="lastName" 
            name="lastName"
            placeholder="Votre nom" 
            required 
            className="bg-white/5 border-white/10 focus:border-gold/50 transition-all duration-300"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gold/90">Email</Label>
          <Input 
            id="email" 
            name="email"
            type="email" 
            placeholder="votre@email.com" 
            required 
            className="bg-white/5 border-white/10 focus:border-gold/50 transition-all duration-300"
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="guests" className="text-gold/90">Nombre de personnes</Label>
          <Input 
            id="guests" 
            name="guests"
            type="number" 
            min="1" 
            max="10" 
            defaultValue="1" 
            required 
            className="bg-white/5 border-white/10 focus:border-gold/50 transition-all duration-300"
            disabled={isLoading}
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-gold/80 to-gold hover:from-gold hover:to-gold-light transition-all duration-300 text-navy font-semibold py-6"
        disabled={isLoading}
      >
        {isLoading ? 'Traitement en cours...' : 'Réserver maintenant'}
      </Button>
    </form>
  );
};