import { Button } from "./ui/button";
import { Calendar, Users, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground">
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]" />
      <div className="container relative mx-auto px-4 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Discover Campus Events That Matter
          </h1>
          <p className="mb-8 text-lg text-primary-foreground/90 md:text-xl">
            Join thousands of students experiencing the best technical, cultural, and sports events. Never miss what's happening on campus.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link to="/events">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Explore Events
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground/20 text-primary-foreground bg-primary-foreground/10 ">
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-2">
            <Calendar className="h-10 w-10 text-accent" />
            <div className="text-3xl font-bold">500+</div>
            <div className="text-sm text-primary-foreground/80">Events Hosted</div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Users className="h-10 w-10 text-accent" />
            <div className="text-3xl font-bold">10K+</div>
            <div className="text-sm text-primary-foreground/80">Active Students</div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Trophy className="h-10 w-10 text-accent" />
            <div className="text-3xl font-bold">50+</div>
            <div className="text-sm text-primary-foreground/80">Clubs & Societies</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
