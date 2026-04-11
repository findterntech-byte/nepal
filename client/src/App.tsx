import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import Home from "@/pages/home";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import Articles from "@/pages/articles";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Profile from "@/pages/profile";
import Settings from "@/pages/settings";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminSliders from "@/pages/admin-sliders";
import SliderCardPage from "@/pages/slider-card";
import SliderCardOnlyPage from "@/pages/slider-card-only";
import SellerDashboard from "@/pages/seller-dashboard";
import PostAd from "@/pages/post-ad";
import SubcategoryPage from "@/pages/subcategory";
import CategoryPage from "@/pages/category";
import NotFound from "@/pages/not-found";
import SearchPage from "@/pages/search";
import TuitionPrivateClasses from "@/pages/tuition-private-classes";
import TuitionClassDetail from "@/pages/tuition-class-detail"; // Dedicated tuition page
import CategoryItemDetail from "@/pages/category-item-detail"; // Generic category-item detail page
import DanceKarateGymYoga from "@/pages/dance-karate-gym-yoga";
import LanguageClasses from "@/pages/language-classes";
import ServiceDetails from "@/pages/service-details";
import WishlistPage from "@/pages/wishlist";
import SkilledLabourPage from "@/pages/skilled-labour";
import SkilledLabourDetailPage from "@/pages/skilled-labour-detail";
import TermsAndConditions from "@/pages/terms-and-conditions";
import PrivacyPolicy from "@/pages/privacy-policy";
import ForgotPassword from "@/pages/forgot-password";
import ResetPassword from "@/pages/reset-password";

import ProfessionalServicesPage from "@/pages/professional-services";
import LaborWorkerServicesPage from "@/pages/labor-worker-services";
import EngineeringITServicesPage from "@/pages/engineering-it-services";
import LegalBankingServicesPage from "@/pages/legal-banking-services";
import InsuranceServicesPage from "@/pages/insurance-services";
import NGOSocialServicesPage from "@/pages/ngo-social-services";
import AgentsAgenciesPage from "@/pages/agents-agencies";

import ToursTravelsPage from "@/pages/tours-travels";
import HotelsResortsPage from "@/pages/hotels-resorts";
import EventTicketBookingPage from "@/pages/event-ticket-booking";
import PetCarePetFoodPage from "@/pages/pet-care-pet-food";
import AgricultureSeedsFarmingPage from "@/pages/agriculture-seeds-farming";
import SalesMarketingPage from "@/pages/sales-marketing";
import CourierCargoPage from "@/pages/courier-cargo";
import NewsMediaPage from "@/pages/news-media";

import ToursTravelsForm from "@/components/tours-travels-form";
import HotelsResortsForm from "@/components/hotels-resorts-form";
import EventTicketBookingForm from "@/components/event-ticket-booking-form";
import PetCarePetFoodForm from "@/components/pet-care-pet-food-form";
import AgricultureSeedsFarmingForm from "@/components/agriculture-seeds-farming-form";
import SalesMarketingForm from "@/components/sales-marketing-form";
import CourierCargoForm from "@/components/courier-cargo-form";
import NewsMediaForm from "@/components/news-media-form";

import FloatingContact from "@/components/floating-contact";

import TuitionPrivateClassesPage from "./pages/tuition-private-classes-page";
import ListingDetailPage from "./pages/listing-detail-page";

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/skilled-labour" component={SkilledLabourPage} />
      <Route path="/skilled-labour/:profileId" component={SkilledLabourDetailPage} />
      <Route path="/service-details/:id" component={ServiceDetails} />
      <Route path="/category/:slug" component={CategoryPage} />
      <Route path="/category/:categorySlug/subcategory/:subcategorySlug" component={SubcategoryPage} />
      <Route path="/subcategory/:name" component={SubcategoryPage} />
      <Route path="/tuition-private-classes/:id" component={TuitionClassDetail} /> {/* Route for tuition class detail (legacy/specific) */}
      <Route path="/contact" component={Contact} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/profile" component={Profile} />
      <Route path="/settings" component={Settings} />
      <Route path="/admin/sliders" component={AdminSliders} />
      <Route path="/slider-card" component={SliderCardPage} />
      <Route path="/slider-card-only" component={SliderCardOnlyPage} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/seller-dashboard" component={SellerDashboard} />
      <Route path="/post-ad" component={PostAd} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/search" component={SearchPage} />
      <Route path="/wishlist" component={WishlistPage} />
      <Route path="/articles" component={Articles} />
      <Route path="/about" component={About} />
      <Route path="/tuition-private-classes" component={TuitionPrivateClasses} />
      {/* Generic listing detail route: /listing/:type/:id - type should match config e.g. tuition-private-classes, cars-bikes */}
      <Route path="/listing/:type/:id" component={ListingDetailPage} />
      {/* kept for backward compatibility */}
      {/* <Route path="/category/:categorySlug/subcategory/TuitionPrivatClasses" component={TuitionPrivateClassesPage} /> */}
      <Route path="/dance-karate-gym-yoga" component={DanceKarateGymYoga} />
      <Route path="/language-classes" component={LanguageClasses} />
      <Route path="/terms-and-conditions" component={TermsAndConditions} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />

      <Route path="/professional-services" component={ProfessionalServicesPage} />
      <Route path="/labor-worker-services" component={LaborWorkerServicesPage} />
      <Route path="/engineering-it-services" component={EngineeringITServicesPage} />
      <Route path="/legal-banking-services" component={LegalBankingServicesPage} />
      <Route path="/insurance-services" component={InsuranceServicesPage} />
      <Route path="/ngo-social-services" component={NGOSocialServicesPage} />
      <Route path="/agents-agencies" component={AgentsAgenciesPage} />

      <Route path="/tours-travels" component={ToursTravelsPage} />
      <Route path="/hotels-resorts" component={HotelsResortsPage} />
      <Route path="/event-ticket-booking" component={EventTicketBookingPage} />
      <Route path="/pet-care-pet-food" component={PetCarePetFoodPage} />
      <Route path="/agriculture-seeds-farming" component={AgricultureSeedsFarmingPage} />
      <Route path="/sales-marketing" component={SalesMarketingPage} />
      <Route path="/courier-cargo" component={CourierCargoPage} />
      <Route path="/news-media" component={NewsMediaPage} />

      <Route path="/admin/tours-travels" component={ToursTravelsForm} />
      <Route path="/admin/hotels-resorts" component={HotelsResortsForm} />
      <Route path="/admin/event-ticket-booking" component={EventTicketBookingForm} />
      <Route path="/admin/pet-care-pet-food" component={PetCarePetFoodForm} />
      <Route path="/admin/agriculture-seeds-farming" component={AgricultureSeedsFarmingForm} />
      <Route path="/admin/sales-marketing" component={SalesMarketingForm} />
      <Route path="/admin/courier-cargo" component={CourierCargoForm} />
      <Route path="/admin/news-media" component={NewsMediaForm} />

      <Route path="/:categorySlug/:id" component={CategoryItemDetail} /> {/* Generic dynamic route for all categories */}
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ScrollToTop />
        <Toaster />
        <Router />
        <FloatingContact />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;