import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { Category } from "@/types/nominees";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AddNomineeFormProps {
  categories: Category[];
  onSubmit: (nominee: { name: string; description: string; category_id: string; image_url?: string }) => void;
}

export const AddNomineeForm = ({ categories, onSubmit }: AddNomineeFormProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('nominees-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('nominees-images')
        .getPublicUrl(fileName);

      setImageUrl(publicUrl);
      toast({
        title: "Succès",
        description: "Image téléchargée avec succès"
      });
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger l'image",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !categoryId) return;

    onSubmit({
      name,
      description,
      category_id: categoryId,
      image_url: imageUrl,
    });

    // Reset form
    setName("");
    setDescription("");
    setCategoryId("");
    setImageUrl("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ajouter un nouveau nominé</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Nom du nominé"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Select value={categoryId} onValueChange={setCategoryId} required>
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
          </div>

          <Textarea
            placeholder="Description du nominé"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div className="space-y-4">
            {imageUrl && (
              <div className="relative h-32 w-full overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={imageUrl}
                  alt={name}
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
                className="w-full h-32 border-dashed"
                disabled={isUploading}
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Téléchargement en cours...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    {imageUrl ? (
                      <>
                        <ImageIcon className="h-6 w-6" />
                        <span>Changer l'image</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-6 w-6" />
                        <span>Cliquez ou déposez une image ici</span>
                      </>
                    )}
                  </div>
                )}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isUploading}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter le nominé
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};