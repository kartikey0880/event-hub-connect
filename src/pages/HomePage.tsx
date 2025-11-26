import { useEffect, useState } from "react";
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";
import Hero from "@/components/Hero";
import EventCard from "@/components/EventCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

const HomePage = () => {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchFeaturedEvents();
  }, []);

  const fetchFeaturedEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true })
        .limit(3);

      if (error) throw error;
      setFeaturedEvents(data || []);
    } catch (error:any) {
      toast({
        variant: "destructive",
        title: "Error loading events",
        description: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedNavbar />
      <Hero />

      {/* Featured Events Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Featured Events</h2>
            <p className="mt-2 text-muted-foreground">Don't miss out on these exciting upcoming events</p>
          </div>
          <Link to="/events">
            <Button variant="outline">View All Events</Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredEvents.map((event) => (
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
      </section>

      {/* Categories Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">Event Categories</h2>
          <div className="grid gap-6 md:grid-cols-4">
            {["Technical", "Cultural", "Sports", "Workshops"].map((category) => (
              <Link key={category} to={`/events?category=${category}`}>
                <div className="rounded-lg border bg-card p-6 text-center transition-all hover:shadow-lg hover:scale-105 cursor-pointer">
                  <h3 className="text-xl font-semibold">{category}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 CampusEvents. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
