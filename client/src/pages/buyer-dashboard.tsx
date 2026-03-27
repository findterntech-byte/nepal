import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  SidebarInset
} from "@/components/ui/sidebar";
import {
  Home,
  Heart,
  Search,
  Bell,
  User,
  Building,
  MapPin,
  LogOut,
  BookmarkCheck,
  History
} from "lucide-react";
import useWishlist from "@/hooks/useWishlist";

interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  accountType?: string;
  role?: string;
}

function BuyerSidebar({ activeSection, setActiveSection }: { activeSection: string; setActiveSection: (section: string) => void }) {
  const sidebarItems = [
    { title: "Dashboard", icon: Home, key: "dashboard" },
    { title: "Search Properties", icon: Search, key: "search" },
    { title: "Favorites", icon: Heart, key: "favorites" },
    { title: "Saved Searches", icon: BookmarkCheck, key: "saved-searches" },
    { title: "View History", icon: History, key: "history" },
    { title: "Alerts", icon: Bell, key: "alerts" },
    { title: "Profile", icon: User, key: "profile" }
  ];

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center space-x-2 p-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Buyer Dashboard</h1>
            <p className="text-xs text-muted-foreground">Find Your Dream Property</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={activeSection === item.key}
                    className="w-full justify-start cursor-pointer"
                    onClick={() => setActiveSection(item.key)}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full justify-start">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                B
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">Buyer Account</span>
                <span className="text-xs text-muted-foreground">buyer@jeevika.com</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

function DashboardSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Welcome Back!</h2>
        <p className="text-muted-foreground">Here's your property search overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Favorites</CardTitle>
            <div className="text-2xl font-bold">12</div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Saved Searches</CardTitle>
            <div className="text-2xl font-bold">5</div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">New Matches</CardTitle>
            <div className="text-2xl font-bold">8</div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Alerts</CardTitle>
            <div className="text-2xl font-bold">3</div>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Property Matches</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">New properties matching your criteria will appear here</p>
        </CardContent>
      </Card>
    </div>
  );
}

function FavoritesSection() {
  const { items, removeFromWishlist } = useWishlist();

  if (!items || items.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">You have no favorites yet. Click the heart on any listing to save it here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Your Favorites</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it: any) => (
          <Card key={it.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                  {it.photo ? <img src={it.photo} alt={it.title} className="w-full h-full " /> : <MapPin className="w-6 h-6 text-gray-400" />}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold line-clamp-2">{it.title}</h3>
                  <div className="mt-3 flex items-center gap-2">
                    <a href={it.href} className="text-sm text-blue-600 underline">View</a>
                    <button className="text-sm text-red-500" onClick={() => removeFromWishlist(it.id)}>Remove</button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function BuyerDashboard() {
  const [, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setLocation("/login");
        return;
      }

      try {
        const userData = JSON.parse(storedUser);

        // Fetch fresh user data from database
        const response = await fetch(`/api/users/${userData.id}`);
        if (response.ok) {
          const freshUserData = await response.json();

          // Check account type and role
          if (freshUserData.role === "user" || (freshUserData.accountType !== "buyer" && freshUserData.role !== "admin")) {
            setLocation("/");
            return;
          }

          setUser(freshUserData);
          // Update localStorage with fresh data
          localStorage.setItem("user", JSON.stringify(freshUserData));
        } else {
          // Fallback to stored data if API fails
          if (userData.role === "user" || (userData.accountType !== "buyer" && userData.role !== "admin")) {
            setLocation("/");
            return;
          }
          setUser(userData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLocation("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setLocation("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <BuyerSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center border-b px-6 bg-card justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="-ml-1" />
              <div className="h-6 w-px bg-border" />
              <h1 className="text-lg font-semibold capitalize">{activeSection.replace('-', ' ')}</h1>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </header>

          <main className="flex-1 p-6">
            {activeSection === "dashboard" && <DashboardSection />}
            {activeSection === "favorites" && <FavoritesSection />}
            {activeSection !== "dashboard" && activeSection !== "favorites" && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">Section under development</p>
              </div>
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}