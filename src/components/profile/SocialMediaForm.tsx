
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Save, X, Facebook, Instagram, Twitter } from "lucide-react";
import { glass } from "@/lib/utils";

type SocialMediaFormValues = {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  snapchat?: string;
};

export default function SocialMediaForm({ 
  initialValues, 
  onSave 
}: { 
  initialValues?: SocialMediaFormValues, 
  onSave?: (values: SocialMediaFormValues) => void 
}) {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<SocialMediaFormValues>({
    defaultValues: initialValues || {
      facebook: '',
      instagram: '',
      twitter: '',
      snapchat: ''
    }
  });

  const handleSubmit = async (values: SocialMediaFormValues) => {
    if (!user) {
      toast.error("You must be logged in to update your profile");
      return;
    }

    setIsSaving(true);
    try {
      // Save social media accounts to the profiles table
      const { error } = await supabase
        .from("profiles")
        .update({
          social_facebook: values.facebook || null,
          social_instagram: values.instagram || null,
          social_twitter: values.twitter || null,
          social_snapchat: values.snapchat || null
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Social media accounts updated!");
      if (onSave) onSave(values);
    } catch (error) {
      console.error("Error updating social media:", error);
      toast.error("Failed to update your social media accounts");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="facebook"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Facebook className="h-4 w-4 text-blue-600" /> Facebook
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your Facebook username"
                    className={glass}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="instagram"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Instagram className="h-4 w-4 text-pink-600" /> Instagram
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your Instagram username"
                    className={glass}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="twitter"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Twitter className="h-4 w-4 text-blue-400" /> X / Twitter
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your X/Twitter username"
                    className={glass}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="snapchat"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <span className="text-yellow-400 font-bold text-sm">👻</span> Snapchat
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your Snapchat username"
                    className={glass}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            className={glass}
            onClick={handleCancel}
          >
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button 
            type="submit" 
            className={glass}
            disabled={isSaving}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Social Media'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
