import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Home = () => {
  const featuredEvents = [
    {
      id: "1",
      title: "Tech Summit 2024",
      description: "Annual technology conference featuring industry leaders, workshops, and networking opportunities for aspiring tech professionals.",
      date: "March 15, 2024",
      location: "Main Auditorium",
      category: "Technical",
      attendees: 250,
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    },
    {
      id: "2",
      title: "Cultural Fest 2024",
      description: "Celebrate diversity through music, dance, art, and food from around the world in our biggest cultural celebration.",
      date: "March 20, 2024",
      location: "Campus Grounds",
      category: "Cultural",
      attendees: 500,
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80",
    },
    {
      id: "3",
      title: "Inter-College Sports Meet",
      description: "Compete in various sports including basketball, cricket, athletics, and more in our annual sports championship.",
      date: "March 25, 2024",
      location: "Sports Complex",
      category: "Sports",
      attendees: 300,
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
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
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">Event Categories</h2>
          <div className="grid gap-6 md:grid-cols-4">
            {["Technical", "Cultural", "Sports", "Workshops"].map((category) => (
              <div
                key={category}
                className="rounded-lg border bg-card p-6 text-center transition-all hover:shadow-md"
              >
                <h3 className="text-xl font-semibold">{category}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 CampusEvents. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
