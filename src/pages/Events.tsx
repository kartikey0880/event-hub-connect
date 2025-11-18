import Navbar from "@/components/Navbar";
import EventCard from "@/components/EventCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useState } from "react";

const Events = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const allEvents = [
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
    {
      id: "4",
      title: "AI & Machine Learning Workshop",
      description: "Hands-on workshop covering fundamentals of AI, ML algorithms, and practical applications with industry experts.",
      date: "March 18, 2024",
      location: "Computer Lab A",
      category: "Workshop",
      attendees: 100,
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    },
    {
      id: "5",
      title: "Annual Music Concert",
      description: "Live performances by talented student bands and guest artists. An evening of melody, rhythm, and pure entertainment.",
      date: "March 22, 2024",
      location: "Open Air Theatre",
      category: "Cultural",
      attendees: 400,
      image: "https://images.unsplash.com/photo-1501612780327-45045538702b?w=800&q=80",
    },
    {
      id: "6",
      title: "Hackathon 2024",
      description: "24-hour coding marathon to build innovative solutions. Prizes, mentorship, and opportunities to showcase your skills.",
      date: "March 28, 2024",
      location: "Innovation Center",
      category: "Technical",
      attendees: 150,
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
    },
  ];

  const filteredEvents = allEvents.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || event.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold">All Events</h1>
          <p className="text-muted-foreground">Explore all upcoming campus events</p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Technical">Technical</SelectItem>
              <SelectItem value="Cultural">Cultural</SelectItem>
              <SelectItem value="Sports">Sports</SelectItem>
              <SelectItem value="Workshop">Workshops</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Events Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">No events found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
