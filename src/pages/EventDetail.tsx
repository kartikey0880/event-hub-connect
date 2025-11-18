import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock event data - will be replaced with actual data from database
  const event = {
    id: id || "1",
    title: "Tech Summit 2024",
    description: "Join us for the most anticipated technology conference of the year! Tech Summit 2024 brings together industry leaders, innovative startups, and tech enthusiasts for a day of learning, networking, and inspiration.",
    fullDescription: "This comprehensive event features keynote speeches from Fortune 500 CTOs, hands-on workshops on emerging technologies, panel discussions on the future of tech, and ample networking opportunities. Whether you're a student, professional, or entrepreneur, this summit offers valuable insights into the latest trends in AI, blockchain, cloud computing, and more.",
    date: "March 15, 2024",
    time: "9:00 AM - 5:00 PM",
    location: "Main Auditorium, Block A",
    category: "Technical",
    attendees: 250,
    maxCapacity: 300,
    organizer: "Computer Science Department",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80",
  };

  const handleRegister = () => {
    // Will be implemented with authentication
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="relative h-[400px] w-full overflow-hidden">
        <img
          src={event.image}
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
                <div className="font-medium">{event.attendees} / {event.maxCapacity}</div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">About This Event</h2>
            <p className="leading-relaxed text-muted-foreground">{event.fullDescription}</p>
          </div>

          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Organized By</h2>
            <p className="text-muted-foreground">{event.organizer}</p>
          </div>

          <div className="sticky bottom-0 border-t bg-background py-4">
            <Button size="lg" className="w-full md:w-auto" onClick={handleRegister}>
              Register for Event
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
