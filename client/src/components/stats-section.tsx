import { TrendingUp, Users, BarChart3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Stats } from "@/lib/types";

export default function StatsSection() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  if (isLoading) {
    return (
      <section className="bg-muted py-16" data-testid="stats-section-loading">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">Loading statistics...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="cultural-pattern py-20" data-testid="stats-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-6 py-3 rounded-full mb-6 shadow-lg">
            <TrendingUp className="w-5 h-5" />
            <span className="font-semibold" data-testid="text-stats-header">
              Discover the Power of Nepal's Leading Service Platform
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 himalayan-text" data-testid="text-stats-title">
            Where businesses gain exposure and customers find perfect services
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-stats-description">
            Join thousands of users trusting Jeevika Services for all their needs. 
            Check out our impressive growth stats!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center nepali-card p-8" data-testid="stat-page-views">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <div className="text-6xl font-bold himalayan-text mb-2">140</div>
            <div className="text-2xl font-semibold mb-2">Million</div>
            <div className="text-lg text-muted-foreground">Page Views</div>
          </div>
          <div className="text-center nepali-card p-8" data-testid="stat-new-visitors">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <Users className="w-10 h-10 text-white" />
            </div>
            <div className="text-6xl font-bold himalayan-text mb-2">+1.7</div>
            <div className="text-2xl font-semibold mb-2">Million</div>
            <div className="text-lg text-muted-foreground">New Visitors</div>
          </div>
          <div className="text-center nepali-card p-8" data-testid="stat-impressions">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
              <BarChart3 className="w-10 h-10 text-white" />
            </div>
            <div className="text-6xl font-bold himalayan-text mb-2">1.05</div>
            <div className="text-2xl font-semibold mb-2">Billion</div>
            <div className="text-lg text-muted-foreground">Impressions</div>
          </div>
        </div>
      </div>
    </section>
  );
}
