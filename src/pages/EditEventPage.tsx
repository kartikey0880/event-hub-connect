import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";
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
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);

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
        image_url: formData.get("image_url") as string,
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
        <div className="container mx-auto px-4 py-8">
          <p>Loading...</p>
        </div>
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
            <Label htmlFor="image_url">Image URL</Label>
            <Input id="image_url" name="image_url" type="url" defaultValue={event?.image_url} />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Updating..." : "Update Event"}
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
