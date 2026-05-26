import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ServiceItem {
  id: string;
  title: string;
  description?: string;
  storeType: string;
  storeName: string;
  brandName?: string;
  specialization?: string;
  productCategories?: string;
  deliveryAvailable?: boolean;
  freeDelivery?: boolean;
  expressDelivery?: boolean;
  organicProducts?: boolean;
  minOrderAmount?: number;
  deliveryCharge?: number;
  city?: string;
  contactPhone: string;
  images?: string[];
}

async function fetchJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

export default function GroceryDailyEssentialsPage() {
  const [, setLocation] = useLocation();
  const [storeType, setStoreType] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set("limit", "100");
    if (storeType) params.set("storeType", storeType);
    return params.toString();
  }, [storeType]);

  const { data, isLoading, refetch } = useQuery<ServiceItem[]>({
    queryKey: ["grocery-daily-essentials", storeType],
    queryFn: async () => fetchJson(`/api/grocery-daily-essentials?${queryParams}`),
  });

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((item: ServiceItem) =>
      item.title?.toLowerCase().includes(q) ||
      item.storeName?.toLowerCase().includes(q) ||
      item.brandName?.toLowerCase().includes(q) ||
      item.storeType?.toLowerCase().includes(q) ||
      item.specialization?.toLowerCase().includes(q) ||
      item.city?.toLowerCase().includes(q)
    );
  }, [data, search]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Grocery & Daily Essentials</h1>
            <p className="text-sm text-muted-foreground mt-1">Find supermarkets, grocery stores, and online delivery</p>
          </div>
          <Button variant="outline" onClick={() => setLocation("/")}>Back to Home</Button>
        </div>

        <Card className="mb-6">
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
            <div className="space-y-2">
              <Label>Store Type</Label>
              <Select value={storeType} onValueChange={(v) => setStoreType(v === "all" ? "" : v)}>
                <SelectTrigger><SelectValue placeholder="All types" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="supermarket">Supermarket</SelectItem>
                  <SelectItem value="grocery_store">Grocery Store</SelectItem>
                  <SelectItem value="kirana_shop">Kirana Shop</SelectItem>
                  <SelectItem value="convenience_store">Convenience Store</SelectItem>
                  <SelectItem value="hypermarket">Hypermarket</SelectItem>
                  <SelectItem value="online_grocery">Online Grocery</SelectItem>
                  <SelectItem value="organic_store">Organic Store</SelectItem>
                  <SelectItem value="wholesaler">Wholesaler</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Search</Label>
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search store..." />
            </div>
            <div className="flex items-end">
              <Button className="w-full" onClick={() => refetch()}>Search</Button>
            </div>
          </CardContent>
        </Card>

        {isLoading ? <div className="text-muted-foreground">Loading...</div> : (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">Total: {filteredData.length}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredData.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-all cursor-pointer" onClick={() => setLocation(`/service-details/${item.id}`)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                        {item.images && item.images[0] ? (
                          <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <span className="text-orange-600 font-bold text-lg">{item.storeName?.[0] || "G"}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base truncate">{item.title}</CardTitle>
                        <p className="text-sm text-muted-foreground truncate">{item.storeName}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs">{item.storeType}</Badge>
                      {item.deliveryAvailable && <Badge className="bg-green-600 text-xs">Delivery</Badge>}
                      {item.freeDelivery && <Badge className="bg-blue-600 text-xs">Free Delivery</Badge>}
                      {item.expressDelivery && <Badge className="bg-purple-600 text-xs">Express</Badge>}
                      {item.organicProducts && <Badge className="bg-green-600 text-xs">Organic</Badge>}
                    </div>
                    {item.brandName && <div className="text-xs text-muted-foreground">Brand: {item.brandName}</div>}
                    {item.specialization && <div className="text-xs text-muted-foreground">Special: {item.specialization}</div>}
                    {item.productCategories && <div className="text-xs text-muted-foreground line-clamp-1">Products: {item.productCategories}</div>}
                    {item.minOrderAmount && <div className="text-xs">Min Order: रू {item.minOrderAmount}</div>}
                    {item.city && <div className="text-xs text-muted-foreground">📍 {item.city}</div>}
                    {item.contactPhone && <div className="text-xs">📞 {item.contactPhone}</div>}
                  </CardContent>
                </Card>
              ))}
            </div>
            {filteredData.length === 0 && <div className="text-center text-muted-foreground py-8">No stores found.</div>}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}