import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";
import EventCard from "@/components/EventCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Trophy, User, Edit, Trash2 } from "lucide-react";

interface Profile {
  full_name: string;
  email: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  current_attendees: number;
  image_url: string | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    await Promise.all([
      fetchProfile(session.user.id), 
      fetchRegisteredEvents(session.user.id),
      fetchCreatedEvents(session.user.id)
    ]);
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading profile",
        description: error.message,
      });
    }
  };

  const fetchRegisteredEvents = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("event_registrations")
        .select(`
          event_id,
          events (
            id,
            title,
            description,
            date,
            location,
            category,
            current_attendees,
            image_url
          )
        `)
        .eq("user_id", userId);

      if (error) throw error;
      
      const events = data?.map((reg: any) => reg.events).filter(Boolean) || [];
      setRegisteredEvents(events);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading events",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCreatedEvents = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("created_by", userId)
        .order("date", { ascending: true });

      if (error) throw error;
      setCreatedEvents(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading created events",
        description: error.message,
      });
    }
  };

  const handleDeleteEvent = async (eventId: string, eventTitle: string) => {
    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId);

      if (error) throw error;

      toast({
        title: "Event Deleted",
        description: `${eventTitle} has been deleted successfully.`,
      });

      setCreatedEvents(createdEvents.filter(e => e.id !== eventId));
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting event",
        description: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedNavbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Manage your events and profile</p>
        </div>

        {/* Profile Card */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <User className="h-8 w-8 text-primary" />
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">{profile?.full_name || "Loading..."}</p>
              <p className="text-sm text-muted-foreground">{profile?.email}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Calendar className="h-8 w-8 text-primary" />
              <CardTitle>Events Registered</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{registeredEvents.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Trophy className="h-8 w-8 text-primary" />
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Active Participant</p>
            </CardContent>
          </Card>
        </div>

        {/* Registered Events */}
        <div className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold">Your Registered Events</h2>
          
          {loading ? (
            <LoadingSpinner message="Loading your events..." />
          ) : registeredEvents.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {registeredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  description={event.description}
                  date={event.date}
                  location={event.location}
                  category={event.category}
                  attendees={event.current_attendees}
                  image={event.image_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80"}
                />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">You haven't registered for any events yet.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Browse our events and register to get started!
              </p>
            </Card>
          )}
        </div>

        {/* Created Events */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Events You Created</h2>
          
          {loading ? (
            <LoadingSpinner message="Loading..." />
          ) : createdEvents.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {createdEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <img 
                    src={event.image_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80"} 
                    alt={event.title}
                    className="h-48 w-full object-cover"
                  />
                  <CardContent className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Calendar className="h-4 w-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/events/${event.id}/edit`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" className="flex-1">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Event</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{event.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteEvent(event.id, event.title)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">You haven't created any events yet.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Create your first event to get started!
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
