import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [event, setEvent] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data || data.created_by !== user.id) {
      navigate("/events");
      return;
    }

    setEvent(data);
    setImagePreview(data.image_url);
    setLoading(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('event-images')
      .upload(filePath, file);

    if (uploadError) {
      toast({
        title: "Error",
        description: "Failed to upload image.",
        variant: "destructive",
      });
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('event-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);

    let imageUrl = event?.image_url;
    if (imageFile) {
      setUploading(true);
      const newImageUrl = await uploadImage(imageFile);
      setUploading(false);
      if (!newImageUrl) {
        setSubmitting(false);
        return;
      }
      imageUrl = newImageUrl;
    }

    const { error } = await supabase
      .from("events")
      .update({
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        full_description: formData.get("full_description") as string,
        date: formData.get("date") as string,
        time: formData.get("time") as string,
        location: formData.get("location") as string,
        organizer: formData.get("organizer") as string,
        category: formData.get("category") as string,
        max_capacity: parseInt(formData.get("max_capacity") as string),
        image_url: imageUrl,
      })
      .eq("id", id);

    setSubmitting(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update event. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Event updated successfully!",
    });
    navigate(`/events/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AuthenticatedNavbar />
        <LoadingSpinner message="Loading event details..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedNavbar />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Edit Event</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Event Title</Label>
            <Input id="title" name="title" defaultValue={event?.title} required />
          </div>

          <div>
            <Label htmlFor="description">Short Description</Label>
            <Textarea id="description" name="description" defaultValue={event?.description} required rows={3} />
          </div>

          <div>
            <Label htmlFor="full_description">Full Description</Label>
            <Textarea id="full_description" name="full_description" defaultValue={event?.full_description} rows={5} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" defaultValue={event?.date} required />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input id="time" name="time" type="time" defaultValue={event?.time} required />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" defaultValue={event?.location} required />
          </div>

          <div>
            <Label htmlFor="organizer">Organizer</Label>
            <Input id="organizer" name="organizer" defaultValue={event?.organizer} required />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select name="category" defaultValue={event?.category} required>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Sports">Sports</SelectItem>
                <SelectItem value="Culture">Culture</SelectItem>
                <SelectItem value="Academic">Academic</SelectItem>
                <SelectItem value="Social">Social</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="max_capacity">Max Capacity</Label>
            <Input id="max_capacity" name="max_capacity" type="number" defaultValue={event?.max_capacity} required />
          </div>

          <div>
            <Label htmlFor="image">Event Image</Label>
            <Input 
              id="image" 
              name="image" 
              type="file" 
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="mt-4">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="max-w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              Upload a new image to replace the current one
            </p>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={submitting || uploading}>
              {uploading ? "Uploading..." : submitting ? "Updating..." : "Update Event"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate(`/events/${id}`)}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventPage;
