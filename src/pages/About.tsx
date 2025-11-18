import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users, Trophy, Target } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold">About CampusEvents</h1>
            <p className="text-lg text-muted-foreground">
              Your one-stop platform for discovering and managing college events
            </p>
          </div>

          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold">Our Mission</h2>
            <p className="leading-relaxed text-muted-foreground">
              CampusEvents is dedicated to creating a vibrant campus community by connecting students with exciting events, workshops, and activities. We believe that college life extends beyond academics, and our platform makes it easy for students to discover, register for, and participate in events that align with their interests and passions.
            </p>
          </div>

          <div className="mb-12 grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                <Calendar className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">Easy Discovery</h3>
                <p className="text-muted-foreground">
                  Browse and discover events across all categories with powerful search and filtering
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                <Users className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">Community Building</h3>
                <p className="text-muted-foreground">
                  Connect with like-minded students and build lasting relationships through shared interests
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                <Trophy className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">Skill Development</h3>
                <p className="text-muted-foreground">
                  Participate in workshops and technical events to enhance your skills and knowledge
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                <Target className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">Goal Achievement</h3>
                <p className="text-muted-foreground">
                  Track your event participation and build a portfolio of experiences
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-lg bg-primary p-8 text-primary-foreground">
            <h2 className="mb-4 text-2xl font-semibold">Join Us Today</h2>
            <p className="mb-6">
              Be part of a thriving community of students who are making the most of their college experience. Sign up now to never miss an event!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
