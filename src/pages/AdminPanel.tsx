import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, TrendingUp, Activity } from "lucide-react";

interface Stats {
  totalEvents: number;
  totalRegistrations: number;
  totalUsers: number;
  eventsByCategory: { category: string; count: number }[];
  recentEvents: Array<{ title: string; date: string; attendees: number }>;
}

const AdminPanel = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalEvents: 0,
    totalRegistrations: 0,
    totalUsers: 0,
    eventsByCategory: [],
    recentEvents: [],
  });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (!roles) {
      navigate("/");
      return;
    }

    fetchStats();
  };

  const fetchStats = async () => {
    try {
      const [eventsRes, registrationsRes, profilesRes, categoriesRes, recentRes] = await Promise.all([
        supabase.from("events").select("id", { count: "exact" }),
        supabase.from("event_registrations").select("id", { count: "exact" }),
        supabase.from("profiles").select("id", { count: "exact" }),
        supabase.from("events").select("category"),
        supabase.from("events").select("title, date, current_attendees").order("created_at", { ascending: false }).limit(5),
      ]);

      const categoryCount = categoriesRes.data?.reduce((acc, event) => {
        acc[event.category] = (acc[event.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const eventsByCategory = Object.entries(categoryCount || {}).map(([category, count]) => ({
        category,
        count,
      }));

      setStats({
        totalEvents: eventsRes.count || 0,
        totalRegistrations: registrationsRes.count || 0,
        totalUsers: profilesRes.count || 0,
        eventsByCategory,
        recentEvents: recentRes.data?.map((e) => ({ title: e.title, date: e.date, attendees: e.current_attendees })) || [],
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AuthenticatedNavbar />
        <div className="container mx-auto px-4 py-8">
          <p>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedNavbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Admin Panel</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEvents}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRegistrations}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Activity</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Live</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Events by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.eventsByCategory.map(({ category, count }) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="font-medium">{category}</span>
                    <span className="text-muted-foreground">{count} events</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentEvents.map((event, idx) => (
                  <div key={idx} className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{event.date}</p>
                    </div>
                    <span className="text-sm">{event.attendees} attendees</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
