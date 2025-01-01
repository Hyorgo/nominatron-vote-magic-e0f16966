import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category, Nominee } from "@/types/nominees";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Image, Upload } from "lucide-react";

interface EditNomineeFormProps {
  nominee: Nominee;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const EditNomineeForm = ({ nominee, categories, isOpen, onClose, onUpdate }: EditNomineeFormProps) => {
  const [formData, setFormData] = useState({
    name: nominee.name,
    description: nominee.description,
    category_id: nominee.category_id || "",
    image_url: nominee.image_url || ""
  });
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('nominees-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('nominees-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      toast({
        title: "Succès",
        description: "Image téléchargée avec succès"
      });
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger l'image",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    const { error } = await supabase
      .from('nominees')
      .update({
        name: formData.name,
        description: formData.description,
        category_id: formData.category_id,
        image_url: formData.image_url
      })
      .eq('id', nominee.id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le nominé",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Nominé mis à jour avec succès"
    });
    onUpdate();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le nominé</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder="Nom du nominé"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Textarea
              placeholder="Description du nominé"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          
          <Select
            value={formData.category_id}
            onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="space-y-4">
            {formData.image_url && (
              <div className="relative h-32 w-full overflow-hidden rounded-lg">
                <img
                  src={formData.image_url}
                  alt={formData.name}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={isUploading}
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                {isUploading ? (
                  "Téléchargement..."
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    {formData.image_url ? "Changer l'image" : "Ajouter une image"}
                  </>
                )}
              </Button>
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Sauvegarder les modifications
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};