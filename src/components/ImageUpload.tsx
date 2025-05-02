
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImageUrl?: string | null;
  petId?: string;
}

const ImageUpload = ({ onImageUploaded, currentImageUrl, petId }: ImageUploadProps) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    
    setImageFile(file);
    
    // Create a preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    
    // Upload automatically after selecting the file
    uploadImage(file).then(url => {
      if (url) {
        onImageUploaded(url);
      }
    });
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!user) return null;
    
    try {
      setUploading(true);
      
      // Create a unique file path including the user ID and timestamp
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${petId || 'new'}/${Date.now()}.${fileExt}`;
      
      // Upload the image to Supabase storage
      const { data, error } = await supabase.storage
        .from('pet_images')
        .upload(filePath, file);
        
      if (error) {
        throw error;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('pet_images')
        .getPublicUrl(data.path);
        
      toast.success('Image uploaded successfully');
      return publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(error.message || 'Error uploading image');
      return null;
    } finally {
      setUploading(false);
    }
  };
  
  const handleRemoveImage = () => {
    setPreview(null);
    setImageFile(null);
    onImageUploaded('');
  };

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="relative w-full max-w-sm mx-auto">
          <img 
            src={preview} 
            alt="Pet preview" 
            className="rounded-lg w-full h-48 object-cover border border-border" 
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-black/50 rounded-full p-1 text-white hover:bg-black/75"
            aria-label="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Click to upload an image of your pet
            </p>
            <p className="text-xs text-gray-400 mt-1">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        </div>
      )}
      
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="sr-only"
      />
      
      {uploading && (
        <div className="w-full flex justify-center items-center py-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
