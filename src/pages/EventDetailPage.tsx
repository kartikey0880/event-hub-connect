import { useEffect, useState } from "react";
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock, Share2, Edit, Trash2 } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Event {
  id: string;
  title: string;
  description: string;
  full_description: string | null;
  date: string;
  time: string;
  location: string;
  category: string;
  current_attendees: number;
  max_capacity: number;
  organizer: string;
  image_url: string | null;
  created_by: string;
}

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [registering, setRegistering] = useState(false);
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchEvent();
  }, [id]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
    
    if (session?.user && id) {
      checkRegistration(session.user.id);
    }
  };

  const checkRegistration = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("event_registrations")
        .select("id")
        .eq("event_id", id)
        .eq("user_id", userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      setIsRegistered(!!data);
    } catch (error: any) {
      console.error("Error checking registration:", error);
    }
  };

  const fetchEvent = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setEvent(data);
      
      if (user && data.created_by === user.id) {
        setIsCreator(true);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading event",
        description: error.message,
      });
      navigate("/events");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (!event) return;

    if (event.current_attendees >= event.max_capacity) {
      toast({
        variant: "destructive",
        title: "Event Full",
        description: "This event has reached maximum capacity.",
      });
      return;
    }

    setRegistering(true);
    try {
      const { error } = await supabase
        .from("event_registrations")
        .insert({
          event_id: event.id,
          user_id: user.id,
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            variant: "destructive",
            title: "Already registered",
            description: "You're already registered for this event.",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Registration successful!",
          description: "You've been registered for this event.",
        });
        setIsRegistered(true);
        fetchEvent(); // Refresh event data
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message,
      });
    } finally {
      setRegistering(false);
    }
  };

  const handleUnregister = async () => {
    if (!user || !event) return;

    setRegistering(true);
    try {
      const { error } = await supabase
        .from("event_registrations")
        .delete()
        .eq("event_id", event.id)
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Unregistered",
        description: "You've been removed from this event.",
      });
      setIsRegistered(false);
      fetchEvent(); // Refresh event data
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setRegistering(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied!",
      description: "Event link copied to clipboard.",
    });
  };

  const handleDelete = async () => {
    if (!event) return;

    try {
      const { error } = await supabase.from("events").delete().eq("id", event.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Event deleted successfully!",
      });
      navigate("/events");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete event.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AuthenticatedNavbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <AuthenticatedNavbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Event not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedNavbar />

      <div className="relative h-[400px] w-full overflow-hidden">
        <img
          src={event.image_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80"}
          alt={event.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <Badge variant="secondary" className="mb-4">{event.category}</Badge>
            <h1 className="mb-4 text-4xl font-bold">{event.title}</h1>
            <p className="text-lg text-muted-foreground">{event.description}</p>
          </div>

          <div className="mb-8 grid gap-4 rounded-lg border bg-card p-6 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Date</div>
                <div className="font-medium">{event.date}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Time</div>
                <div className="font-medium">{event.time}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Location</div>
                <div className="font-medium">{event.location}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Attendees</div>
                <div className="font-medium">{event.current_attendees} / {event.max_capacity}</div>
              </div>
            </div>
          </div>

          {event.full_description && (
            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold">About This Event</h2>
              <p className="leading-relaxed text-muted-foreground">{event.full_description}</p>
            </div>
          )}

          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Organized By</h2>
            <p className="text-muted-foreground">{event.organizer}</p>
          </div>

          <div className="sticky bottom-0 border-t bg-background py-4">
            <div className="flex flex-wrap gap-3">
              {isCreator ? (
                <>
                  <Button size="lg" variant="outline" onClick={() => navigate(`/events/${id}/edit`)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Event
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="lg" variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Event
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Event</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this event? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              ) : user ? (
                isRegistered ? (
                  <Button 
                    size="lg" 
                    variant="destructive" 
                    onClick={handleUnregister}
                    disabled={registering}
                  >
                    {registering ? "Canceling..." : "Cancel Registration"}
                  </Button>
                ) : (
                  <Button 
                    size="lg" 
                    onClick={handleRegister}
                    disabled={registering || event.current_attendees >= event.max_capacity}
                  >
                    {registering ? "Registering..." : event.current_attendees >= event.max_capacity ? "Event Full" : "Register for Event"}
                  </Button>
                )
              ) : (
                <Button size="lg" onClick={() => navigate("/auth")}>
                  Sign In to Register
                </Button>
              )}
              <Button size="lg" variant="outline" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
