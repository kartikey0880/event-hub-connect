import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";
import EventCard from "@/components/EventCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Trophy, User } from "lucide-react";

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

    await Promise.all([fetchProfile(session.user.id), fetchRegisteredEvents(session.user.id)]);
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
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Your Registered Events</h2>
          
          {loading ? (
            <div className="py-16 text-center">
              <p className="text-muted-foreground">Loading your events...</p>
            </div>
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
      </div>
    </div>
  );
};

export default Dashboard;
