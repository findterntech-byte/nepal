import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Edit,
  Trash2,
  Settings,
  BarChart3,
  Users,
  Building,
  MapPin,
  FileText,
  Home,
  Shield,
  Image,
  Bookmark,
  Eye,
  Check,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  X,
  Pencil,
  Trash,
  Video,
  Globe
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { CategoryDialog } from "@/components/category-dialog";
import { SubcategoryDialog } from "@/components/subcategory-dialog";
import { HostelPgForm } from "@/components/hostel-pg-form";
import { ConstructionMaterialsForm } from "@/components/construction-materials-form";
import { RentalListingsForm } from "@/components/rental-listings-form";
import { OfficeSpacesForm } from "@/components/office-spaces-form";
import { IndustrialLandForm } from "@/components/industrial-land-form";
import { PropertyDealsForm } from "@/components/property-deals-form";
import { CommercialPropertiesForm } from '@/components/commercial-properties-form';
import { CarsBikesForm } from "@/components/cars-bikes-form";
import { HeavyEquipmentForm } from "@/components/heavy-equipment-form";
import { ShowroomsForm } from "@/components/showrooms-form";
import { SecondHandCarsBikesForm } from "@/components/second-hand-cars-bikes-form";
import CarBikeRentalsForm from "@/components/car-bike-rentals-form";
import {TransportationMovingServicesForm} from "@/components/transportation-moving-services-form";
import VehicleLicenseClassesForm from "@/components/vehicle-license-classes-form";
import ElectronicsGadgetsForm from "@/components/electronics-gadgets-form";
import PhonesTabletsAccessoriesForm from "@/components/phones-tablets-accessories-form";
import SecondHandPhonesTabletsAccessoriesForm from "@/components/second-hand-phones-tablets-accessories-form";
import ComputerMobileLaptopRepairServicesForm from "@/components/computer-mobile-laptop-repair-services-form";
import FurnitureInteriorDecorForm from "@/components/furniture-interior-decor-form";
import HouseholdServicesForm from "@/components/household-services-form";
import { EventDecorationServicesForm } from "@/components/event-decoration-services-form";
import FashionBeautyProductsForm from "@/components/fashion-beauty-products-form";
import SareeClothingShoppingForm from "@/components/saree-clothing-shopping-form"; // Assuming this component exists
import PharmacyMedicalStoresForm from "@/components/pharmacy-medical-stores-form";
import EbooksOnlineCoursesForm from "@/components/ebooks-online-courses-form";
import CricketSportsTrainingForm from "@/components/cricket-sports-training-form";
import JewelryAccessoriesForm from "@/components/jewelry-accessories-form";
import HealthWellnessServicesForm from "@/components/health-wellness-services-form";
import TuitionPrivateClassesForm from "@/components/tuition-private-classes-form";
import DanceKarateGymYogaForm from "@/components/dance-karate-gym-yoga-form";
import SchoolsCollegesCoachingForm from "@/components/schools-colleges-coaching-form";
import LanguageClassesForm from "@/components/language-classes-form";
import AcademiesMusicArtsSportsForm from "@/components/academies-music-arts-sports-form";
import SkillTrainingCertificationForm from "@/components/skill-training-certification-form";
import { useUser } from '@/hooks/use-user';
import TelecommunicationServicesForm from "@/components/telecommunication-services-form";
import ServiceCentreWarrantyForm from "@/components/service-centre-warranty-form";
import CyberCafeInternetServicesForm from "@/components/cyber-cafe-internet-services-form";
import { SliderForm } from "@/components/slider-form";
import BlogForm from "@/components/blog-form";
import { VideosForm } from '@/components/videos-form';
import EducationalConsultancyStudyAbroadForm from "@/components/educational-consultancy-study-abroad-form";
import ProfessionalServicesForm from "@/components/professional-services-form";
import ProProfileForm from "@/components/pro-profile-form";
import LaborWorkerServicesForm from "@/components/labor-worker-services-form";
import EngineeringITServicesForm from "@/components/engineering-it-services-form";
import LegalBankingServicesForm from "@/components/legal-banking-services-form";
import InsuranceServicesForm from "@/components/insurance-services-form";
import NGOSocialServicesForm from "@/components/ngo-social-services-form";
import AgentsAgenciesForm from "@/components/agents-agencies-form";

// Educational Consultancy - Study Abroad Section Component
function EducationalConsultancyStudyAbroadSection() {
  return <EducationalConsultancyStudyAbroadForm />;
}

function EventDecorationServicesSection() {
  return <EventDecorationServicesForm />;
}

// Fashion & Beauty Products Section Component
function FashionBeautyProductsSection() {

  const [products, setProducts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [viewingProduct, setViewingProduct] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/fashion-beauty-products');
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching fashion & beauty products:', error);
      setProducts([]);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingProduct(null);
    fetchProducts();
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleViewDetails = (product: any) => {
    setViewingProduct(product);
    setShowDetailsDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await fetch(`/api/admin/fashion-beauty-products/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/fashion-beauty-products/${id}/toggle-active`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/fashion-beauty-products/${id}/toggle-featured`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Fashion & Beauty Products</h2>
          <p className="text-muted-foreground">Manage fashion items, clothing, accessories, and beauty products</p>
        </div>
        <Button onClick={() => {
          setEditingProduct(null);
          setShowForm(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={(open) => {
        setShowForm(open);
        if (!open) setEditingProduct(null);
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Fashion & Beauty Product' : 'Add New Fashion & Beauty Product'}</DialogTitle>
            <DialogDescription>Fill in the details to {editingProduct ? 'update' : 'create'} a fashion or beauty product listing</DialogDescription>
          </DialogHeader>
          <FashionBeautyProductsForm onSuccess={handleSuccess} editingProduct={editingProduct} />
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{viewingProduct?.title}</DialogTitle>
            <DialogDescription>Complete product details</DialogDescription>
          </DialogHeader>
          {viewingProduct && (
            <div className="space-y-6">
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary">{viewingProduct.category}</Badge>
                <Badge variant="outline">{viewingProduct.listingType}</Badge>
                {viewingProduct.condition && <Badge variant="outline">{viewingProduct.condition}</Badge>}
                {viewingProduct.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-lg font-bold text-primary">₹{Number(viewingProduct.price).toLocaleString('en-IN')}</p>
                </div>
                {viewingProduct.mrp && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">MRP</p>
                    <p className="text-lg font-bold line-through">₹{Number(viewingProduct.mrp).toLocaleString('en-IN')}</p>
                  </div>
                )}
                {viewingProduct.discountPercentage && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Discount</p>
                    <p className="text-lg font-bold text-green-600">{viewingProduct.discountPercentage}%</p>
                  </div>
                )}
                {viewingProduct.stockQuantity && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Stock</p>
                    <p className="text-lg font-bold">{viewingProduct.stockQuantity}</p>
                  </div>
                )}
              </div>

              {viewingProduct.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{viewingProduct.description}</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Product Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {viewingProduct.brand && (
                    <div>
                      <span className="font-medium">Brand:</span>
                      <span className="ml-2 text-muted-foreground">{viewingProduct.brand}</span>
                    </div>
                  )}
                  {viewingProduct.color && (
                    <div>
                      <span className="font-medium">Color:</span>
                      <span className="ml-2 text-muted-foreground">{viewingProduct.color}</span>
                    </div>
                  )}
                  {viewingProduct.size && (
                    <div>
                      <span className="font-medium">Size:</span>
                      <span className="ml-2 text-muted-foreground">{viewingProduct.size}</span>
                    </div>
                  )}
                  {viewingProduct.material && (
                    <div>
                      <span className="font-medium">Material:</span>
                      <span className="ml-2 text-muted-foreground">{viewingProduct.material}</span>
                    </div>
                  )}
                  {viewingProduct.gender && (
                    <div>
                      <span className="font-medium">Gender:</span>
                      <span className="ml-2 text-muted-foreground capitalize">{viewingProduct.gender}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {viewingProduct.isOriginal && <Badge variant="outline">Original</Badge>}
                  {viewingProduct.brandAuthorized && <Badge variant="outline">Brand Authorized</Badge>}
                  {viewingProduct.customizationAvailable && <Badge variant="outline">Customizable</Badge>}
                  {viewingProduct.crueltyFree && <Badge variant="outline">Cruelty Free</Badge>}
                  {viewingProduct.vegan && <Badge variant="outline">Vegan</Badge>}
                  {viewingProduct.parabenFree && <Badge variant="outline">Paraben Free</Badge>}
                  {viewingProduct.exchangeAvailable && <Badge variant="outline">Exchange Available</Badge>}
                  {viewingProduct.codAvailable && <Badge variant="outline">COD Available</Badge>}
                </div>
              </div>

              {viewingProduct.images && viewingProduct.images.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Product Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {viewingProduct.images.map((img: string, idx: number) => (
                      <img key={idx} src={img} alt={`Product ${idx + 1}`} className="w-full h-32  rounded-lg border-2 border-pink-200" />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Contact Information
                </h3>
                <div className="space-y-1 text-sm">
                  {viewingProduct.contactPerson && <p><span className="font-medium">Contact Person:</span> {viewingProduct.contactPerson}</p>}
                  <p><span className="font-medium">Phone:</span> {viewingProduct.contactPhone}</p>
                  {viewingProduct.contactEmail&& <p><span className="font-medium">Email:</span> {viewingProduct.contactEmail}</p>}
                </div>
              </div>

              {(viewingProduct.city || viewingProduct.shopName) && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location & Shop
                  </h3>
                  <div className="space-y-1 text-sm">
                    {viewingProduct.shopName && <p><span className="font-medium">Shop:</span> {viewingProduct.shopName}</p>}
                    {viewingProduct.city && <p><span className="font-medium">City:</span> {viewingProduct.city}</p>}
                    {viewingProduct.areaName && <p><span className="font-medium">Area:</span> {viewingProduct.areaName}</p>}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t text-sm text-muted-foreground">
                <p>Created: {new Date(viewingProduct.createdAt).toLocaleString()}</p>
                <p>Last Updated: {new Date(viewingProduct.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(products) && products.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{product.title}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{product.category}</Badge>
                    <Badge variant="outline">{product.listingType}</Badge>
                    {product.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleViewDetails(product)}
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(product)}
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(product.id)}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {product.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg text-primary">₹{Number(product.price).toLocaleString('en-IN')}</span>
                  <Badge variant={product.isActive ? 'default' : 'secondary'}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {product.brand && (
                  <div className="text-sm">
                    <span className="font-medium">Brand: </span>
                    <span className="text-muted-foreground">{product.brand}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex gap-2">
              <Button
                variant={product.isActive ? "outline" : "default"}
                size="sm"
                className="flex-1"
                onClick={() => toggleActive(product.id)}
              >
                {product.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant={product.isFeatured ? "secondary" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => toggleFeatured(product.id)}
              >
                {product.isFeatured ? "Unfeature" : "Feature"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {(!products || products.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first fashion or beauty product</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Saree/Clothing/Shopping Section Component
function SareeClothingShoppingSection() {
  const [products, setProducts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [viewingProduct, setViewingProduct] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/saree-clothing-shopping');
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching saree/clothing/shopping products:', error);
      setProducts([]);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingProduct(null);
    fetchProducts();
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleViewDetails = (product: any) => {
    setViewingProduct(product);
    setShowDetailsDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await fetch(`/api/admin/saree-clothing-shopping/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/saree-clothing-shopping/${id}/toggle-active`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/saree-clothing-shopping/${id}/toggle-featured`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Saree, Clothing & Shopping</h2>
          <p className="text-muted-foreground">Manage saree, clothing, and shopping products</p>
        </div>
        <Button onClick={() => {
          setEditingProduct(null);
          setShowForm(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={(open) => {
        setShowForm(open);
        if (!open) setEditingProduct(null);
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>Fill in the details to {editingProduct ? 'update' : 'create'} a product listing</DialogDescription>
          </DialogHeader>
          <SareeClothingShoppingForm
            onSuccess={handleSuccess}
            editingItem={editingProduct}
            open={showForm}
            onOpenChange={(open) => {
              setShowForm(open);
              if (!open) setEditingProduct(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{viewingProduct?.title}</DialogTitle>
            <DialogDescription>Complete product details</DialogDescription>
          </DialogHeader>
          {viewingProduct && (
            <div className="space-y-6">
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary">{viewingProduct.category}</Badge>
                <Badge variant="outline">{viewingProduct.listingType}</Badge>
                {viewingProduct.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-lg font-bold text-primary">₹{Number(viewingProduct.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                {viewingProduct.mrp && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">MRP</p>
                    <p className="text-lg font-bold">₹{Number(viewingProduct.mrp).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                )}
                {viewingProduct.discountPercentage && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Discount</p>
                    <p className="text-lg font-bold text-green-600">{viewingProduct.discountPercentage}%</p>
                  </div>
                )}
                {viewingProduct.stockQuantity && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Stock</p>
                    <p className="text-lg font-bold">{viewingProduct.stockQuantity}</p>
                  </div>
                )}
              </div>

              {viewingProduct.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{viewingProduct.description}</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Product Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {viewingProduct.brand && (
                    <div>
                      <span className="font-medium">Brand:</span>
                      <span className="ml-2 text-muted-foreground">{viewingProduct.brand}</span>
                    </div>
                  )}
                  {viewingProduct.color && (
                    <div>
                      <span className="font-medium">Color:</span>
                      <span className="ml-2 text-muted-foreground">{viewingProduct.color}</span>
                    </div>
                  )}
                  {viewingProduct.size && (
                    <div>
                      <span className="font-medium">Size:</span>
                      <span className="ml-2 text-muted-foreground">{viewingProduct.size}</span>
                    </div>
                  )}
                  {viewingProduct.material && (
                    <div>
                      <span className="font-medium">Material:</span>
                      <span className="ml-2 text-muted-foreground">{viewingProduct.material}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {viewingProduct.isOriginal && <Badge variant="outline">Original</Badge>}
                  {viewingProduct.brandAuthorized && <Badge variant="outline">Brand Authorized</Badge>}
                  {viewingProduct.customizationAvailable && <Badge variant="outline">Customizable</Badge>}
                  {viewingProduct.crueltyFree && <Badge variant="outline">Cruelty Free</Badge>}
                  {viewingProduct.vegan && <Badge variant="outline">Vegan</Badge>}
                  {viewingProduct.parabenFree && <Badge variant="outline">Paraben Free</Badge>}
                  {viewingProduct.exchangeAvailable && <Badge variant="outline">Exchange Available</Badge>}
                  {viewingProduct.codAvailable && <Badge variant="outline">COD Available</Badge>}
                </div>
              </div>

              {viewingProduct.images && viewingProduct.images.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Product Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {viewingProduct.images.map((img: string, idx: number) => (
                      <img key={idx} src={img} alt={`Product ${idx + 1}`} className="w-full h-32  rounded-lg border-2 border-pink-200" />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Contact Information
                </h3>
                <div className="space-y-1 text-sm">
                  {viewingProduct.contactPerson && <p><span className="font-medium">Contact Person:</span> {viewingProduct.contactPerson}</p>}
                  <p><span className="font-medium">Phone:</span> {viewingProduct.contactPhone}</p>
                  {viewingProduct.contactEmail && <p><span className="font-medium">Email:</span> {viewingProduct.contactEmail}</p>}
                </div>
              </div>

              {(viewingProduct.city || viewingProduct.areaName) && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </h3>
                  <div className="space-y-1 text-sm">
                    {viewingProduct.areaName && <p><span className="font-medium">Area:</span> {viewingProduct.areaName}</p>}
                    {viewingProduct.city && <p><span className="font-medium">City:</span> {viewingProduct.city}</p>}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t text-sm text-muted-foreground">
                <p>Created: {new Date(viewingProduct.createdAt).toLocaleString()}</p>
                <p>Last Updated: {new Date(viewingProduct.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(products) && products.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{product.title}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{product.category}</Badge>
                    <Badge variant="outline">{product.listingType}</Badge>
                    {product.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleViewDetails(product)}
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(product)}
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(product.id)}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {product.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg text-primary">₹{Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <Badge variant={product.isActive ? 'default' : 'secondary'}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {product.brand && (
                  <div className="text-sm">
                    <span className="font-medium">Brand: </span>
                    <span className="text-muted-foreground">{product.brand}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex gap-2">
              <Button
                variant={product.isActive ? "outline" : "default"}
                size="sm"
                className="flex-1"
                onClick={() => toggleActive(product.id)}
              >
                {product.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant={product.isFeatured ? "secondary" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => toggleFeatured(product.id)}
              >
                {product.isFeatured ? "Unfeature" : "Feature"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {(!products || products.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first saree, clothing, or shopping product</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Pharmacy & Medical Stores Section Component
function PharmacyMedicalStoresSection() {
  const [stores, setStores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStore, setEditingStore] = useState<any>(null);
  const [viewingStore, setViewingStore] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/pharmacy-medical-stores');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched pharmacy stores:', data);
      setStores(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching pharmacy & medical stores:', error);
      setStores([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingStore(null);
    fetchStores();
  };

  const handleEdit = (store: any) =>{
    setEditingStore(store);
    setShowForm(true);
  };

  const handleViewDetails = (store: any) => {
    setViewingStore(store);
    setShowDetailsDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this store?')) return;
    try {
      const response = await fetch(`/api/admin/pharmacy-medical-stores/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchStores();
      }
    } catch (error) {
      console.error('Error deleting store:', error);
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/pharmacy-medical-stores/${id}/toggle-active`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchStores();
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/pharmacy-medical-stores/${id}/toggle-featured`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchStores();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Pharmacy & Medical Stores</h2>
          <p className="text-muted-foreground">Manage pharmacy and medical store listings</p>
        </div>
      </div>

      <PharmacyMedicalStoresForm
        onSuccess={handleSuccess}
        editingStore={editingStore}
        onCancel={() => setEditingStore(null)}
      />

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{viewingStore?.title || viewingStore?.storeName}</DialogTitle>
            <DialogDescription>Complete store details</DialogDescription>
          </DialogHeader>
          {viewingStore && (
            <div className="space-y-6">
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary">{viewingStore.listingType || 'N/A'}</Badge>
                {viewingStore.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                <Badge variant={viewingStore.isActive ? 'default' : 'secondary'}>
                  {viewingStore.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              {viewingStore.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{viewingStore.description}</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Store Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {viewingStore.pharmacyName && (
                    <div>
                      <span className="font-medium">Pharmacy Name:</span>
                      <span className="ml-2 text-muted-foreground">{viewingStore.pharmacyName}</span>
                    </div>
                  )}
                  {viewingStore.licenseNumber && (
                    <div>
                      <span className="font-medium">License Number:</span>
                      <span className="ml-2 text-muted-foreground">{viewingStore.licenseNumber}</span>
                    </div>
                  )}
                  {viewingStore.ownerName && (
                    <div>
                      <span className="font-medium">Owner:</span>
                      <span className="ml-2 text-muted-foreground">{viewingStore.ownerName}</span>
                    </div>
                  )}
                  {viewingStore.pharmacistName && (
                    <div>
                      <span className="font-medium">Pharmacist:</span>
                      <span className="ml-2 text-muted-foreground">{viewingStore.pharmacistName}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Services</h3>
                <div className="flex flex-wrap gap-2">
                  {viewingStore.prescriptionMedicines && <Badge variant="outline">Prescription Medicines</Badge>}
                  {viewingStore.otcMedicines && <Badge variant="outline">OTC Medicines</Badge>}
                  {viewingStore.ayurvedicProducts && <Badge variant="outline">Ayurvedic</Badge>}
                  {viewingStore.homeopathicMedicines && <Badge variant="outline">Homeopathic</Badge>}
                  {viewingStore.surgicalItems && <Badge variant="outline">Surgical Items</Badge>}
                  {viewingStore.medicalDevices && <Badge variant="outline">Medical Devices</Badge>}
                </div>
              </div>

              {(viewingStore.homeDelivery || viewingStore.sameDayDelivery) && (
                <div>
                  <h3 className="font-semibold mb-2">Delivery Options</h3>
                  <div className="flex flex-wrap gap-2">
                    {viewingStore.homeDelivery && <Badge variant="default">Home Delivery</Badge>}
                    {viewingStore.sameDayDelivery && <Badge variant="default">Same Day Delivery</Badge>}
                    {viewingStore.deliveryCharges && (
                      <Badge variant="outline">Delivery: ₹{viewingStore.deliveryCharges}</Badge>
                    )}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Contact Person:</span>
                    <span className="ml-2 text-muted-foreground">{viewingStore.contactPerson}</span>
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span>
                    <span className="ml-2 text-muted-foreground">{viewingStore.contactPhone}</span>
                  </div>
                  {viewingStore.contactEmail && (
                    <div>
                      <span className="font-medium">Email:</span>
                      <span className="ml-2 text-muted-foreground">{viewingStore.contactEmail}</span>
                    </div>
                  )}
                  {viewingStore.whatsappNumber && (
                    <div>
                      <span className="font-medium">WhatsApp:</span>
                      <span className="ml-2 text-muted-foreground">{viewingStore.whatsappNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {viewingStore.fullAddress && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Address:</span> {viewingStore.fullAddress}</p>
                    {viewingStore.areaName && <p><span className="font-medium">Area:</span> {viewingStore.areaName}</p>}
                    {viewingStore.city && <p><span className="font-medium">City:</span> {viewingStore.city}</p>}
                    {viewingStore.pincode && <p><span className="font-medium">Pincode:</span> {viewingStore.pincode}</p>}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t text-sm text-muted-foreground">
                <p>Created: {new Date(viewingStore.createdAt).toLocaleString()}</p>
                <p>Last Updated: {new Date(viewingStore.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="text-center py-8">Loading stores...</div>
      ) : (
        <>
          {stores.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {stores.map((store) => (
                <Card key={store.id} className="group hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{store.title || store.storeName}</CardTitle>
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant="secondary">{store.listingType || 'N/A'}</Badge>
                          {store.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleViewDetails(store)}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(store)}
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDelete(store.id)}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {store.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{store.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <Badge variant={store.isActive ? 'default' : 'secondary'}>
                          {store.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      {store.ownerName && (
                        <div className="text-sm">
                          <span className="font-medium">Owner: </span>
                          <span className="text-muted-foreground">{store.ownerName}</span>
                        </div>
                      )}
                      {store.contactPhone && (
                        <div className="text-sm">
                          <span className="font-medium">Phone: </span>
                          <span className="text-muted-foreground">{store.contactPhone}</span>
                        </div>
                      )}
                      {(store.city || store.areaName) && (
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {[store.areaName, store.city].filter(Boolean).join(", ")}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 flex gap-2">
                    <Button
                      variant={store.isActive ? "outline" : "default"}
                      size="sm"
                      className="flex-1"
                      onClick={() => toggleActive(store.id)}
                    >
                      {store.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      variant={store.isFeatured ? "secondary" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={() => toggleFeatured(store.id)}
                    >
                      {store.isFeatured ? "Unfeature" : "Feature"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// E-Books & Online Courses Section Component
function EbooksOnlineCoursesSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">E-Books & Online Courses</h2>
          <p className="text-muted-foreground">Manage digital educational content and online learning resources</p>
        </div>
      </div>
      <EbooksOnlineCoursesForm />
    </div>
  );
}

// Cricket Sports Training Section Component
function CricketSportsTrainingSection() {
  const [training, setTraining] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTraining, setEditingTraining] = useState(null);

  useEffect(() => {
    fetchTraining();
  }, []);

  const fetchTraining = async () => {
    try {
      const response = await fetch('/api/admin/cricket-sports-training');
      const data = await response.json();
      setTraining(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching cricket sports training:', error);
      setTraining([]);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingTraining(null);
    fetchTraining();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this training program?')) return;
    try {
      const response = await fetch(`/api/admin/cricket-sports-training/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchTraining();
      }
    } catch (error) {
      console.error('Error deleting training program:', error);
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/cricket-sports-training/${id}/toggle-active`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchTraining();
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/cricket-sports-training/${id}/toggle-featured`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchTraining();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Cricket Sports Training</h2>
          <p className="text-muted-foreground">Manage cricket coaching and training programs</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Training Program
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Cricket Sports Training Program</DialogTitle>
            <DialogDescription>Fill in the details to create a new training program listing</DialogDescription>
          </DialogHeader>
          <CricketSportsTrainingForm onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(training) && training.map((program) => (
          <Card key={program.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{program.title}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{program.trainingLevel}</Badge>
                    <Badge variant="outline">{program.courseDurationDays} days</Badge>
                    {program.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(program.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {program.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{program.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg text-primary">₹{program.pricePerMonth}</span>
                  <Badge variant={program.isActive ? 'default' : 'secondary'}>
                    {program.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {program.coachName && (
                  <div className="text-sm">
                    <span className="font-medium">Coach: </span>
                    <span className="text-muted-foreground">{program.coachName}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex gap-2">
              <Button
                variant={program.isActive ? "outline" : "default"}
                size="sm"
                className="flex-1"
                onClick={() => toggleActive(program.id)}
              >
                {program.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant={program.isFeatured ? "secondary" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => toggleFeatured(program.id)}
              >
                {program.isFeatured ? "Unfeature" : "Feature"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {(!training || training.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Training Programs Found</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first cricket sports training program</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Training Program
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Jewelry & Accessories Section Component
function JewelryAccessoriesSection() {
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [viewingItem, setViewingItem] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const queryParams = new URLSearchParams();

      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData.role === 'admin') {
          queryParams.append('role', 'admin');
        } else {
          queryParams.append('userId', userData.id);
          queryParams.append('role', userData.role || 'user');
        }
      }

      const response = await fetch(`/api/admin/jewelry-accessories?${queryParams.toString()}`);
      const data = await response.json();
      console.log('Fetched jewelry accessories:', data); // Debug log
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching jewelry & accessories:', error);
      setItems([]);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingItem(null);
    fetchItems();
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleViewDetails = (item: any) => {
    setViewingItem(item);
    setShowDetailsDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const response = await fetch(`/api/admin/jewelry-accessories/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchItems();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/jewelry-accessories/${id}/toggle-active`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchItems();
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/jewelry-accessories/${id}/toggle-featured`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchItems();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Jewelry & Accessories</h2>
          <p className="text-muted-foreground">Manage jewelry and accessory listings</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={(open) => {
        setShowForm(open);
        if (!open) setEditingItem(null);
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Jewelry/Accessory Item' : 'Add New Jewelry/Accessory Item'}</DialogTitle>
            <DialogDescription>Fill in the details to {editingItem ? 'update' : 'create'} a jewelry or accessory listing</DialogDescription>
          </DialogHeader>
          <JewelryAccessoriesForm onSuccess={handleSuccess} editingItem={editingItem} />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(items) && items.map((item) => (
          <Card key={item.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{item.title}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{item.category}</Badge>
                    <Badge variant="outline">{item.listingType}</Badge>
                    {item.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleViewDetails(item)}
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(item)}
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(item.id)}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {item.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg text-primary">₹{Number(item.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <Badge variant={item.isActive ? 'default' : 'secondary'}>
                    {item.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {item.brand && (
                  <div className="text-sm">
                    <span className="font-medium">Brand: </span>
                    <span className="text-muted-foreground">{item.brand}</span>
                  </div>
                )}
                {item.material && (
                  <div className="text-sm">
                    <span className="font-medium">Material: </span>
                    <span className="text-muted-foreground">{item.material}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex gap-2">
              <Button
                variant={item.isActive ? "outline" : "default"}
                size="sm"
                className="flex-1"
                onClick={() => toggleActive(item.id)}
              >
                {item.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant={item.isFeatured ? "secondary" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => toggleFeatured(item.id)}
              >
                {item.isFeatured ? "Unfeature" : "Feature"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* View Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{viewingItem?.title}</DialogTitle>
            <DialogDescription>Complete jewelry/accessory details</DialogDescription>
          </DialogHeader>
          {viewingItem && (
            <div className="space-y-6">
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary">{viewingItem.category}</Badge>
                <Badge variant="outline">{viewingItem.listingType}</Badge>
                {viewingItem.condition && <Badge variant="outline">{viewingItem.condition}</Badge>}
                {viewingItem.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-lg font-bold text-primary">₹{Number(viewingItem.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                {viewingItem.originalPrice && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Original Price</p>
                    <p className="text-lg font-bold line-through">₹{Number(viewingItem.originalPrice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                )}
                {viewingItem.discountPercentage && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Discount</p>
                    <p className="text-lg font-bold text-green-600">{viewingItem.discountPercentage}%</p>
                  </div>
                )}
                {viewingItem.makingCharges && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Making Charges</p>
                    <p className="text-lg font-bold">₹{Number(viewingItem.makingCharges).toLocaleString('en-IN')}</p>
                  </div>
                )}
              </div>

              {viewingItem.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{viewingItem.description}</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Product Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {viewingItem.brand && (
                    <div>
                      <span className="font-medium">Brand:</span>
                      <span className="ml-2 text-muted-foreground">{viewingItem.brand}</span>
                    </div>
                  )}
                  {viewingItem.material && (
                    <div>
                      <span className="font-medium">Material:</span>
                      <span className="ml-2 text-muted-foreground">{viewingItem.material}</span>
                    </div>
                  )}
                  {viewingItem.purity && (
                    <div>
                      <span className="font-medium">Purity/Karat:</span>
                      <span className="ml-2 text-muted-foreground">{viewingItem.purity}</span>
                    </div>
                  )}
                  {viewingItem.weight && (
                    <div>
                      <span className="font-medium">Weight:</span>
                      <span className="ml-2 text-muted-foreground">{viewingItem.weight}</span>
                    </div>
                  )}
                  {viewingItem.gender && (
                    <div>
                      <span className="font-medium">Gender:</span>
                      <span className="ml-2 text-muted-foreground capitalize">{viewingItem.gender}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {viewingItem.hallmarked && <Badge variant="outline">Hallmarked</Badge>}
                  {viewingItem.certified && <Badge variant="outline">Certified</Badge>}
                  {viewingItem.customizable && <Badge variant="outline">Customizable</Badge>}
                  {viewingItem.giftWrapping && <Badge variant="outline">Gift Wrapping</Badge>}
                  {viewingItem.returnPolicy && <Badge variant="outline">Return Policy</Badge>}
                  {viewingItem.codAvailable && <Badge variant="outline">COD Available</Badge>}
                  {viewingItem.freeShipping && <Badge variant="outline">Free Shipping</Badge>}
                </div>
              </div>

              {viewingItem.shopName && (
                <div>
                  <h3 className="font-semibold mb-2">Seller Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Shop/Business:</span>
                      <span className="ml-2 text-muted-foreground">{viewingItem.shopName}</span>
                    </div>
                    {viewingItem.contactPhone && (
                      <div>
                        <span className="font-medium">Phone:</span>
                        <span className="ml-2 text-muted-foreground">{viewingItem.contactPhone}</span>
                      </div>
                    )}
                    {viewingItem.contactEmail && (
                      <div>
                        <span className="font-medium">Email:</span>
                        <span className="ml-2 text-muted-foreground">{viewingItem.contactEmail}</span>
                      </div>
                    )}
                    {viewingItem.website && (
                      <div>
                        <span className="font-medium">Website:</span>
                        <span className="ml-2 text-muted-foreground">
                          <a href={viewingItem.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {viewingItem.website}
                          </a>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {(viewingItem.city || viewingItem.address) && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </h3>
                  <div className="space-y-1 text-sm">
                    {viewingItem.address && <p><span className="font-medium">Address:</span> {viewingItem.address}</p>}
                    {viewingItem.city && <p><span className="font-medium">City:</span> {viewingItem.city}</p>}
                    {viewingItem.state && <p><span className="font-medium">State:</span> {viewingItem.state}</p>}
                    {viewingItem.pincode && <p><span className="font-medium">Pincode:</span> {viewingItem.pincode}</p>}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t text-sm text-muted-foreground">
                <p>Created: {new Date(viewingItem.createdAt).toLocaleString()}</p>
                <p>Last Updated: {new Date(viewingItem.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {(!items || items.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Items Found</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first jewelry or accessory item</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Health & Wellness Services Section Component
function HealthWellnessServicesSection() {
  const [services, setServices] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/admin/health-wellness-services');
      const data = await response.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching health & wellness services:', error);
      setServices([]);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingService(null);
    fetchServices();
  };

  const handleEdit = (service: any) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      const response = await fetch(`/api/admin/health-wellness-services/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchServices();
      }
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/health-wellness-services/${id}/toggle-active`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchServices();
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/health-wellness-services/${id}/toggle-featured`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchServices();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Health & Wellness Services</h2>
          <p className="text-muted-foreground">Manage health and wellness service providers</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={(open) => {
        setShowForm(open);
        if (!open) setEditingService(null);
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingService ? 'Edit Health & Wellness Service' : 'Add New Health & Wellness Service'}</DialogTitle>
            <DialogDescription>Fill in the details to {editingService ? 'update' : 'create'} a health & wellness service listing</DialogDescription>
          </DialogHeader>
          <HealthWellnessServicesForm onSuccess={handleSuccess} editingService={editingService} />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(services) && services.map((service) => (
          <Card key={service.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{service.title}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{service.serviceType}</Badge>
                    {service.specialization && <Badge variant="outline">{service.specialization}</Badge>}
                    {service.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(service)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(service.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {service.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
                )}
                <div className="flex items-center justify-between">
                  {service.consultationFee && (
                    <span className="font-semibold text-lg text-primary">₹{service.consultationFee}</span>
                  )}
                  <Badge variant={service.isActive ? 'default' : 'secondary'}>
                    {service.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {service.doctorName && (
                  <div className="text-sm">
                    <span className="font-medium">Doctor: </span>
                    <span className="text-muted-foreground">{service.doctorName}</span>
                  </div>
                )}
                {service.city && (
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {service.city}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex gap-2">
              <Button
                variant={service.isActive ? "outline" : "default"}
                size="sm"
                className="flex-1"
                onClick={() => toggleActive(service.id)}
              >
                {service.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant={service.isFeatured ? "secondary" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => toggleFeatured(service.id)}
              >
                {service.isFeatured ? "Unfeature" : "Feature"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {(!services || services.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Services Found</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first health & wellness service</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Household Services Section Component
function HouseholdServicesSection() {
  const [services, setServices] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null); // Added state for editingItem
  const [viewingService, setViewingService] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/admin/household-services');
      const data = await response.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching household services:', error);
      setServices([]);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingService(null);
    setEditingItem(null); // Reset editingItem state
    fetchServices();
  };

  const handleEdit = (service: any) => {
    setEditingService(service);
    setEditingItem(service); // Set editingItem state
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      const response = await fetch(`/api/admin/household-services/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchServices();
      }
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/household-services/${id}/toggle-active`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchServices();
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/household-services/${id}/toggle-featured`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchServices();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  const handleViewDetails = (service: any) => {
    setViewingService(service);
    setShowDetailsDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Household Services</h2>
          <p className="text-muted-foreground">Manage household service providers</p>
        </div>
        <Button onClick={() => {
          setEditingService(null);
          setEditingItem(null); // Reset editingItem when adding new
          setShowForm(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={(open) => {
        setShowForm(open);
        if (!open) {
            setEditingService(null);
            setEditingItem(null); // Reset editingItem when dialog closes
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingService ? "Edit Household Service" : "Add New Household Service"}</DialogTitle>
            <DialogDescription>
              Fill in the details to {editingService ? "update" : "create"} a household service listing
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <HouseholdServicesForm onSuccess={handleSuccess} editingService={editingService} />
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(services) && services.map((service) => (
          <Card key={service.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{service.title}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{service.serviceType}</Badge>
                    {service.serviceCategory && <Badge variant="outline">{service.serviceCategory}</Badge>}
                    {service.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleViewDetails(service)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(service)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(service.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {service.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-lg text-primary">₹{service.baseServiceCharge}</span>
                    {service.hourlyRate && (
                      <span className="text-sm text-muted-foreground ml-2">| ₹{service.hourlyRate}/hr</span>
                    )}
                  </div>
                  <Badge variant={service.isActive ? 'default' : 'secondary'}>
                    {service.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-1">
                  {service.emergencyService && <Badge variant="destructive" className="text-xs">Emergency</Badge>}
                  {service.sameDayService && <Badge variant="default" className="text-xs">Same Day</Badge>}
                  {service.available24_7 && <Badge variant="default" className="text-xs">24/7</Badge>}
                  {service.freeEstimate && <Badge variant="outline" className="text-xs">Free Estimate</Badge>}
                  {service.warrantyProvided && <Badge variant="outline" className="text-xs">Warranty</Badge>}
                  {service.certifiedProfessional && <Badge variant="secondary" className="text-xs">Certified</Badge>}
                </div>

                {service.businessName && (
                  <div className="text-sm">
                    <span className="font-medium">Business: </span>
                    <span className="text-muted-foreground">{service.businessName}</span>
                  </div>
                )}
                {service.contactPerson && (
                  <div className="text-sm">
                    <span className="font-medium">Contact: </span>
                    <span className="text-muted-foreground">{service.contactPerson}</span>
                    {service.contactPhone && (
                      <span className="text-muted-foreground ml-1">• {service.contactPhone}</span>
                    )}
                  </div>
                )}
                {service.workingHours && (
                  <div className="text-sm">
                    <span className="font-medium">Hours: </span>
                    <span className="text-muted-foreground">{service.workingHours}</span>
                  </div>
                )}
                {(service.city || service.areaName) && (
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {[service.areaName, service.city].filter(Boolean).join(", ")}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex gap-2">
              <Button
                variant={service.isActive ? "outline" : "default"}
                size="sm"
                className="flex-1"
                onClick={() => toggleActive(service.id)}
              >
                {service.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant={service.isFeatured ? "secondary" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => toggleFeatured(service.id)}
              >
                {service.isFeatured ? "Unfeature" : "Feature"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* View Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{viewingService?.title}</DialogTitle>
            <DialogDescription>Complete service details</DialogDescription>
          </DialogHeader>
          {viewingService && (
            <div className="space-y-6">
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary">{viewingService.serviceType}</Badge>
                {viewingService.serviceCategory && <Badge variant="outline">{viewingService.serviceCategory}</Badge>}
                {viewingService.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Base Charge</p>
                  <p className="text-lg font-bold text-primary">₹{viewingService.baseServiceCharge}</p>
                </div>
                {viewingService.hourlyRate && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Hourly Rate</p>
                    <p className="text-lg font-bold">₹{viewingService.hourlyRate}/hr</p>
                  </div>
                )}
                {viewingService.minimumCharge && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Min. Charge</p>
                    <p className="text-lg font-bold">₹{viewingService.minimumCharge}</p>
                  </div>
                )}
                {viewingService.emergencyCharges && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Emergency Charge</p>
                    <p className="text-lg font-bold text-red-600">₹{viewingService.emergencyCharges}</p>
                  </div>
                )}
              </div>

              {/* Service Features */}
              <div>
                <h3 className="font-semibold mb-2">Service Features</h3>
                <div className="flex flex-wrap gap-2">
                  {viewingService.emergencyService && <Badge variant="destructive">Emergency Service</Badge>}
                  {viewingService.sameDayService && <Badge variant="default">Same Day Service</Badge>}
                  {viewingService.available24_7 && <Badge variant="default">24/7 Available</Badge>}
                  {viewingService.freeInspection && <Badge variant="outline">Free Inspection</Badge>}
                  {viewingService.freeEstimate && <Badge variant="outline">Free Estimate</Badge>}
                  {viewingService.warrantyProvided && <Badge variant="outline">Warranty: {viewingService.warrantyPeriod || 'Yes'}</Badge>}
                  {viewingService.certifiedProfessional && <Badge variant="secondary">Certified Professional</Badge>}
                  {viewingService.equipmentProvided && <Badge variant="outline">Equipment Provided</Badge>}
                  {viewingService.materialsIncluded && <Badge variant="outline">Materials Included</Badge>}
                  {viewingService.homeVisitAvailable && <Badge variant="outline">Home Visit</Badge>}
                  {viewingService.consultationAvailable && <Badge variant="outline">Consultation</Badge>}
                </div>
              </div>

              {/* Service Type & Pricing */}
              <div>
                <h3 className="font-semibold mb-2">Service Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Pricing Type:</span>
                    <span className="ml-2 text-muted-foreground capitalize">{viewingService.pricingType?.replace('_', ' ')}</span>
                  </div>
                  {viewingService.workingHours && (
                    <div>
                      <span className="font-medium">Working Hours:</span>
                      <span className="ml-2 text-muted-foreground">{viewingService.workingHours}</span>
                    </div>
                  )}
                  {viewingService.workingDays && (
                    <div>
                      <span className="font-medium">Working Days:</span>
                      <span className="ml-2 text-muted-foreground">{viewingService.workingDays}</span>
                    </div>
                  )}
                  {viewingService.serviceRadiusKm && (
                    <div>
                      <span className="font-medium">Service Radius:</span>
                      <span className="ml-2 text-muted-foreground">{viewingService.serviceRadiusKm} km</span>
                    </div>
                  )}
                </div>
              </div>

              {viewingService.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{viewingService.description}</p>
                </div>
              )}

              {viewingService.businessName && (
                <div>
                  <h3 className="font-semibold mb-2">Business Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Business Name:</span>
                      <span className="ml-2 text-muted-foreground">{viewingService.businessName}</span>
                    </div>
                    {viewingService.ownerName && (
                      <div>
                        <span className="font-medium">Owner:</span>
                        <span className="ml-2 text-muted-foreground">{viewingService.ownerName}</span>
                      </div>
                    )}
                    {viewingService.experienceYears && (
                      <div>
                        <span className="font-medium">Experience:</span>
                        <span className="ml-2 text-muted-foreground">{viewingService.experienceYears} years</span>
                      </div>
                    )}
                    {viewingService.teamSize && (
                      <div>
                        <span className="font-medium">Team Size:</span>
                        <span className="ml-2 text-muted-foreground">{viewingService.teamSize} members</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 flex gap-2">
                    {viewingService.residentialService && <Badge variant="outline">Residential</Badge>}
                    {viewingService.commercialService && <Badge variant="outline">Commercial</Badge>}
                    {viewingService.contractAvailable && <Badge variant="outline">Contract Available</Badge>}
                    {viewingService.amcAvailable && <Badge variant="outline">AMC Available</Badge>}
                  </div>
                </div>
              )}

              {viewingService.contactPerson && (
                <div>
                  <h3 className="font-semibold mb-2">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Contact Person:</span>
                      <span className="ml-2 text-muted-foreground">{viewingService.contactPerson}</span>
                    </div>
                    {viewingService.contactPhone && (
                      <div>
                        <span className="font-medium">Phone:</span>
                        <span className="ml-2 text-muted-foreground">{viewingService.contactPhone}</span>
                      </div>
                    )}
                    {viewingService.contactEmail && (
                      <div>
                        <span className="font-medium">Email:</span>
                        <span className="ml-2 text-muted-foreground">{viewingService.contactEmail}</span>
                      </div>
                    )}
                    {viewingService.whatsappAvailable && (
                      <div className="col-span-2">
                        <Badge variant="outline" className="bg-green-50">WhatsApp Available</Badge>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Location Information */}
              {viewingService.fullAddress && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location & Service Area
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Address:</span> {viewingService.fullAddress}</p>
                    {viewingService.areaName && <p><span className="font-medium">Area:</span> {viewingService.areaName}</p>}
                    {viewingService.city && <p><span className="font-medium">City:</span> {viewingService.city}</p>}
                    {viewingService.stateProvince && <p><span className="font-medium">State:</span> {viewingService.stateProvince}</p>}
                    {viewingService.serviceRadiusKm && <p><span className="font-medium">Service Radius:</span> {viewingService.serviceRadiusKm} km</p>}
                  </div>
                </div>
              )}

              {/* Payment & Discounts */}
              <div>
                <h3 className="font-semibold mb-2">Payment & Offers</h3>
                <div className="flex flex-wrap gap-2">
                  {viewingService.cashOnDelivery && <Badge variant="outline">Cash Payment</Badge>}
                  {viewingService.digitalPayment && <Badge variant="outline">Digital Payment</Badge>}
                  {viewingService.seniorCitizenDiscount && <Badge variant="default">Senior Citizen Discount</Badge>}
                </div>
              </div>

              <div className="pt-4 border-t text-sm text-muted-foreground">
                <p>Created: {new Date(viewingService.createdAt).toLocaleString()}</p>
                <p>Last Updated: {new Date(viewingService.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {(!services || services.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Household Services Found</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first household service</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color: string;
  isActive: boolean;
  sortOrder: number;
  subcategories?: AdminSubcategory[];
}

interface AdminSubcategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  sortOrder: number;
  parentCategoryId: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: string;
  isActive: boolean;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

interface Agency {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  phone?: string;
  email?: string;
  website?: string;
  propertyCount?: number;
  createdAt: string;
  updatedAt: string;
}

const iconMap: Record<string, React.ElementType> = {
  'building': Building,
  'map-pin': MapPin,
  'briefcase': Building,
  'users': Users,
  'file-text': FileText,
  'bar-chart': BarChart3,
  'settings': Settings,
};

function AppSidebar({ activeSection, setActiveSection }: { activeSection: string; setActiveSection: (section: string) => void }) {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const toggleCategoryExpand = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const staticItems = [
    { title: "Dashboard", icon: Home, key: "dashboard" },
    { title: "Categories", icon: FileText, key: "categories" },
    { title: "Sliders", icon: Image, key: "sliders" },
    { title: "Slider Card", icon: Image, key: "slider-card" },
    { title: "Blogs", icon: FileText, key: "blogs" },
    { title: "Articles", icon: FileText, key: "articles" },
    { title: "Videos", icon: Video, key: "videos" },
   
    // { title: "Featured Videos", icon: Video, key: "featured-videos" },
  ];

  return (
    <Sidebar variant="inset" className="border-r">
      <SidebarHeader className="border-b bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="font-bold text-lg bg-gradient-to-r from-blue-700 to-green-600 bg-clip-text text-transparent">Super Admin</h1>
            <p className="text-xs text-muted-foreground">Control Panel</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {staticItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={activeSection === item.key}
                    className={`
                      w-full justify-start rounded-lg transition-all duration-200
                      ${activeSection === item.key
                        ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md hover:shadow-lg'
                        : 'hover:bg-muted/80'
                      }
                    `}
                    onClick={() => {
                      // Open Slider Card section inside admin (no navigation away)
                      if (item.key === 'slider-card') {
                        setActiveSection('slider-card');
                      } else {
                        setActiveSection(item.key);
                      }
                    }}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {categories.length > 0 && (
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Categories
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {categories.map((category) => {
                  const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Settings;
                  const hasSubcategories = category.subcategories && category.subcategories.length > 0;
                  const isExpanded = expandedCategories.has(category.id);

                  return (
                    <div key={category.id}>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          tooltip={category.name}
                          isActive={activeSection === category.slug}
                          className={`
                            w-full justify-start rounded-lg transition-all duration-200
                            ${activeSection === category.slug
                              ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md'
                              : 'hover:bg-muted/80'
                            }
                          `}
                          onClick={() => {
                            if (hasSubcategories) {
                              toggleCategoryExpand(category.id);
                            }
                            setActiveSection(category.slug);
                          }}
                        >
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{
                              backgroundColor: activeSection === category.slug ? 'rgba(255,255,255,0.2)' : `${category.color}20`,
                            }}
                          >
                            <IconComponent
                              className="w-4 h-4"
                              style={{ color: activeSection === category.slug ? 'white' : category.color }}
                            />
                          </div>
                          <span className="font-medium flex-1">{category.name}</span>
                          {hasSubcategories && (
                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : 'rotate-0'}`} />
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      {hasSubcategories && isExpanded && (
                        <SidebarMenuSub className="ml-2 mt-1 mb-2 border-l-2 pl-4" style={{ borderColor: `${category.color}40` }}>
                          {category.subcategories.map((subcategory) => {
                            const SubIcon = iconMap[subcategory.icon as keyof typeof iconMap] || Settings;
                            return (
                              <SidebarMenuSubItem key={subcategory.id}>
                                <SidebarMenuSubButton
                                  isActive={activeSection === subcategory.slug}
                                  onClick={() => setActiveSection(subcategory.slug)}
                                  className={`
                                    cursor-pointer rounded-md transition-all duration-200
                                    ${activeSection === subcategory.slug
                                      ? 'bg-muted font-medium'
                                      : 'hover:bg-muted/50'
                                    }
                                  `}
                                >
                                  <SubIcon className="w-4 h-4" style={{ color: category.color }} />
                                  <span>{subcategory.name}</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      )}
                    </div>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Users"
                  isActive={activeSection === "users"}
                  className={`
                    w-full justify-start rounded-lg transition-all duration-200
                    ${activeSection === "users"
                      ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md'
                      : 'hover:bg-muted/80'
                    }
                  `}
                  onClick={() => setActiveSection('users')}
                >
                  <Users className="w-5 h-5" />
                  <span className="font-medium">Users</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Agencies"
                  isActive={activeSection === "agencies"}
                  className={`
                    w-full justify-start rounded-lg transition-all duration-200
                    ${activeSection === "agencies"
                      ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md'
                      : 'hover:bg-muted/80'
                    }
                  `}
                  onClick={() => setActiveSection('agencies')}
                >
                  <Bookmark className="w-5 h-5" />
                  <span className="font-medium">Agencies</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Analytics"
                  isActive={activeSection === "analytics"}
                  className={`
                    w-full justify-start rounded-lg transition-all duration-200
                    ${activeSection === "analytics"
                      ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md'
                      : 'hover:bg-muted/80'
                    }
                  `}
                  onClick={() => setActiveSection('analytics')}
                >
                  <BarChart3 className="w-5 h-5" />
                  <span className="font-medium">Analytics</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Contact Messages"
                  isActive={activeSection === "contact-messages"}
                  className={`
                    w-full justify-start rounded-lg transition-all duration-200
                    ${activeSection === "contact-messages"
                      ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md'
                      : 'hover:bg-muted/80'
                    }
                  `}
                  onClick={() => setActiveSection('contact-messages')}
                >
                  <Mail className="w-5 h-5" />
                  <span className="font-medium">Contact Messages</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Quick Actions
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start cursor-pointer rounded-lg transition-all duration-200 hover:bg-green-600/10 text-green-600 hover:text-green-700 border border-green-200 hover:border-green-300"
                  onClick={() => setActiveSection('categories')}
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Add Category</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t bg-muted/30 p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full justify-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                A
              </div>
              <div className="flex flex-col items-start flex-1">
                <span className="text-sm font-semibold">Admin User</span>
                <span className="text-xs text-muted-foreground">admin@jeevika.com</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

// Dashboard Section
function DashboardSection() {
  const [stats, setStats] = useState({
    totalProperties: '0',
    totalAgencies: '0',
    totalUsers: '0',
    totalCategories: '0'
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Properties</CardTitle>
            <div className="text-2xl font-bold">{stats.totalProperties}</div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Agencies</CardTitle>
            <div className="text-2xl font-bold">{stats.totalAgencies}</div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Categories</CardTitle>
            <div className="text-2xl font-bold">{stats.totalCategories}</div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}

// Categories Section
function CategoriesSection() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [subcategoryDialogOpen, setSubcategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | undefined>(undefined);
  const [editingSubcategory, setEditingSubcategory] = useState<AdminSubcategory | undefined>(undefined);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('expandedCategories');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
   localStorage.setItem('expandedCategories', JSON.stringify(Array.from(expandedCategories)));
  }, [expandedCategories]);

  const toggleCategoryExpand = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? All subcategories will be deleted as well.')) return;

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchCategories();
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleToggleCategoryActive = async (category: AdminCategory) => {
    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...category, isActive: !category.isActive }),
      });

      if (response.ok) {
        await fetchCategories();
      }
    } catch (error) {
      console.error('Error toggling category status:', error);
    }
  };

  const handleDeleteSubcategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subcategory?')) return;

    try {
      const response = await fetch(`/api/admin/subcategories/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchCategories();
      }
    } catch (error) {
      console.error('Error deleting subcategory:', error);
    }
  };

  const handleToggleSubcategoryActive = async (subcategory: AdminSubcategory) => {
    try {
      const response = await fetch(`/api/admin/subcategories/${subcategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...subcategory, isActive: !subcategory.isActive }),
      });

      if (response.ok) {
        await fetchCategories();
      }
    } catch (error) {
      console.error('Error toggling subcategory status:', error);
    }
  };

  const handleEditCategory = (category: AdminCategory) => {
    setEditingCategory(category);
    setCategoryDialogOpen(true);
  };

  const handleEditSubcategory = (subcategory: AdminSubcategory) => {
    setEditingSubcategory(subcategory);
    setSubcategoryDialogOpen(true);
  };

  const handleAddCategory = () => {
    setEditingCategory(undefined);
    setCategoryDialogOpen(true);
  };

  const handleAddSubcategory = () => {
    setEditingSubcategory(undefined);
    setSubcategoryDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Categories Management</h3>
          <p className="text-sm text-muted-foreground">Manage your system categories and subcategories</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleAddCategory}>
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
          <Button size="sm" variant="outline" onClick={handleAddSubcategory}>
            <Plus className="w-4 h-4 mr-2" />
            Add Subcategory
          </Button>
        </div>
      </div>

      <CategoryDialog
        open={categoryDialogOpen}
        onOpenChange={(open) => {
          setCategoryDialogOpen(open);
          if (!open) setEditingCategory(undefined);
        }}
        category={editingCategory}
      />
      <SubcategoryDialog
        open={subcategoryDialogOpen}
        onOpenChange={(open) => {
          setSubcategoryDialogOpen(open);
          if (!open) setEditingSubcategory(undefined);
        }}
        categories={categories}
        subcategory={editingSubcategory}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(categories) && categories.map((category) => {
          const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Settings;

          return (
            <Card key={category.id} className="group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="p-3 rounded-lg transition-colors"
                      style={{ backgroundColor: `${category.color}20`, color: category.color }}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold">{category.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">{category.slug}</Badge>
                        <Badge
                          variant={category.isActive ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEditCategory(category)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleToggleCategoryActive(category)}
                    >
                      {category.isActive ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4 opacity-50" />
                      )}
                    </Button>
                    {/* <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button> */}
                  </div>
                </div>

                {category.description && (
                  <CardDescription className="mt-2">{category.description}</CardDescription>
                )}
              </CardHeader>

              <CardContent>
                {category.subcategories && category.subcategories.length > 0 && (
                  <div className="space-y-3">
                    <div
                      className="flex items-center justify-between cursor-pointer hover:bg-muted/50 -mx-2 px-2 py-1 rounded"
                      onClick={() => toggleCategoryExpand(category.id)}
                    >
                      <h4 className="font-medium text-sm text-muted-foreground">
                        Subcategories ({category.subcategories.length})
                      </h4>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        {expandedCategories.has(category.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4 -rotate-90" />
                        )}
                      </Button>
                    </div>
                    {expandedCategories.has(category.id) && (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {category.subcategories.map((sub) => (
                          <div key={sub.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md hover:bg-muted transition-colors group/sub">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{sub.name}</span>
                              <Badge
                                variant={sub.isActive ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {sub.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover/sub:opacity-100 transition-opacity"
                                onClick={() => handleEditSubcategory(sub)}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover/sub:opacity-100 transition-opacity"
                                onClick={() => handleToggleSubcategoryActive(sub)}
                              >
                                {sub.isActive ? (
                                  <Eye className="w-3 h-3" />
                                ) : (
                                  <Eye className="w-3 h-3 opacity-50" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover/sub:opacity-100 transition-opacity text-destructive"
                                onClick={() => handleDeleteSubcategory(sub.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {(!category.subcategories || category.subcategories.length === 0) && (
                  <div className="text-center py-6 text-muted-foreground">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No subcategories yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// Users Section Component
function UsersSection() {
  const [users, setUsers] = useState<User[]>([]);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'user',
    password: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userForm),
      });

      if (response.ok) {
        fetchUsers();
        setIsCreateUserOpen(false);
        setUserForm({ username: '', email: '', firstName: '', lastName: '', phone: '', role: 'user', password: '' });
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Users Management</h2>
          <p className="text-muted-foreground">Manage system users</p>
        </div>
        <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>Add a new user to the system</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">First Name</label>
                  <Input
                    value={userForm.firstName}
                    onChange={(e) => setUserForm(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Last Name</label>
                  <Input
                    value={userForm.lastName}
                    onChange={(e) => setUserForm(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Last name"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Username</label>
                <Input
                  value={userForm.username}
                  onChange={(e) => setUserForm(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Username"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Email"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={userForm.phone}
                  onChange={(e) => setUserForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Phone number"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Role</label>
                <Select value={userForm.role} onValueChange={(value) => setUserForm(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="agent">Agent</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">Create User</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {user.firstName?.[0] || user.username[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">{user.firstName} {user.lastName}</div>
                        <div className="text-sm text-muted-foreground">@{user.username}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? 'default' : 'secondary'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// Agencies Section Component
function AgenciesSection() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAgency, setEditingAgency] = useState<Agency | null>(null);

  useEffect(() => {
    fetchAgencies();
  }, []);

  const fetchAgencies = async () => {
    try {
      const response = await fetch('/api/agencies');
      const data = await response.json();
      setAgencies(data);
    } catch (error) {
      console.error('Error fetching agencies:', error);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingAgency(null);
    fetchAgencies();
  };

  const handleEdit = (agency: Agency) => {
    setEditingAgency(agency);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this agency?')) return;
    try {
      const response = await fetch(`/api/agencies/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchAgencies();
      }
    } catch (error) {
      console.error('Error deleting agency:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Agencies Management</h2>
          <p className="text-muted-foreground">Manage real estate agencies</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Agency
        </Button>
      </div>

      {showForm && (
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAgency ? 'Edit Agency' : 'Add Agency'}
              </DialogTitle>
            </DialogHeader>
            {/* Assuming an AgencyForm component exists */}
            {/* <AgencyForm agency={editingAgency} onCancel={() => setShowForm(false)} onSuccess={handleSuccess} /> */}
            <p>Agency Form Placeholder</p>
          </DialogContent>
        </Dialog>
      )}


    </div>
  );
}

// Analytics Section Component
function AnalyticsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Analytics & Reports</h2>
        <p className="text-muted-foreground">System analytics and performance metrics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Property Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Total Listings</span>
                <span className="font-bold">145</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Active Listings</span>
                <span className="font-bold">132</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Sold This Month</span>
                <span className="font-bold">23</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Total Users</span>
                <span className="font-bold">1,245</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Active This Month</span>
                <span className="font-bold">856</span>
              </div>
              <div className="flex justify-between items-center">
                <span>New Registrations</span>
                <span className="font-bold">42</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Hostels & PG Section Component
function HostelsPgSection() {
  const [hostels, setHostels] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingHostel, setEditingHostel] = useState(null);
  const [viewingHostel, setViewingHostel] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    try {
      const response = await fetch('/api/admin/hostel-pg');
      const data = await response.json();
      setHostels(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching hostels:', error);
      setHostels([]);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingHostel(null);
    fetchHostels();
  };

  const handleEdit = (hostel: any) => {
    setEditingHostel(hostel);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hostel/PG?')) return;
    try {
      const response = await fetch(`/api/admin/hostel-pg/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchHostels();
      }
    } catch (error) {
      console.error('Error deleting hostel:', error);
    }
  };

  const handleToggleActive = async (hostel: any) => {
    try {
      const response = await fetch(`/api/admin/hostel-pg/${hostel.id}/toggle-active`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchHostels();
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const handleToggleFeatured = async (hostel: any) => {
    try {
      const response = await fetch(`/api/admin/hostel-pg/${hostel.id}/toggle-featured`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchHostels();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  const handleViewDetails = (hostel: any) => {
    setViewingHostel(hostel);
    setShowDetailsDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Hostels & PG</h2>
          <p className="text-muted-foreground">Manage hostel and paying guest accommodations</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Hostel/PG
        </Button>
      </div>

      {showForm && (
        <HostelPgForm
          open={showForm}
          onOpenChange={setShowForm}
          hostelPg={editingHostel}
          onSuccess={handleSuccess}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(hostels) && hostels.map((hostel) => (
          <Card key={hostel.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{hostel.name}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{hostel.hostelType}</Badge>
                    <Badge variant="outline">{hostel.roomType}</Badge>
                    {hostel.foodIncluded && <Badge variant="default">Food Included</Badge>}
                    {hostel.featured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleViewDetails(hostel)}
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(hostel)}
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(hostel.id)}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {hostel.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{hostel.description}</p>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-lg text-primary">₹{hostel.pricePerMonth}/month</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total Beds:</span>
                    <span className="font-medium ml-1">{hostel.totalBeds || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Available:</span>
                    <span className="font-medium ml-1">{hostel.availableBeds || 'N/A'}</span>
                  </div>
                </div>
                {(hostel.city || hostel.area) && (
                  <div className="text-sm pt-2 border-t">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>
                        {[hostel.area, hostel.city, hostel.stateProvince].filter(Boolean).join(", ")}
                      </span>
                    </div>
                  </div>
                )}
                {hostel.contactPerson && (
                  <div className="text-sm pt-2 border-t">
                    <div className="font-medium">{hostel.contactPerson}</div>
                    {hostel.contactPhone && (
                      <div className="text-muted-foreground">{hostel.contactPhone}</div>
                    )}
                  </div>
                )}
                {hostel.facilities && hostel.facilities.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-2">
                    {hostel.facilities.slice(0, 3).map((facility: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {facility}
                      </Badge>
                    ))}
                    {hostel.facilities.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{hostel.facilities.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={hostel.active}
                      onCheckedChange={() => handleToggleActive(hostel)}
                    />
                    <span className="text-xs font-medium">
                      {hostel.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => handleToggleFeatured(hostel)}
                  >
                    {hostel.featured ? "★ Featured" : "☆ Feature"}
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground pt-2">
                  Added: {new Date(hostel.createdAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{viewingHostel?.name}</DialogTitle>
            <DialogDescription>Complete details of the hostel/PG listing</DialogDescription>
          </DialogHeader>
          {viewingHostel && (
            <div className="space-y-6">
              {/* Status Badges */}
              <div className="flex gap-2 flex-wrap">
                <Badge variant={viewingHostel.active ? "default" : "secondary"}>
                  {viewingHostel.active ? "Active" : "Inactive"}
                </Badge>
                <Badge variant="secondary">{viewingHostel.hostelType}</Badge>
                <Badge variant="outline">{viewingHostel.roomType}</Badge>
                {viewingHostel.foodIncluded && <Badge>Food Included</Badge>}
                {viewingHostel.featured && <Badge className="bg-yellow-500">Featured</Badge>}
              </div>

              {/* Price & Capacity */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Price/Month</p>
                  <p className="text-lg font-bold text-primary">₹{viewingHostel.pricePerMonth}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Beds</p>
                  <p className="text-lg font-bold">{viewingHostel.totalBeds || 'N/A'}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Available Beds</p>
                  <p className="text-lg font-bold text-green-600">{viewingHostel.availableBeds || 'N/A'}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Occupancy</p>
                  <p className="text-lg font-bold">
                    {viewingHostel.totalBeds > 0
                      ? `${Math.round(((viewingHostel.totalBeds - viewingHostel.availableBeds) / viewingHostel.totalBeds) * 100)}%`
                      : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Description */}
              {viewingHostel.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{viewingHostel.description}</p>
                </div>
              )}

              {/* Location */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Address:</span> {viewingHostel.fullAddress}</p>
                  {viewingHostel.area && <p><span className="font-medium">Area:</span> {viewingHostel.area}</p>}
                  <p><span className="font-medium">City:</span> {viewingHostel.city}</p>
                  {viewingHostel.stateProvince && <p><span className="font-medium">State:</span> {viewingHostel.stateProvince}</p>}
                  <p><span className="font-medium">Country:</span> {viewingHostel.country}</p>
                </div>
              </div>

              {/* Contact */}
              {(viewingHostel.contactPerson || viewingHostel.contactPhone) && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Contact Information
                  </h3>
                  <div className="space-y-1 text-sm">
                    {viewingHostel.contactPerson && (
                      <p><span className="font-medium">Contact Person:</span> {viewingHostel.contactPerson}</p>
                    )}
                    {viewingHostel.contactPhone && (
                      <p><span className="font-medium">Phone:</span> {viewingHostel.contactPhone}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Facilities */}
              {viewingHostel.facilities && viewingHostel.facilities.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Facilities</h3>
                  <div className="flex flex-wrap gap-2">
                    {viewingHostel.facilities.map((facility: string, idx: number) => (
                      <Badge key={idx} variant="outline">{facility}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Rules */}
              {viewingHostel.rules && (
                <div>
                  <h3 className="font-semibold mb-2">Rules & Regulations</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{viewingHostel.rules}</p>
                </div>
              )}

              {/* Images */}
              {viewingHostel.images && viewingHostel.images.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Images ({viewingHostel.images.length})</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {viewingHostel.images.map((image: string, idx: number) => (
                      <div key={idx} className="aspect-video bg-muted rounded-lg overflow-hidden">
                        <img src={image} alt={`Hostel ${idx + 1}`} className="w-full h-full " />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="pt-4 border-t text-sm text-muted-foreground">
                <p>Created: {new Date(viewingHostel.createdAt).toLocaleDateString()}</p>
                <p>Last Updated: {new Date(viewingHostel.updatedAt).toLocaleDateString()}</p>
                {viewingHostel.ownerId && <p>Owner ID: {viewingHostel.ownerId}</p>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {(!hostels || hostels.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Hostels/PG Found</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first hostel or PG listing</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Hostel/PG
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Construction Materials Section Component
function ConstructionMaterialsSection() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [viewingMaterial, setViewingMaterial] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const getUserFromLocalStorage = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const localUser = getUserFromLocalStorage();
      const queryParams = new URLSearchParams();
      if (localUser?.id) queryParams.append("userId", String(localUser.id));
      if (localUser?.role) queryParams.append("role", String(localUser.role));

      const url = queryParams.toString()
        ? `/api/admin/construction-materials?${queryParams.toString()}`
        : "/api/admin/construction-materials";

      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) {
        console.error("Error fetching materials:", data);
        setMaterials([]);
        return;
      }

      setMaterials(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching materials:', error);
      setMaterials([]);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingMaterial(null);
    fetchMaterials();
  };

  const handleEdit = (material: any) => {
    setEditingMaterial(material);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this material?')) return;
    try {
      const response = await fetch(`/api/admin/construction-materials/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchMaterials();
      }
    } catch (error) {
      console.error('Error deleting material:', error);
    }
  };

  const handleViewDetails = (material: any) => {
    setViewingMaterial(material);
    setShowDetailsDialog(true);
  };

  const toggleActive = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/construction-materials/${id}/toggle-active`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchMaterials();
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/construction-materials/${id}/toggle-featured`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchMaterials();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Construction & Building Materials</h2>
          <p className="text-muted-foreground">Manage construction materials inventory</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Material
        </Button>
      </div>

      {showForm && (
        <ConstructionMaterialsForm
          open={showForm}
          onOpenChange={setShowForm}
          material={editingMaterial}
          onSuccess={handleSuccess}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(materials) && materials.map((material) => (
          <Card key={material.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{material.name}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{material.category}</Badge>
                    {material.brand && <Badge variant="outline">{material.brand}</Badge>}
                    {material.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleViewDetails(material)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(material)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(material.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {material.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{material.description}</p>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-lg text-primary">₹{material.price}/{material.unit}</span>
                  <Badge variant={material.stockStatus === 'in_stock' ? 'default' : 'secondary'}>
                    {material.stockStatus?.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                {material.supplierName && (
                  <div className="text-sm pt-2 border-t">
                    <div className="font-medium">{material.supplierName}</div>
                    {material.supplierContact && (
                      <div className="text-muted-foreground">{material.supplierContact}</div>
                    )}
                  </div>
                )}
                <div className="text-xs text-muted-foreground pt-2">
                  Added: {new Date(material.createdAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Stock: <span className="font-medium">{material.stockStatus?.replace('_', ' ').toUpperCase()}</span>
              </div>
              <div className="text-lg font-bold text-primary">
                ₹{material.price}/{material.unit}
              </div>
            </CardFooter>
            <CardFooter className="pt-0 flex gap-2">
              <Button
                variant={material.isActive ? "outline" : "default"}
                size="sm"
                className="flex-1"
                onClick={() => toggleActive(material.id)}
              >
                {material.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant={material.isFeatured ? "secondary" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => toggleFeatured(material.id)}
              >
                {material.isFeatured ? "Unfeature" : "Feature"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{viewingMaterial?.name}</DialogTitle>
            <DialogDescription>Complete material details</DialogDescription>
          </DialogHeader>
          {viewingMaterial && (
            <div className="space-y-6">
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary">{viewingMaterial.category}</Badge>
                {viewingMaterial.brand && <Badge variant="outline">{viewingMaterial.brand}</Badge>}
                <Badge variant={viewingMaterial.stockStatus === 'in_stock' ? 'default' : 'secondary'}>
                  {viewingMaterial.stockStatus?.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-lg font-bold text-primary">₹{viewingMaterial.price}/{viewingMaterial.unit}</p>
                </div>
                {viewingMaterial.minimumOrder && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Min. Order</p>
                    <p className="text-lg font-bold">{viewingMaterial.minimumOrder} {viewingMaterial.unit}</p>
                  </div>
                )}
              </div>

              {viewingMaterial.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{viewingMaterial.description}</p>
                </div>
              )}

              {viewingMaterial.specifications && Object.keys(viewingMaterial.specifications).length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Specifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(viewingMaterial.specifications).map(([key, value]) => (
                      <Badge key={key} variant="outline">{key}: {value as string}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {viewingMaterial.images && viewingMaterial.images.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Images ({viewingMaterial.images.length})</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {viewingMaterial.images.map((image: string, idx: number) => (
                      <img key={idx} src={image} alt={`Material ${idx + 1}`} className="w-full h-32  rounded-lg" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {(!materials || materials.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Materials Found</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first construction material</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Material
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Property Deals Section Component
function PropertyDealsSection() {
  const [deals, setDeals] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await fetch('/api/admin/property-deals');
      const data = await response.json();
      setDeals(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching property deals:', error);
      setDeals([]);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingDeal(null);
    fetchDeals();
  };

  const handleEdit = (deal: any) => {
    setEditingDeal(deal);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property deal?')) return;
    try {
      const response = await fetch(`/api/admin/property-deals/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchDeals();
      }
    } catch (error) {
      console.error('Error deleting property deal:', error);
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/property-deals/${id}/toggle-active`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchDeals();
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/property-deals/${id}/toggle-featured`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchDeals();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Property Deals (Buy/Sell)</h2>
          <p className="text-muted-foreground">Manage property buy and sell listings</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Property Deal
        </Button>
      </div>

      {showForm && (
        <PropertyDealsForm
          open={showForm}
          onOpenChange={setShowForm}
          propertyDeal={editingDeal}
          onSuccess={handleSuccess}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(deals) && deals.map((deal) => (
          <Card key={deal.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{deal.title}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{deal.propertyType}</Badge>
                    <Badge variant="outline">{deal.listingType}</Badge>
                    {deal.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(deal)}
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(deal.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {deal.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{deal.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg text-primary">₹{deal.price}</span>
                  <Badge variant={deal.isActive ? 'default' : 'secondary'}>
                    {deal.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {deal.city && (
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {deal.city}, {deal.stateProvince}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex gap-2">
              <Button
                variant={deal.isActive ? "outline" : "default"}
                size="sm"
                className="flex-1"
                onClick={() => toggleActive(deal.id)}
              >
                {deal.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant={deal.isFeatured ? "secondary" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => toggleFeatured(deal.id)}
              >
                {deal.isFeatured ? "Unfeature" : "Feature"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {(!deals || deals.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Property Deals Found</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first property deal</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Property Deal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Commercial Properties Section Component
function CommercialPropertiesSection() {
  const [properties, setProperties] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/admin/commercial-properties');
      const data = await response.json();
      setProperties(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching commercial properties:', error);
      setProperties([]);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingProperty(null);
    fetchProperties();
  };

  const handleEdit = (property: any) => {
    setEditingProperty(property);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this commercial property?')) return;
    try {
      const response = await fetch(`/api/admin/commercial-properties/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchProperties();
      }
    } catch (error) {
      console.error('Error deleting commercial property:', error);
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/commercial-properties/${id}/toggle-active`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchProperties();
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/commercial-properties/${id}/toggle-featured`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchProperties();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Local Market Commercial Properties</h2>
          <p className="text-muted-foreground">Manage commercial property listings</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Commercial Property
        </Button>
      </div>

      {showForm && (
        <CommercialPropertiesForm
          open={showForm}
          onOpenChange={setShowForm}
          property={editingProperty}
          onSuccess={handleSuccess}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(properties) && properties.map((property) => (
          <Card key={property.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{property.title}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{property.commercialType}</Badge>
                    <Badge variant="outline">{property.listingType}</Badge>
                    {property.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(property)}
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(property.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {property.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{property.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg text-primary">₹{property.price}</span>
                  <Badge variant={property.isActive ? 'default' : 'secondary'}>
                    {property.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {property.city && (
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {property.city}, {property.stateProvince}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex gap-2">
              <Button
                variant={property.isActive ? "outline" : "default"}
                size="sm"
                className="flex-1"
                onClick={() => toggleActive(property.id)}
              >
                {property.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant={property.isFeatured ? "secondary" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => toggleFeatured(property.id)}
              >
                {property.isFeatured ? "Unfeature" : "Feature"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {(!properties || properties.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Commercial Properties Found</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first commercial property listing</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Commercial Property
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Industrial Land Section Component
function IndustrialLandSection() {
  const [lands, setLands] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingLand, setEditingLand] = useState(null);

  useEffect(() => {
    fetchLands();
  }, []);

  const fetchLands = async () => {
    try {
      const response = await fetch('/api/admin/industrial-land');
      const data = await response.json();
      setLands(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching industrial land:', error);
      setLands([]);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingLand(null);
    fetchLands();
  };

  const handleEdit = (land: any) => {
    setEditingLand(land);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this industrial land?')) return;
    try {
      const response = await fetch(`/api/admin/industrial-land/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchLands();
      }
    } catch (error) {
      console.error('Error deleting industrial land:', error);
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/industrial-land/${id}/toggle-active`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchLands();
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/industrial-land/${id}/toggle-featured`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchLands();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Factory Industrial Land</h2>
          <p className="text-muted-foreground">Manage industrial land listings</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Industrial Land
        </Button>
      </div>

      {showForm && (
        <IndustrialLandForm
          open={showForm}
          onOpenChange={setShowForm}
          land={editingLand}
          onSuccess={handleSuccess}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(lands) && lands.map((land) => (
          <Card key={land.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{land.title}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{land.landType}</Badge>
                    <Badge variant="outline">{land.listingType}</Badge>
                    {land.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(land)}
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(land.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {land.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{land.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg text-primary">₹{land.price}</span>
                  <Badge variant={land.isActive ? 'default' : 'secondary'}>
                    {land.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {land.city && (
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {land.city}, {land.stateProvince}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex gap-2">
              <Button
                variant={land.isActive ? "outline" : "default"}
                size="sm"
                className="flex-1"
                onClick={() => toggleActive(land.id)}
              >
                {land.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant={land.isFeatured ? "secondary" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => toggleFeatured(land.id)}
              >
                {land.isFeatured ? "Unfeature" : "Feature"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {(!lands || lands.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Industrial Land Found</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first industrial land listing</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Industrial Land
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Office Spaces Section Component
function OfficeSpacesSection() {
  const [offices, setOffices] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingOffice, setEditingOffice] = useState(null);

  useEffect(() => {
    fetchOffices();
  }, []);

  const fetchOffices = async () => {
    try {
      const response = await fetch('/api/admin/office-spaces');
      const data = await response.json();
      setOffices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching office spaces:', error);
      setOffices([]);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingOffice(null);
    fetchOffices();
  };

  const handleEdit = (office: any) => {
    setEditingOffice(office);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this office space?')) return;
    try {
      const response = await fetch(`/api/admin/office-spaces/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchOffices();
      }
    } catch (error) {
      console.error('Error deleting office space:', error);
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/office-spaces/${id}/toggle-active`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchOffices();
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/office-spaces/${id}/toggle-featured`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchOffices();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Company Office Spaces</h2>
          <p className="text-muted-foreground">Manage office space listings</p>
        </div>
        <Button onClick={() => { setEditingOffice(null); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Office Space
        </Button>
      </div>

      {showForm && (
        <OfficeSpacesForm
          open={showForm}
          onOpenChange={(open) => {
            setShowForm(open);
            if (!open) setEditingOffice(null);
          }}
          office={editingOffice}
          onSuccess={handleSuccess}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(offices) && offices.map((office) => (
          <Card key={office.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{office.title}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{office.commercialType}</Badge>
                    <Badge variant="outline">{office.listingType}</Badge>
                    {office.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(office)}
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(office.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {office.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{office.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg text-primary">₹{office.price}</span>
                  <Badge variant={office.isActive ? 'default' : 'secondary'}>
                    {office.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {office.city && (
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {office.city}, {office.stateProvince}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex gap-2">
              <Button
                variant={office.isActive ? "outline" : "default"}
                size="sm"
                className="flex-1"
                onClick={() => toggleActive(office.id)}
              >
                {office.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant={office.isFeatured ? "secondary" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => toggleFeatured(office.id)}
              >
                {office.isFeatured ? "Unfeature" : "Feature"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {(!offices || offices.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Office Spaces Found</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first office space listing</p>
            <Button onClick={() => { setEditingOffice(null); setShowForm(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Office Space
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Rental Listings Section Component
function RentalListingsSection() {
  const [rentals, setRentals] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRental, setEditingRental] = useState(null);

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      const response = await fetch('/api/admin/rental-listings');
      const data = await response.json();
      setRentals(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching rental listings:', error);
      setRentals([]);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingRental(null);
    fetchRentals();
  };

  const handleEdit = (rental: any) => {
    setEditingRental(rental);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this rental listing?')) return;
    try {
      const response = await fetch(`/api/admin/rental-listings/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchRentals();
      }
    } catch (error) {
      console.error('Error deleting rental listing:', error);
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/rental-listings/${id}/toggle-active`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchRentals();
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/rental-listings/${id}/toggle-featured`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchRentals();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Rental – Rooms, Flats, Apartments</h2>
          <p className="text-muted-foreground">Manage rental property listings</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Rental Listing
        </Button>
      </div>

      {showForm && (
        <RentalListingsForm
          open={showForm}
          onOpenChange={setShowForm}
          rental={editingRental}
          onSuccess={handleSuccess}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(rentals) && rentals.map((rental) => (
          <Card key={rental.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{rental.title}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{rental.rentalType}</Badge>
                    {rental.furnishingStatus && <Badge variant="outline">{rental.furnishingStatus}</Badge>}
                    {rental.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(rental)}
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(rental.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {rental.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{rental.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg text-primary">₹{rental.price}/month</span>
                  <Badge variant={rental.isActive ? 'default' : 'secondary'}>
                    {rental.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {rental.city && (
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {rental.city}, {rental.stateProvince}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex gap-2">
              <Button
                variant={rental.isActive ? "outline" : "default"}
                size="sm"
                className="flex-1"
                onClick={() => toggleActive(rental.id)}
              >
                {rental.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant={rental.isFeatured ? "secondary" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => toggleFeatured(rental.id)}
              >
                {rental.isFeatured ? "Unfeature" : "Feature"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {(!rentals || rentals.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Rental Listings Found</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first rental listing</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Rental Listing
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Videos Section - manage all videos (create/edit/delete, toggle active/featured)
function VideosSection() {
  const [videos, setVideos] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<any>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/admin/videos');
      const data = await res.json();
      setVideos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setVideos([]);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingVideo(null);
    fetchVideos();
  };

  const handleEdit = (video: any) => {
    setEditingVideo(video);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    try {
      const response = await fetch(`/api/admin/videos/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchVideos();
      }
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/videos/${id}/toggle-active`, { method: 'PATCH' });
      if (response.ok) {
        fetchVideos();
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/videos/${id}/toggle-featured`, { method: 'PATCH' });
      if (response.ok) {
        fetchVideos();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Videos</h2>
          <p className="text-muted-foreground">Manage platform videos</p>
        </div>
        <Button onClick={() => { setEditingVideo(null); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Video
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={(open) => { setShowForm(open); if (!open) setEditingVideo(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingVideo ? 'Edit Video' : 'Add Video'}</DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            <VideosForm onSuccess={handleSuccess} video={editingVideo} />
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(videos) && videos.map((video) => (
          <Card key={video.id} className="group hover:shadow-lg transition-shadow">
            {(video.videoUrl || video.thumbnailUrl) && (
              <div className="relative h-40 bg-black">
                {video.videoUrl ? (
                  <video className="w-full h-full" preload="metadata" controls playsInline muted>
                    <source src={video.videoUrl} />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full" />
                )}
              </div>
            )}
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
                  {video.durationMinutes && <p className="text-sm text-muted-foreground mt-1">{video.durationMinutes} min</p>}
                </div>
                <Badge variant={video.isActive ? 'default' : 'secondary'}>{video.isActive ? 'Active' : 'Inactive'}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              {video.description && <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>}
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(video)}>
                <Edit className="w-4 h-4 mr-1" />Edit
              </Button>
              <Button variant={video.isFeatured ? 'secondary' : 'outline'} size="sm" className="flex-1" onClick={() => toggleFeatured(video.id)}>
                {video.isFeatured ? 'Unfeature' : 'Feature'}
              </Button>
              <Button variant="outline" size="sm" className="flex-1" onClick={() => toggleActive(video.id)}>
                {video.isActive ? 'Deactivate' : 'Activate'}
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(video.id)}>
                <Trash className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {(!videos || videos.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Video className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No videos. Start by adding your first video.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Featured Videos Section - list and manage featured videos
function FeaturedVideosSection() {
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/admin/videos');
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setVideos(list.filter((v: any) => !!v.isFeatured));
    } catch (err) {
      console.error('Error fetching featured videos:', err);
      setVideos([]);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/videos/${id}/toggle-featured`, { method: 'PATCH' });
      if (response.ok) {
        fetchVideos();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Featured Videos</h2>
          <p className="text-muted-foreground">Manage videos shown as featured on the site</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(videos) && videos.map((video) => (
          <Card key={video.id} className="group hover:shadow-lg transition-shadow">
            {(video.videoUrl || video.thumbnailUrl) && (
              <div className="relative h-40 bg-black">
                {video.videoUrl ? (
                  <video className="w-full h-full" preload="metadata" controls playsInline muted>
                    <source src={video.videoUrl} />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full" />
                )}
              </div>
            )}
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
                </div>
                <Badge variant={video.isActive ? 'default' : 'secondary'}>{video.isActive ? 'Active' : 'Inactive'}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              {video.description && <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>}
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant={video.isFeatured ? 'secondary' : 'outline'} size="sm" className="flex-1" onClick={() => toggleFeatured(video.id)}>
                {video.isFeatured ? 'Unfeature' : 'Feature'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState(() => {
    const saved = localStorage.getItem('activeSection');
    return saved || "dashboard";
  });

  const [loading] = useState(false);
  const { user, isLoading: userLoading } = useUser();
  const [, setLocation] = useLocation();

  const isAdmin = !!user && (
    user.role === 'admin' ||
    user.role === 'super_admin' ||
    user.accountType === 'admin' ||
    user.accountType === 'super_admin'
  );

  useEffect(() => {
    localStorage.setItem('activeSection', activeSection);
  }, [activeSection]);

  useEffect(() => {
    if (userLoading) return;
    if (!isAdmin) {
      setLocation('/login');
    }
  }, [isAdmin, userLoading, setLocation]);

  if (userLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Redirecting...</div>
      </div>
    );
  }

  const renderSection = () => {
    const slugify = (s: string) =>
      s
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const normalizedSection = slugify(activeSection);
    console.log('LanguageClassesForm loaded', normalizedSection);

    switch (normalizedSection) {
      case "dashboard":
        return <DashboardSection />;
      case "categories":
        return <CategoriesSection />;
      case "users":
        return <UsersSection />;
      case "agencies":
        return <AgenciesSection />;
      case "analytics":
        return <AnalyticsSection />;
      case "hostels-pg":
      case "hostel-pg":
        return <HostelsPgSection />;
      case "construction-building-materials":
      case "construction-building-material":
      case "construction-materials":
        return <ConstructionMaterialsSection />;
      case "property-deals":
        return <PropertyDealsSection />;
      case "commercial-properties":
      case "local-market-commercial-property":
      case "local-market-commercial-properties":
        return <CommercialPropertiesSection />;
      case "industrial-land":
      case "factory-industrial-land":
        return <IndustrialLandSection />;
      case "office-spaces":
      case "company-office-space":
        return <OfficeSpacesSection />;
      case "rental-listings":
      case "rental-rooms-flats-apartments":
      case "rental-rooms-flats-and-apartments":
        return <RentalListingsSection />;
      case "cars-bikes":
      case "carsbikes":
        return <CarsBikesSection />;
      case "heavy-equipment-for-sale":
      case "heavy-equipment":
      case "heavyequipment":
        return <HeavyEquipmentSection />;
      case "showrooms":
      case "showrooms-authorized-second-hand":
      case "authorized-second-hand-showrooms":
        return <ShowroomsSection />;
      case "second-hand-cars-bikes":
      case "second-hand-cars-and-bikes":
      case "secondhandcarsbikes":
        return <SecondHandCarsBikesSection />;
      case "car-bike-rentals":
      case "car-and-bike-rentals":
      case "carbikerentals":
        return <CarBikeRentalsSection />;
      case "vehicle-license-classes":
      case "vehiclelicenseclasses":
        return <VehicleLicenseClassesSection />;
      case "transportation-moving-services":
      case "transportation-and-moving-services":
      case "transportationmovingservices":
        return <TransportationMovingServicesSection />;
      case "electronics-gadgets":
      case "electronics-and-gadgets":
        return <ElectronicsGadgetsSection />;
      case "phones-tablets-accessories":
      case "new-phones-tablets-accessories":
        return <PhonesTabletsAccessoriesSection />;
      case "second-hand-phones-tablets-accessories":
      case "second-hand-phones-tablets-and-accessories":
        return <SecondHandPhonesTabletsAccessoriesSection />;
      case "computer-mobile-laptop-repair-services":
        return <ComputerMobileLaptopRepairServicesSection />;
      case "furniture-interior-decor":
      case "furniture-and-interior-decor":
        return <FurnitureInteriorDecorSection />;
      case "household-services":
        return <HouseholdServicesSection />;
      case "pharmacy-medical-stores":
        return <PharmacyMedicalStoresSection />;
      case "jewelry-accessories":
      case "jewelry-and-accessories":
        return <JewelryAccessoriesSection />;
      case "fashion-beauty-products":
      case "fashion-and-beauty-products":
        return <FashionBeautyProductsSection />;
      case "event-decoration-services":
      case "event-decoration":
      case "event-decoration-services-marriage-halls-parties-cafe-setup-decoration-materials":
      case "event-decoration-services-marriage-halls-parties-caf-setup-decoration-materials":
        return <EventDecorationServicesForm />;
      case "health-wellness-services":
        return <HealthWellnessServicesSection />;
      case "saree-shopping-clothing":
      case "saree-clothing-shopping":
        return <SareeClothingShoppingSection />;
      case "ebooks-online-courses":
      case "e-books-online-courses":
        return <EbooksOnlineCoursesSection />;
      case "tuition-private-classes":
      case "tuitionprivatclasses":
        return <TuitionPrivateClassesSection />;
      case "dance-karate-gym-yoga":
      case "dancekarategymyoga-classes":
        return <DanceKarateGymYogaSection />;
      case "language-classes":
      case "languageclasses":
        return <LanguageClassesSection />;
      case "academies-music-arts-sports":
      case "academies":
        return <AcademiesMusicArtsSportsSection />;
      case "skill-training-certification":
      case "skill-training--certification":
        return <SkillTrainingCertificationSection />;
      case "schools-colleges-coaching":
      case "schools-colleges-coaching-institutes":
      case "schools-colleges-coaching-institutes":
        return <SchoolsCollegesCoachingSection />;
      case "cricket-sports-training":
        return <CricketSportsTrainingSection />;
      case "educational-consultancy-study-abroad":
      case "educational-consultancy-study-abroad-section":
      case "educational-consultancy":
        return <EducationalConsultancyStudyAbroadSection />;
      case "service-centre-warranty":
      case "servicecentrewarranty":
        return <ServiceCentreWarrantyForm />;
      case "telecommunication-services":
      case "telecommunicationservices":
        return <TelecommunicationServicesForm />;
      case "cyber-cafe-internet-services":
      case "cybercafeinternetservices":
        return <CyberCafeInternetServicesForm />;
      case "professional-profile-expertise-listing":
      case "professional-services":
        return <ProfessionalServicesForm />;
      case "labor-worker-services":
        return <LaborWorkerServicesForm />;
      case "engineering-it-services":
        return <EngineeringITServicesForm />;
      case "legal-banking-loan-land-surveying-services":
        return <LegalBankingServicesForm />;
      case "insurance-services":
        return <InsuranceServicesForm />;
      case "ngos-social-services":
        return <NGOSocialServicesForm />;
      case "agents-agencies":
        return <AgentsAgenciesForm />;
      case "sliders":
        return <SlidersSection />;
      case "slider-card":
        return <SliderCardSection />;
      case "videos":
        return <VideosSection />;
      case "featured-videos":
        return <FeaturedVideosSection />;
      case "articles":
        return <ArticlesSection />;
      case "blogs":
      case "blog":
        return <BlogsSection />;
      case "contact-messages":
        return <ContactMessagesSection />;
      default:
        return <DashboardSection />;
    }
  };

  function ContactMessagesSection() {
    const [messages, setMessages] = useState<any[]>([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState<any>(null);
    const [showViewDialog, setShowViewDialog] = useState(false);

    useEffect(() => {
      fetchMessages();
    }, []);

    const fetchMessages = async () => {
      try {
        setLoadingMessages(true);
        const res = await fetch('/api/admin/contact-messages', {
          headers: { 'x-user-role': 'admin' },
        });
        if (!res.ok) {
          setMessages([]);
          setLoadingMessages(false);
          return;
        }
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching contact messages:', err);
        setMessages([]);
      } finally {
        setLoadingMessages(false);
      }
    };

    const handleView = async (msg: any) => {
      setSelectedMessage(msg);
      setShowViewDialog(true);
      if (!msg.isRead) {
        try {
          const res = await fetch(`/api/admin/contact-messages/${msg.id}/read`, {
            method: 'PATCH',
            headers: { 'x-user-role': 'admin' },
          });
          if (res.ok) fetchMessages();
        } catch (e) {
          console.error('Error marking message read', e);
        }
      }
    };

    const handleMarkRead = async (id: string) => {
      try {
        const res = await fetch(`/api/admin/contact-messages/${id}/read`, {
          method: 'PATCH',
          headers: { 'x-user-role': 'admin' },
        });
        if (res.ok) fetchMessages();
      } catch (e) {
        console.error('Error marking message read', e);
      }
    };

    const handleDelete = async (id: string) => {
      if (!confirm('Are you sure you want to delete this message?')) return;
      try {
        const res = await fetch(`/api/admin/contact-messages/${id}`, {
          method: 'DELETE',
          headers: { 'x-user-role': 'admin' },
        });
        if (res.ok) fetchMessages();
      } catch (e) {
        console.error('Error deleting message', e);
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Contact Messages</h2>
            <p className="text-muted-foreground">Messages submitted via contact form</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={fetchMessages}>
              Refresh
            </Button>
          </div>
        </div>

        {loadingMessages && (
          <Card>
            <CardContent className="py-8 text-center">Loading messages...</CardContent>
          </Card>
        )}

        {!loadingMessages && messages.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <h3 className="text-lg font-semibold mb-2">No messages</h3>
              <p className="text-muted-foreground">No contact form submissions yet.</p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {messages.map((m) => (
            <Card key={m.id} className="group hover:shadow-sm transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{m.name || 'Anonymous'}</CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {m.subject || 'No subject'} • {m.email || m.phone || 'No contact'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!m.isRead && <Badge className="bg-yellow-400 text-black">New</Badge>}
                    <span className="text-sm text-muted-foreground">{new Date(m.createdAt).toLocaleString()}</span>
                    <Button variant="ghost" size="icon" onClick={() => handleView(m)} title="View">
                      <Eye className="w-4 h-4" />
                    </Button>
                    {!m.isRead && (
                      <Button variant="ghost" size="icon" onClick={() => handleMarkRead(m.id)} title="Mark Read">
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(m.id)} title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {m.message && (
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{m.message}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <Dialog open={showViewDialog} onOpenChange={(open) => setShowViewDialog(open)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedMessage?.subject || 'Message'}</DialogTitle>
              <DialogDescription>Full message details</DialogDescription>
            </DialogHeader>
            {selectedMessage && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">From: {selectedMessage.name || 'Anonymous'}</p>
                    <p className="text-sm text-muted-foreground">{selectedMessage.email}</p>
                    {selectedMessage.phone && <p className="text-sm text-muted-foreground">{selectedMessage.phone}</p>}
                  </div>
                  <div className="text-sm text-muted-foreground">{new Date(selectedMessage.createdAt).toLocaleString()}</div>
                </div>

                <div>
                  <h3 className="font-semibold">Message</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                <div className="flex gap-2 justify-end">
                  {!selectedMessage.isRead && (
                    <Button onClick={() => handleMarkRead(selectedMessage.id)}>Mark Read</Button>
                  )}
                  <Button variant="destructive" onClick={() => { handleDelete(selectedMessage.id); setShowViewDialog(false); }}>Delete</Button>
                  <Button variant="outline" onClick={() => setShowViewDialog(false)}>Close</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center border-b px-6 bg-card">
            <SidebarTrigger className="-ml-1" />
            <div className="h-6 w-border bg-border mx-4" />
            <div>
              <h1 className="text-lg font-semibold capitalize">{activeSection.replace('-', ' ')}</h1>
            </div>
          </header>

          <main className="flex-1 p-6">
            {renderSection()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

// Tuition & Private Classes Section Component
function TuitionPrivateClassesSection() {
  const [classes, setClasses] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState<any>(null);
  const [viewingClass, setViewingClass] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/admin/tuition-private-classes?role=admin');
      const data = await response.json();
      console.log('Fetched tuition classes:', data);
      setClasses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching tuition classes:', error);
      setClasses([]);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingClass(null);
    fetchClasses();
  };

  const handleEdit = (classItem: any) => {
    setEditingClass(classItem);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this class?')) return;
    try {
      const response = await fetch(`/api/admin/tuition-private-classes/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchClasses();
      }
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  const handleViewDetails = (classItem: any) => {
    setViewingClass(classItem);
    setShowDetailsDialog(true);
  };

  const toggleActive = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/tuition-private-classes/${id}/toggle-active`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchClasses();
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/tuition-private-classes/${id}/toggle-featured`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchClasses();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tuition & Private Classes</h2>
          <p className="text-muted-foreground">Manage tuition and private class listings</p>
        </div>
        <Button onClick={() => {
          setEditingClass(null);
          setShowForm(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Class
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={(open) => {
        setShowForm(open);
        if (!open) setEditingClass(null);
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingClass ? 'Edit Tuition/Private Class' : 'Add New Tuition/Private Class'}</DialogTitle>
            <DialogDescription>Fill in the details to {editingClass ? 'update' : 'create'} a class listing</DialogDescription>
          </DialogHeader>
          <TuitionPrivateClassesForm onSuccess={handleSuccess} editingClass={editingClass} />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(classes) && classes.map((classItem) => (
          <Card key={classItem.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{classItem.title}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{classItem.subjectCategory}</Badge>
                    <Badge variant="outline">{classItem.teachingMode}</Badge>
                    <Badge variant="outline">{classItem.classType}</Badge>
                    {classItem.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleViewDetails(classItem)}
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(classItem)}
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(classItem.id)}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {classItem.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{classItem.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg text-primary">
                    ₹{classItem.feePerMonth || classItem.feePerHour || 'N/A'}
                    {classItem.feePerMonth ? '/month' : classItem.feePerHour ? '/hour' : ''}
                  </span>
                  <Badge variant={classItem.isActive ? 'default' : 'secondary'}>
                    {classItem.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {classItem.tutorName && (
                  <div className="text-sm">
                    <span className="font-medium">Tutor: </span>
                    <span className="text-muted-foreground">{classItem.tutorName}</span>
                  </div>
                )}
                {classItem.city && (
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {classItem.city}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex gap-2">
              <Button
                variant={classItem.isActive ? "outline" : "default"}
                size="sm"
                className="flex-1"
                onClick={() => toggleActive(classItem.id)}
              >
                {classItem.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant={classItem.isFeatured ? "secondary" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => toggleFeatured(classItem.id)}
              >
                {classItem.isFeatured ? "Unfeature" : "Feature"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* View Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{viewingClass?.title}</DialogTitle>
            <DialogDescription>Complete class details</DialogDescription>
          </DialogHeader>
          {viewingClass && (
            <div className="space-y-6">
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary">{viewingClass.subjectCategory}</Badge>
                <Badge variant="outline">{viewingClass.teachingMode}</Badge>
                <Badge variant="outline">{viewingClass.classType}</Badge>
                {viewingClass.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {viewingClass.feePerHour && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Fee Per Hour</p>
                    <p className="text-lg font-bold text-primary">₹{viewingClass.feePerHour}</p>
                  </div>
                )}
                {viewingClass.feePerMonth && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Fee Per Month</p>
                    <p className="text-lg font-bold text-primary">₹{viewingClass.feePerMonth}</p>
                  </div>
                )}
                {viewingClass.batchSize && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Batch Size</p>
                    <p className="text-lg font-bold">{viewingClass.batchSize}</p>
                  </div>
                )}
              </div>

              {viewingClass.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{viewingClass.description}</p>
                </div>
              )}

              {viewingClass.subjectsOffered && viewingClass.subjectsOffered.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Subjects Offered</h3>
                  <div className="flex flex-wrap gap-2">
                    {viewingClass.subjectsOffered.map((subject: string, idx: number) => (
                      <Badge key={idx} variant="outline">{subject}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Tutor Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Name:</span>
                    <span className="ml-2 text-muted-foreground">{viewingClass.tutorName}</span>
                  </div>
                  {viewingClass.tutorQualification && (
                    <div>
                      <span className="font-medium">Qualification:</span>
                      <span className="ml-2 text-muted-foreground">{viewingClass.tutorQualification}</span>
                    </div>
                  )}
                  {viewingClass.tutorExperienceYears && (
                    <div>
                      <span className="font-medium">Experience:</span>
                      <span className="ml-2 text-muted-foreground">{viewingClass.tutorExperienceYears} years</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {viewingClass.demoClassAvailable && <Badge variant="outline">Demo Class Available</Badge>}
                  {viewingClass.studyMaterialProvided && <Badge variant="outline">Study Material Provided</Badge>}
                  {viewingClass.testSeriesIncluded && <Badge variant="outline">Test Series Included</Badge>}
                  {viewingClass.doubtClearingSessions && <Badge variant="outline">Doubt Clearing Sessions</Badge>}
                  {viewingClass.flexibleTimings && <Badge variant="outline">Flexible Timings</Badge>}
                  {viewingClass.weekendClasses && <Badge variant="outline">Weekend Classes</Badge>}
                  {viewingClass.homeTuitionAvailable && <Badge variant="outline">Home Tuition Available</Badge>}
                  {viewingClass.onlineClassesAvailable && <Badge variant="outline">Online Classes Available</Badge>}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Contact Information
                </h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Contact Person:</span> {viewingClass.contactPerson}</p>
                  <p><span className="font-medium">Phone:</span> {viewingClass.contactPhone}</p>
                  {viewingClass.contactEmail && <p><span className="font-medium">Email:</span> {viewingClass.contactEmail}</p>}
                </div>
              </div>

              {viewingClass.fullAddress && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Address:</span> {viewingClass.fullAddress}</p>
                    {viewingClass.areaName && <p><span className="font-medium">Area:</span> {viewingClass.areaName}</p>}
                    {viewingClass.city && <p><span className="font-medium">City:</span> {viewingClass.city}</p>}
                    {viewingClass.stateProvince && <p><span className="font-medium">State:</span> {viewingClass.stateProvince}</p>}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t text-sm text-muted-foreground">
                <p>Created: {new Date(viewingClass.createdAt).toLocaleString()}</p>
                <p>Last Updated: {new Date(viewingClass.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {(!classes || classes.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Classes Found</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first tuition/private class</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Class
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Dance, Karate, Gym, Yoga Section Component
function DanceKarateGymYogaSection() {
  const [classes, setClasses] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState<any>(null);
  const [viewingClass, setViewingClass] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      // Get user from localStorage
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      // Build query params for admin or user-specific filtering
      const queryParams = new URLSearchParams();
      if (user) {
        queryParams.append('userId', user.id);
        queryParams.append('role', user.role || 'user');
      }

      const url = `/api/admin/dance-karate-gym-yoga${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await fetch(url, { credentials: 'include' });
      const data = await response.json();
      setClasses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching dance/karate/gym/yoga classes:', error);
      setClasses([]);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingClass(null);
    fetchClasses();
  };

  const handleEdit = (classItem: any) => {
    setEditingClass(classItem);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this class?')) return;
    try {
      const response = await fetch(`/api/admin/dance-karate-gym-yoga/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchClasses();
      }
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  const handleViewDetails = (classItem: any) => {
    setViewingClass(classItem);
    setShowDetailsDialog(true);
  };

  const toggleActive = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/dance-karate-gym-yoga/${id}/toggle-active`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchClasses();
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/dance-karate-gym-yoga/${id}/toggle-featured`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchClasses();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dance, Karate, Gym & Yoga Classes</h2>
          <p className="text-muted-foreground">Manage fitness and martial arts class listings</p>
        </div>
        <Button onClick={() => {
          setEditingClass(null);
          setShowForm(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Class
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={(open) => {
        setShowForm(open);
        if (!open) setEditingClass(null);
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingClass ? 'Edit' : 'Add New'} Dance/Karate/Gym/Yoga Class</DialogTitle>
            <DialogDescription>Fill in the details to {editingClass ? 'update' : 'create'} a class listing</DialogDescription>
          </DialogHeader>
          <DanceKarateGymYogaForm onSuccess={handleSuccess} editingClass={editingClass} />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(classes) && classes.map((classItem) => (
          <Card key={classItem.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{classItem.title}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{classItem.classCategory}</Badge>
                    <Badge variant="outline">{classItem.classType}</Badge>
                    {classItem.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleViewDetails(classItem)}
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(classItem)}
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(classItem.id)}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {classItem.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{classItem.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg text-primary">₹{classItem.feePerMonth}/month</span>
                  <Badge variant={classItem.isActive ? 'default' : 'secondary'}>
                    {classItem.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {classItem.instructorName && (
                  <div className="text-sm">
                    <span className="font-medium">Instructor: </span>
                    <span className="text-muted-foreground">{classItem.instructorName}</span>
                  </div>
                )}
                {classItem.batchSize && (
                  <div className="text-sm">
                    <span className="font-medium">Batch Size: </span>
                    <span className="text-muted-foreground">{classItem.batchSize} students</span>
                  </div>
                )}
                {classItem.city && (
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {classItem.city}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex gap-2">
              <Button
                variant={classItem.isActive ? "outline" : "default"}
                size="sm"
                className="flex-1"
                onClick={() => toggleActive(classItem.id)}
              >
                {classItem.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant={classItem.isFeatured ? "secondary" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => toggleFeatured(classItem.id)}
              >
                {classItem.isFeatured ? "Unfeature" : "Feature"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* View Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{viewingClass?.title}</DialogTitle>
            <DialogDescription>Complete class details</DialogDescription>
          </DialogHeader>
          {viewingClass && (
            <div className="space-y-6">
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary">{viewingClass.classCategory}</Badge>
                <Badge variant="outline">{viewingClass.skillLevel}</Badge>
                {viewingClass.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {viewingClass.feePerMonth && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Fee Per Month</p>
                    <p className="text-lg font-bold text-primary">₹{viewingClass.feePerMonth}</p>
                  </div>
                )}
                {viewingClass.feePerSession && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Fee Per Session</p>
                    <p className="text-lg font-bold">₹{viewingClass.feePerSession}</p>
                  </div>
                )}
                {viewingClass.sessionDurationMinutes && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="text-lg font-bold">{viewingClass.sessionDurationMinutes} min</p>
                  </div>
                )}
                {viewingClass.batchSize && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Batch Size</p>
                    <p className="text-lg font-bold">{viewingClass.batchSize}</p>
                  </div>
                )}
              </div>

              {viewingClass.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{viewingClass.description}</p>
                </div>
              )}

              {viewingClass.instructorName && (
                <div>
                  <h3 className="font-semibold mb-2">Instructor Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Name:</span>
                      <span className="ml-2 text-muted-foreground">{viewingClass.instructorName}</span>
                    </div>
                    {viewingClass.instructorQualification && (
                      <div>
                        <span className="font-medium">Qualification:</span>
                        <span className="ml-2 text-muted-foreground">{viewingClass.instructorQualification}</span>
                      </div>
                    )}
                    {viewingClass.instructorExperienceYears && (
                      <div>
                        <span className="font-medium">Experience:</span>
                        <span className="ml-2 text-muted-foreground">{viewingClass.instructorExperienceYears} years</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {(viewingClass.sessionDurationMinutes || viewingClass.registrationFee) && (
                <div>
                  <h3 className="font-semibold mb-2">Class Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {viewingClass.sessionDurationMinutes && (
                      <div>
                        <span className="font-medium">Session Duration:</span>
                        <span className="ml-2 text-muted-foreground">{viewingClass.sessionDurationMinutes} minutes</span>
                      </div>
                    )}
                    {viewingClass.registrationFee && (
                      <div>
                        <span className="font-medium">Registration Fee:</span>
                        <span className="ml-2 text-muted-foreground">₹{viewingClass.registrationFee}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {viewingClass.trialClassAvailable && <Badge variant="outline">Trial Class Available</Badge>}
                  {viewingClass.certificationProvided && <Badge variant="outline">Certification Provided</Badge>}
                  {viewingClass.equipmentProvided && <Badge variant="outline">Equipment Provided</Badge>}
                  {viewingClass.weekendBatches && <Badge variant="outline">Weekend Batches</Badge>}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Contact Information
                </h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Contact Person:</span> {viewingClass.contactPerson}</p>
                  <p><span className="font-medium">Phone:</span> {viewingClass.contactPhone}</p>
                  {viewingClass.contactEmail && <p><span className="font-medium">Email:</span> {viewingClass.contactEmail}</p>}
                </div>
              </div>

              {viewingClass.fullAddress && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Address:</span> {viewingClass.fullAddress}</p>
                    {viewingClass.areaName && <p><span className="font-medium">Area:</span> {viewingClass.areaName}</p>}
                    {viewingClass.city && <p><span className="font-medium">City:</span> {viewingClass.city}</p>}
                    {viewingClass.stateProvince && <p><span className="font-medium">State:</span> {viewingClass.stateProvince}</p>}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t text-sm text-muted-foreground">
                <p>Created: {new Date(viewingClass.createdAt).toLocaleString()}</p>
                <p>Last Updated: {new Date(viewingClass.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {(!classes || classes.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Classes Found</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first dance, karate, gym, or yoga class</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Class
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Language Classes Section Component
function LanguageClassesSection() {
  const { user } = useUser();
  const [classes, setClasses] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState<any>(null);
  const [viewingClass, setViewingClass] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, [user]);

  const fetchClasses = async () => {
    try {
      const params = new URLSearchParams();
      if (user?.id) params.append('userId', user.id.toString());
      if (user?.role) params.append('role', user.role);

      const url = `/api/admin/language-classes${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url, { credentials: 'include' });
      const data = await response.json();
      setClasses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching language classes:', error);
      setClasses([]);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingClass(null);
    fetchClasses();
  };

  const handleEdit = (classItem: any) => {
    setEditingClass(classItem);
    setShowForm(true);
  };

  const handleViewDetails = (classItem: any) => {
    setViewingClass(classItem);
    setShowDetailsDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this class?')) return;
    try {
      const response = await fetch(`/api/admin/language-classes/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchClasses();
      }
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/language-classes/${id}/toggle-active`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchClasses();
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/language-classes/${id}/toggle-featured`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchClasses();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Language Classes</h2>
          <p className="text-muted-foreground">Manage language learning class listings</p>
        </div>
        <Button onClick={() => {
          setEditingClass(null);
          setShowForm(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Language Class
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={(open) => {
        setShowForm(open);
        if (!open) setEditingClass(null);
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingClass ? 'Edit Language Class' : 'Add New Language Class'}</DialogTitle>
            <DialogDescription>Fill in the details to {editingClass ? 'update' : 'create'} a language class listing</DialogDescription>
          </DialogHeader>
          <LanguageClassesForm onSuccess={handleSuccess} editingClass={editingClass} />
        </DialogContent>
      </Dialog>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{viewingClass?.title}</DialogTitle>
            <DialogDescription>Complete language class details</DialogDescription>
          </DialogHeader>
          {viewingClass && (
            <div className="space-y-6">
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary">{viewingClass.languageName}</Badge>
                <Badge variant="outline">{viewingClass.proficiencyLevel}</Badge>
                {viewingClass.teachingMode && <Badge variant="outline">{viewingClass.teachingMode}</Badge>}
                {viewingClass.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Fee Per Month</p>
                  <p className="text-lg font-bold text-primary">₹{Number(viewingClass.feePerMonth).toLocaleString()}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="text-lg font-bold">{viewingClass.courseDurationMonths} months</p>
                </div>
                {viewingClass.classesPerWeek && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Classes/Week</p>
                    <p className="text-lg font-bold">{viewingClass.classesPerWeek}</p>
                  </div>
                )}
                {viewingClass.batchSize && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Batch Size</p>
                    <p className="text-lg font-bold">{viewingClass.batchSize} students</p>
                  </div>
                )}
              </div>

              {viewingClass.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{viewingClass.description}</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Class Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Class Type:</span>
                    <span className="ml-2 text-muted-foreground capitalize">{viewingClass.classType}</span>
                  </div>
                  {viewingClass.classDurationHours && (
                    <div>
                      <span className="font-medium">Class Duration:</span>
                      <span className="ml-2 text-muted-foreground">{viewingClass.classDurationHours} hours</span>
                    </div>
                  )}
                  {viewingClass.instructorName && (
                    <div>
                      <span className="font-medium">Instructor:</span>
                      <span className="ml-2 text-muted-foreground">{viewingClass.instructorName}</span>
                    </div>
                  )}
                  {viewingClass.instructorQualification && (
                    <div>
                      <span className="font-medium">Qualification:</span>
                      <span className="ml-2 text-muted-foreground">{viewingClass.instructorQualification}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {viewingClass.certificationProvided && <Badge variant="outline">Certification Provided</Badge>}
                  {viewingClass.freeDemoClass && <Badge variant="outline">Free Demo Class</Badge>}
                  {viewingClass.nativeSpeaker && <Badge variant="outline">Native Speaker</Badge>}
                </div>
              </div>

              {viewingClass.studyMaterialsProvided && viewingClass.studyMaterialsProvided.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Study Materials</h3>
                  <div className="flex flex-wrap gap-2">
                    {viewingClass.studyMaterialsProvided.map((material: string, idx: number) => (
                      <Badge key={idx} variant="secondary">{material}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Contact Information
                </h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Contact Person:</span> {viewingClass.contactPerson}</p>
                  <p><span className="font-medium">Phone:</span> {viewingClass.contactPhone}</p>
                  {viewingClass.contactEmail && <p><span className="font-medium">Email:</span> {viewingClass.contactEmail}</p>}
                </div>
              </div>

              {viewingClass.fullAddress && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Address:</span> {viewingClass.fullAddress}</p>
                    {viewingClass.areaName && <p><span className="font-medium">Area:</span> {viewingClass.areaName}</p>}
                    {viewingClass.city && <p><span className="font-medium">City:</span> {viewingClass.city}</p>}
                    {viewingClass.stateProvince && <p><span className="font-medium">State:</span> {viewingClass.stateProvince}</p>}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t text-sm text-muted-foreground">
                <p>Created: {new Date(viewingClass.createdAt).toLocaleString()}</p>
                <p>Last Updated: {new Date(viewingClass.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(classes) && classes.map((classItem) => (
          <Card key={classItem.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{classItem.title}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{classItem.languageName}</Badge>
                    <Badge variant="outline">{classItem.proficiencyLevel}</Badge>
                    {classItem.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleViewDetails(classItem)}
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(classItem)}
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(classItem.id)}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {classItem.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{classItem.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg text-primary">₹{Number(classItem.feePerMonth).toLocaleString()}/month</span>
                  <Badge variant={classItem.isActive ? 'default' : 'secondary'}>
                    {classItem.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {classItem.instructorName && (
                  <div className="text-sm">
                    <span className="font-medium">Instructor: </span>
                    <span className="text-muted-foreground">{classItem.instructorName}</span>
                  </div>
                )}
                {classItem.city && (
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {classItem.city}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex gap-2">
              <Button
                variant={classItem.isActive ? "outline" : "default"}
                size="sm"
                className="flex-1"
                onClick={() => toggleActive(classItem.id)}
              >
                {classItem.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant={classItem.isFeatured ? "secondary" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => toggleFeatured(classItem.id)}
              >
                {classItem.isFeatured ? "Unfeature" : "Feature"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {(!classes || classes.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Language Classes Found</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first language class listing</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Language Class
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Academies - Music, Arts, Sports Section Component
function AcademiesMusicArtsSportsSection() {
  const [academies, setAcademies] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAcademy, setEditingAcademy] = useState<any>(null);
  const [viewingAcademy, setViewingAcademy] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    fetchAcademies();
  }, []);

  const fetchAcademies = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      const queryParams = new URLSearchParams();

      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData.role === 'admin') {
          queryParams.append('role', 'admin');
        } else {
          queryParams.append('userId', userData.id);
          queryParams.append('role', userData.role || 'user');
        }
      }

      const response = await fetch(`/api/admin/academies-music-arts-sports?${queryParams.toString()}`);
      const data = await response.json();
      setAcademies(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching academies:', error);
      setAcademies([]);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingAcademy(null);
    fetchAcademies();
  };

  const handleEdit = (academy: any) => {
    setEditingAcademy(academy);
    setShowForm(true);
  };

  const handleViewDetails = (academy: any) => {
    setViewingAcademy(academy);
    setShowDetailsDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this academy?')) return;
    try {
      const response = await fetch(`/api/admin/academies-music-arts-sports/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchAcademies();
      }
    } catch (error) {
      console.error('Error deleting academy:', error);
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/academies-music-arts-sports/${id}/toggle-active`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchAcademies();
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/academies-music-arts-sports/${id}/toggle-featured`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchAcademies();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Academies - Music, Arts & Sports</h2>
          <p className="text-muted-foreground">Manage academy listings</p>
        </div>
        <Button onClick={() => {
          setEditingAcademy(null);
          setShowForm(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Academy
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={(open) => {
        setShowForm(open);
        if (!open) setEditingAcademy(null);
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAcademy ? 'Edit Academy' : 'Add New Academy'}</DialogTitle>
            <DialogDescription>Fill in the details to {editingAcademy ? 'update' : 'create'} an academy listing</DialogDescription>
          </DialogHeader>
          <AcademiesMusicArtsSportsForm onSuccess={handleSuccess} editingAcademy={editingAcademy} />
        </DialogContent>
      </Dialog>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{viewingAcademy?.title}</DialogTitle>
            <DialogDescription>Complete academy details</DialogDescription>
          </DialogHeader>
          {viewingAcademy && (
            <div className="space-y-6">
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary">{viewingAcademy.academyCategory}</Badge>
                {viewingAcademy.specialization && <Badge variant="outline">{viewingAcademy.specialization}</Badge>}
                {viewingAcademy.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Fee Per Month</p>
                  <p className="text-lg font-bold text-primary">₹{Number(viewingAcademy.feePerMonth).toLocaleString()}</p>
                </div>
                {viewingAcademy.admissionFee && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Admission Fee</p>
                    <p className="text-lg font-bold">₹{Number(viewingAcademy.admissionFee).toLocaleString()}</p>
                  </div>
                )}
                {viewingAcademy.establishedYear && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Established</p>
                    <p className="text-lg font-bold">{viewingAcademy.establishedYear}</p>
                  </div>
                )}
                {viewingAcademy.totalInstructors && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Instructors</p>
                    <p className="text-lg font-bold">{viewingAcademy.totalInstructors}</p>
                  </div>
                )}
              </div>

              {viewingAcademy.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{viewingAcademy.description}</p>
                </div>
              )}

              {viewingAcademy.coursesOffered && viewingAcademy.coursesOffered.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Courses Offered</h3>
                  <div className="flex flex-wrap gap-2">
                    {viewingAcademy.coursesOffered.map((course: string, idx: number) => (
                      <Badge key={idx} variant="outline">{course}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {viewingAcademy.facilities && viewingAcademy.facilities.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Facilities</h3>
                  <div className="flex flex-wrap gap-2">
                    {viewingAcademy.facilities.map((facility: string, idx: number) => (
                      <Badge key={idx} variant="secondary">{facility}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Instructor Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {viewingAcademy.headInstructor && (
                    <div>
                      <span className="font-medium">Head Instructor:</span>
                      <span className="ml-2 text-muted-foreground">{viewingAcademy.headInstructor}</span>
                    </div>
                  )}
                  {viewingAcademy.instructorQualification && (
                    <div>
                      <span className="font-medium">Qualification:</span>
                      <span className="ml-2 text-muted-foreground">{viewingAcademy.instructorQualification}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Contact Information
                </h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Contact Person:</span> {viewingAcademy.contactPerson}</p>
                  <p><span className="font-medium">Phone:</span> {viewingAcademy.contactPhone}</p>
                  {viewingAcademy.contactEmail && <p><span className="font-medium">Email:</span> {viewingAcademy.contactEmail}</p>}
                  {viewingAcademy.website && <p><span className="font-medium">Website:</span> <a href={viewingAcademy.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{viewingAcademy.website}</a></p>}
                </div>
              </div>

              {viewingAcademy.fullAddress && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Address:</span> {viewingAcademy.fullAddress}</p>
                    {viewingAcademy.areaName && <p><span className="font-medium">Area:</span> {viewingAcademy.areaName}</p>}
                    {viewingAcademy.city && <p><span className="font-medium">City:</span> {viewingAcademy.city}</p>}
                    {viewingAcademy.stateProvince && <p><span className="font-medium">State:</span> {viewingAcademy.stateProvince}</p>}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t text-sm text-muted-foreground">
                <p>Created: {new Date(viewingAcademy.createdAt).toLocaleString()}</p>
                <p>Last Updated: {new Date(viewingAcademy.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(academies) && academies.map((academy) => (
          <Card key={academy.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{academy.title}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{academy.academyCategory}</Badge>
                    {academy.specialization && <Badge variant="outline">{academy.specialization}</Badge>}
                    {academy.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleViewDetails(academy)}
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(academy)}
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(academy.id)}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {academy.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{academy.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg text-primary">₹{Number(academy.feePerMonth).toLocaleString()}/month</span>
                  <Badge variant={academy.isActive ? 'default' : 'secondary'}>
                    {academy.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {academy.headInstructor && (
                  <div className="text-sm">
                    <span className="font-medium">Head Instructor: </span>
                    <span className="text-muted-foreground">{academy.headInstructor}</span>
                  </div>
                )}
                {academy.city && (
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {academy.city}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex gap-2">
              <Button
                variant={academy.isActive ? "outline" : "default"}
                size="sm"
                className="flex-1"
                onClick={() => toggleActive(academy.id)}
              >
                {academy.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant={academy.isFeatured ? "secondary" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => toggleFeatured(academy.id)}
              >
                {academy.isFeatured ? "Unfeature" : "Feature"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {(!academies || academies.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Academies Found</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first academy</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Academy
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Skill Training & Certification Section Component
function SkillTrainingCertificationSection() {
  const [trainings, setTrainings] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTraining, setEditingTraining] = useState<any>(null);
  const [viewingTraining, setViewingTraining] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      const response = await fetch('/api/admin/skill-training-certification');
      const data = await response.json();
      setTrainings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching skill trainings:', error);
      setTrainings([]);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingTraining(null);
    fetchTrainings();
  };

  const handleViewDetails = (training: any) => {
    setViewingTraining(training);
    setShowDetailsDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this training?')) return;
    try {
      const response = await fetch(`/api/admin/skill-training-certification/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchTrainings();
      }
    } catch (error) {
      console.error('Error deleting training:', error);
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/skill-training-certification/${id}/toggle-active`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchTrainings();
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/skill-training-certification/${id}/toggle-featured`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchTrainings();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Skill Training & Certification</h2>
          <p className="text-muted-foreground">Manage skill training and certification programs</p>
        </div>
        <Button onClick={() => { setEditingTraining(null); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Training Program
        </Button>
      </div>

      <Dialog
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) setEditingTraining(null);
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTraining ? 'Edit Training Program' : 'Add New Training Program'}</DialogTitle>
            <DialogDescription>
              Fill in the details to {editingTraining ? 'update' : 'create'} a skill training & certification program
            </DialogDescription>
          </DialogHeader>
          <SkillTrainingCertificationForm onSuccess={handleSuccess} editingTraining={editingTraining} />
        </DialogContent>
      </Dialog>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{viewingTraining?.title}</DialogTitle>
            <DialogDescription>Complete training program details</DialogDescription>
          </DialogHeader>
          {viewingTraining && (
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                {viewingTraining.skillCategory && <Badge variant="secondary">{viewingTraining.skillCategory}</Badge>}
                {viewingTraining.trainingType && <Badge variant="outline">{viewingTraining.trainingType}</Badge>}
                {viewingTraining.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
              </div>
              {viewingTraining.description && (
                <div>
                  <p className="text-muted-foreground whitespace-pre-wrap">{viewingTraining.description}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {viewingTraining.instituteName && (
                  <div>
                    <span className="font-medium">Institute:</span>
                    <span className="ml-2 text-muted-foreground">{viewingTraining.instituteName}</span>
                  </div>
                )}
                {viewingTraining.totalFee && (
                  <div>
                    <span className="font-medium">Total Fee:</span>
                    <span className="ml-2 text-muted-foreground">₹{viewingTraining.totalFee}</span>
                  </div>
                )}
                {(viewingTraining.city || viewingTraining.stateProvince) && (
                  <div>
                    <span className="font-medium">Location:</span>
                    <span className="ml-2 text-muted-foreground">{[viewingTraining.city, viewingTraining.stateProvince].filter(Boolean).join(', ')}</span>
                  </div>
                )}
                {viewingTraining.contactPhone && (
                  <div>
                    <span className="font-medium">Phone:</span>
                    <span className="ml-2 text-muted-foreground">{viewingTraining.contactPhone}</span>
                  </div>
                )}
                {viewingTraining.contactEmail && (
                  <div>
                    <span className="font-medium">Email:</span>
                    <span className="ml-2 text-muted-foreground">{viewingTraining.contactEmail}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(trainings) && trainings.map((training) => (
          <Card key={training.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{training.title}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{training.skillCategory}</Badge>
                    <Badge variant="outline">{training.trainingType}</Badge>
                    {training.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleViewDetails(training)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => { setEditingTraining(training); setShowForm(true); }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(training.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">

                {training.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{training.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg text-primary">₹{training.totalFee}</span>
                  <Badge variant={training.isActive ? 'default' : 'secondary'}>
                    {training.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-0 flex gap-2">
              <Button
                variant={training.isActive ? "outline" : "default"}
                size="sm"
                className="flex-1"
                onClick={() => toggleActive(training.id)}
              >
                {training.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant={training.isFeatured ? "secondary" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => toggleFeatured(training.id)}
              >
                {training.isFeatured ? "Unfeature" : "Feature"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {(!trainings || trainings.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Training Programs Found</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first skill training program</p>
            <Button onClick={() => { setEditingTraining(null); setShowForm(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Training Program
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Schools, Colleges & Coaching Institutes Section Component
function SchoolsCollegesCoachingSection() {
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingInstitution, setEditingInstitution] = useState<any>(null);
  const [viewingInstitution, setViewingInstitution] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    try {
      const response = await fetch('/api/admin/schools-colleges-coaching');
      const data = await response.json();
      setInstitutions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching institutions:', error);
      setInstitutions([]);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingInstitution(null);
    fetchInstitutions();
  };

  const handleViewDetails = (institution: any) => {
    setViewingInstitution(institution);
    setShowDetailsDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this institution?')) return;
    try {
      const response = await fetch(`/api/admin/schools-colleges-coaching/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchInstitutions();
      }
    } catch (error) {
      console.error('Error deleting institution:', error);
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/schools-colleges-coaching/${id}/toggle-active`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchInstitutions();
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/schools-colleges-coaching/${id}/toggle-featured`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchInstitutions();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Schools, Colleges & Coaching Institutes</h2>
          <p className="text-muted-foreground">Manage educational institution listings</p>
        </div>
        <Button onClick={() => { setEditingInstitution(null); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Institution
        </Button>
      </div>

      <Dialog
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) setEditingInstitution(null);
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingInstitution ? 'Edit Institution' : 'Add New Educational Institution'}</DialogTitle>
            <DialogDescription>
              Fill in the details to {editingInstitution ? 'update' : 'create'} a new institution listing
            </DialogDescription>
          </DialogHeader>
          <SchoolsCollegesCoachingForm onSuccess={handleSuccess} editingInstitution={editingInstitution} />
        </DialogContent>
      </Dialog>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{viewingInstitution?.institutionName}</DialogTitle>
            <DialogDescription>Complete institution details</DialogDescription>
          </DialogHeader>
          {viewingInstitution && (
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                {viewingInstitution.listingType && <Badge variant="secondary">{viewingInstitution.listingType}</Badge>}
                {viewingInstitution.institutionType && <Badge variant="outline">{viewingInstitution.institutionType}</Badge>}
                {viewingInstitution.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
              </div>
              {viewingInstitution.description && (
                <div>
                  <p className="text-muted-foreground whitespace-pre-wrap">{viewingInstitution.description}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {viewingInstitution.title && (
                  <div>
                    <span className="font-medium">Title:</span>
                    <span className="ml-2 text-muted-foreground">{viewingInstitution.title}</span>
                  </div>
                )}
                {viewingInstitution.city && (
                  <div>
                    <span className="font-medium">City:</span>
                    <span className="ml-2 text-muted-foreground">{viewingInstitution.city}</span>
                  </div>
                )}
                {viewingInstitution.fullAddress && (
                  <div className="col-span-2">
                    <span className="font-medium">Address:</span>
                    <span className="ml-2 text-muted-foreground">{viewingInstitution.fullAddress}</span>
                  </div>
                )}
                {viewingInstitution.contactPerson && (
                  <div>
                    <span className="font-medium">Contact:</span>
                    <span className="ml-2 text-muted-foreground">{viewingInstitution.contactPerson}</span>
                  </div>
                )}
                {viewingInstitution.contactPhone && (
                  <div>
                    <span className="font-medium">Phone:</span>
                    <span className="ml-2 text-muted-foreground">{viewingInstitution.contactPhone}</span>
                  </div>
                )}
                {viewingInstitution.contactEmail && (
                  <div>
                    <span className="font-medium">Email:</span>
                    <span className="ml-2 text-muted-foreground">{viewingInstitution.contactEmail}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(institutions) && institutions.map((institution) => (
          <Card key={institution.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{institution.institutionName}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{institution.listingType}</Badge>
                    <Badge variant="outline">{institution.institutionType}</Badge>
                    {institution.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleViewDetails(institution)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => { setEditingInstitution(institution); setShowForm(true); }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(institution.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">

                {institution.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{institution.description}</p>
                )}
                <div className="flex items-center justify-between">
                  {institution.annualTuitionFee && (
                    <span className="font-semibold text-lg text-primary">₹{institution.annualTuitionFee}/year</span>
                  )}
                  <Badge variant={institution.isActive ? 'default' : 'secondary'}>
                    {institution.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {institution.city && (
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {institution.city}
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="pt-0 flex gap-2">
              <Button
                variant={institution.isActive ? "outline" : "default"}
                size="sm"
                className="flex-1"
                onClick={() => toggleActive(institution.id)}
              >
                {institution.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant={institution.isFeatured ? "secondary" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => toggleFeatured(institution.id)}
              >
                {institution.isFeatured ? "Unfeature" : "Feature"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {(!institutions || institutions.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Institutions Found</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first educational institution</p>
            <Button onClick={() => { setEditingInstitution(null); setShowForm(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Institution
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ... (rest of the code remains the same)
function CarsBikesSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Cars & Bikes</h2>
          <p className="text-muted-foreground">Manage vehicle listings for cars and bikes</p>
        </div>
      </div>
      <CarsBikesForm />
    </div>
  );
}

// Heavy Equipment Section Component
function HeavyEquipmentSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Heavy Equipment for Sale</h2>
          <p className="text-muted-foreground">Manage heavy equipment listings</p>
        </div>
      </div>
      <HeavyEquipmentForm />
    </div>
  );
}

// Showrooms Section Component
function ShowroomsSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Showrooms (Authorized Second-hand)</h2>
          <p className="text-muted-foreground">Manage authorized second-hand vehicle showrooms</p>
        </div>
      </div>
      <ShowroomsForm />
    </div>
  );
}

// Second Hand Cars & Bikes Section Component
function SecondHandCarsBikesSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Second Hand Cars & Bikes</h2>
          <p className="text-muted-foreground">Manage second-hand vehicle listings</p>
        </div>
      </div>
      <SecondHandCarsBikesForm />
    </div>
  );
}

// Car & Bike Rentals Section Component
function CarBikeRentalsSection() {
  return (
    <div className="space-y-6">

      <CarBikeRentalsForm />
    </div>
  );
}

// Transportation & Moving Services Section Component
function TransportationMovingServicesSection() {
  return (
    <div className="space-y-6">
      <TransportationMovingServicesForm />
    </div>
  );
}

// Vehicle License Classes Section Component
function VehicleLicenseClassesSection() {
  return (
    <div className="space-y-6">

      <VehicleLicenseClassesForm />
    </div>
  );
}

// Electronics & Gadgets Section Component
function ElectronicsGadgetsSection() {
  return (
    <div className="space-y-6">
    
      <ElectronicsGadgetsForm />
    </div>
  );
}

// Phones, Tablets & Accessories Section Component
function PhonesTabletsAccessoriesSection() {
  return (
    <div className="space-y-6">
     
      <PhonesTabletsAccessoriesForm />
    </div>
  );
}

// Second Hand Phones, Tablets & Accessories Section Component
function SecondHandPhonesTabletsAccessoriesSection() {
  return (
    <div className="space-y-6">
     
      <SecondHandPhonesTabletsAccessoriesForm />
    </div>
  );
}

// Computer, Mobile & Laptop Repair Services Section Component
function ComputerMobileLaptopRepairServicesSection() {
  return (
    <div className="space-y-6">
      
      <ComputerMobileLaptopRepairServicesForm />
    </div>
  );
}

// Furniture & Interior Decor Section Component
function FurnitureInteriorDecorSection() {
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [viewingItem, setViewingItem] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/admin/furniture-interior-decor');
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching furniture items:', error);
      setItems([]);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingItem(null);
    fetchItems();
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const response = await fetch(`/api/admin/furniture-interior-decor/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchItems();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleViewDetails = (item: any) => {
    setViewingItem(item);
    setShowDetailsDialog(true);
  };

  const toggleActive = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/furniture-interior-decor/${id}/toggle-active`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchItems();
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/furniture-interior-decor/${id}/toggle-featured`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchItems();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Furniture & Interior Decor</h2>
          <p className="text-muted-foreground">Manage furniture and interior decor listings</p>
        </div>
        <Button onClick={() => { setEditingItem(null); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Furniture Item
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={(open) => {
        setShowForm(open);
        if (!open) setEditingItem(null);
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-visible">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Furniture/Decor Item' : 'Add New Furniture/Decor Item'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update the details of this furniture or decor listing' : 'Fill in the details to create a new furniture or decor listing'}
            </DialogDescription>
          </DialogHeader>
          <FurnitureInteriorDecorForm
            key={editingItem?.id || 'new'}
            editingItem={editingItem}
            onSuccess={handleSuccess}
          />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.isArray(items) && items.map((item) => (
          <Card key={item.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{item.title}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{item.category}</Badge>
                    <Badge variant="outline">{item.listingType}</Badge>
                    {item.condition && <Badge variant="outline">{item.condition}</Badge>}
                    {item.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleViewDetails(item)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {item.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg text-primary">₹{item.price}</span>
                  <Badge variant={item.isActive ? 'default' : 'secondary'}>
                    {item.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {item.brand && (
                  <div className="text-sm">
                    <span className="font-medium">Brand: </span>
                    <span className="text-muted-foreground">{item.brand}</span>
                  </div>
                )}
                {item.material && (
                  <div className="text-sm">
                    <span className="font-medium">Material: </span>
                    <span className="text-muted-foreground">{item.material}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handleEdit(item)}
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handleViewDetails(item)}
              >
                View Details
              </Button>
              <Button
                variant={item.isActive ? "secondary" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => toggleActive(item.id)}
              >
                {item.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant={item.isFeatured ? "secondary" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => toggleFeatured(item.id)}
              >
                {item.isFeatured ? "Unfeature" : "Feature"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* View Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{viewingItem?.title}</DialogTitle>
            <DialogDescription>Complete furniture/decor item details</DialogDescription>
          </DialogHeader>
          {viewingItem && (
            <div className="space-y-6">
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary">{viewingItem.category}</Badge>
                <Badge variant="outline">{viewingItem.listingType}</Badge>
                {viewingItem.condition && <Badge variant="outline">{viewingItem.condition}</Badge>}
                {viewingItem.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-lg font-bold text-primary">₹{viewingItem.price}</p>
                </div>
                {viewingItem.originalPrice && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Original Price</p>
                    <p className="text-lg font-bold line-through">₹{viewingItem.originalPrice}</p>
                  </div>
                )}
              </div>

              {viewingItem.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{viewingItem.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                {viewingItem.brand && (
                  <div>
                    <span className="font-medium">Brand:</span>
                    <span className="ml-2 text-muted-foreground">{viewingItem.brand}</span>
                  </div>
                )}
                {viewingItem.material && (
                  <div>
                    <span className="font-medium">Material:</span>
                    <span className="ml-2 text-muted-foreground">{viewingItem.material}</span>
                  </div>
                )}
                {viewingItem.color && (
                  <div>
                    <span className="font-medium">Color:</span>
                    <span className="ml-2 text-muted-foreground">{viewingItem.color}</span>
                  </div>
                )}
                {viewingItem.dimensions && (
                  <div>
                    <span className="font-medium">Dimensions:</span>
                    <span className="ml-2 text-muted-foreground">{viewingItem.dimensions}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t text-sm text-muted-foreground">
                <p>Created: {new Date(viewingItem.createdAt).toLocaleString()}</p>
                <p>Last Updated: {new Date(viewingItem.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {(!items || items.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Furniture Items Found</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first furniture/decor item</p>
            <Button onClick={() => { setEditingItem(null); setShowForm(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Furniture Item
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function SlidersSection() {
  const [sliders, setSliders] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSlider, setEditingSlider] = useState<any>(null);

  useEffect(() => {
    fetchSliders();
    fetchCategories();
  }, []);

  const fetchSliders = async () => {
    try {
      const res = await fetch('/api/admin/sliders');
      const data = await res.json();
      const slidersWithCategoryNames = (Array.isArray(data) ? data : []).map((s: any) => {
        const category = categories.find((c: any) => c.id === s.categoryId);
        return { ...s, categoryName: category?.name };
      });
      setSliders(slidersWithCategoryNames);
    } catch (err) {
      console.error('Error fetching sliders:', err);
      setSliders([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
    }
  };

  const handleAdd = () => {
    setEditingSlider(null);
    setShowForm(true);
  };

  const handleEdit = (s: any) => {
    setEditingSlider(s);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slider?')) return;
    try {
      const res = await fetch(`/api/admin/sliders/${id}`, { method: 'DELETE' });
      if (res.ok) fetchSliders();
    } catch (err) {
      console.error('Error deleting slider:', err);
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/sliders/${id}/toggle-active`, { method: 'PATCH' });
      if (res.ok) fetchSliders();
    } catch (err) {
      console.error('Error toggling slider active:', err);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingSlider(null);
    fetchSliders();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sliders</h2>
          <p className="text-muted-foreground">Manage homepage sliders</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Slider
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={(open) => { setShowForm(open); if (!open) setEditingSlider(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingSlider ? 'Edit Slider' : 'Add New Slider'}</DialogTitle>
            <DialogDescription>Fill slider details</DialogDescription>
          </DialogHeader>
          <SliderForm slider={editingSlider} onSuccess={handleSuccess} onCancel={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>

      

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(sliders) && sliders.map((s) => (
          <Card key={s.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{s.title || 'Untitled'}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(s)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(s.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {s.imageUrl && <img src={s.imageUrl} alt={s.title || 'slider'} className="w-full h-40  rounded-md" />}
              {s.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{s.description}</p>}
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Order: {s.sortOrder ?? 0}</span>
                  <Badge variant={s.isActive ? 'default' : 'secondary'}>{s.isActive ? 'Active' : 'Inactive'}</Badge>
                </div>
                {s.categoryId && <div className="text-xs text-muted-foreground">Category: {s.categoryName || 'N/A'}</div>}
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex gap-2">
              <Button variant={s.isActive ? 'outline' : 'default'} size="sm" className="flex-1" onClick={() => toggleActive(s.id)}>
                {s.isActive ? 'Deactivate' : 'Activate'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Blogs Section Component
function BlogsSection() {
  const [posts, setPosts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [categories, setCategories] = useState<AdminCategory[]>([]);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/admin/blog/posts');
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setPosts([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
    }
  };

  const handleAdd = () => {
    setEditingPost(null);
    setShowForm(true);
  };

  const handleEdit = (p: any) => {
    setEditingPost(p);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await fetch(`/api/admin/blog/posts/${id}`, { method: 'DELETE' });
      if (res.ok) fetchPosts();
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const togglePublish = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/blog/posts/${id}/toggle-publish`, { method: 'PATCH' });
      if (res.ok) fetchPosts();
    } catch (err) {
      console.error('Error toggling publish:', err);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingPost(null);
    fetchPosts();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Blogs</h2>
          <p className="text-muted-foreground">Manage blog posts</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Post
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={(open) => { setShowForm(open); if (!open) setEditingPost(null); }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPost ? 'Edit Post' : 'Add New Post'}</DialogTitle>
            <DialogDescription>Fill post details</DialogDescription>
          </DialogHeader>
          <BlogForm post={editingPost} categories={categories} onCancel={() => setShowForm(false)} onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((p) => (
          <Card key={p.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{p.title || 'Untitled'}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(p)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(p.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {p.coverImageUrl && <img src={p.coverImageUrl} alt={p.title || 'cover'} className="w-full h-40  rounded-md" />}
              {p.excerpt && <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{p.excerpt}</p>}
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Category: {p.category || 'Uncategorized'}</span>
                <Badge variant={p.isPublished ? 'default' : 'secondary'}>{p.isPublished ? 'Published' : 'Draft'}</Badge>
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex gap-2">
              <Button variant={p.isPublished ? 'outline' : 'default'} size="sm" className="flex-1" onClick={() => togglePublish(p.id)}>
                {p.isPublished ? 'Unpublish' : 'Publish'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Articles Section (Admin)
function ArticlesSection() {
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [categoryForm, setCategoryForm] = useState<any>({ name: '', slug: '', description: '', isActive: true });
  const [isCatSubmitting, setIsCatSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editingArticle, setEditingArticle] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [form, setForm] = useState<any>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",

    type: "Guide",
    authorName: "",
    authorId: "",
    pages: "",
    thumbnailUrl: "",
    images: [],
    isPremium: false,
    isFeatured: false,
    isPublished: false,
    seoTitle: "",
    seoDescription: "",

    userId: "",
    role: "",
    categoryId: "",
    categoryName: "",
  });

  useEffect(() => {
    fetchArticles();
    fetchArticleCategories();
  }, []);

  const fetchArticles = async () => {
    try {
      const r = await fetch('/api/admin/articles');
      if (r.ok) {
        const j = await r.json();
        setArticles(Array.isArray(j) ? j : []);
      } else {
        setArticles([]);
      }
    } catch (e) {
      console.error('Error fetching articles:', e);
      setArticles([]);
    }
  };

  const fetchArticleCategories = async () => {
    try {
      const r = await fetch('/api/admin/article-categories');
      if (r.ok) {
        const j = await r.json();
        const list = Array.isArray(j) ? j : [];
        setCategories(list.map((c: any) => ({ ...c, isActive: c?.isActive ?? true })));
      } else {
        setCategories([]);
      }
    } catch (e) {
      console.error('Error fetching article categories:', e);
      setCategories([]);
    }
  };

  const handleCategorySave = async (e: any) => {
    e.preventDefault();
    if (isCatSubmitting) return;
    setIsCatSubmitting(true);
    try {
      const payload: any = {
        name: categoryForm?.name,
        slug: categoryForm?.slug,
        description: categoryForm?.description,
        role: 'admin',
      };

      const url = editingCategory ? `/api/admin/article-categories/${editingCategory.id}` : '/api/admin/article-categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const r = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'x-user-role': 'admin' },
        body: JSON.stringify(payload),
      });

      if (r.ok) {
        setEditingCategory(null);
        setCategoryForm({ name: '', slug: '', description: '', isActive: true });
        await fetchArticleCategories();
      } else {
        const json = await r.json().catch(() => null);
        alert(json?.message || 'Failed to save category');
      }
    } catch (err) {
      console.error('Error saving category:', err);
      alert('Failed to save category');
    } finally {
      setIsCatSubmitting(false);
    }
  };

  const handleEditCategory = (c: any) => {
    setEditingCategory(c);
    setCategoryForm({
      name: c?.name || '',
      slug: c?.slug || '',
      description: c?.description || '',
      isActive: c?.isActive ?? true,
    });
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      const r = await fetch(`/api/admin/article-categories/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-role': 'admin' },
      });
      if (r.ok) {
        await fetchArticleCategories();
      } else {
        const json = await r.json().catch(() => null);
        alert(json?.message || 'Failed to delete category');
      }
    } catch (err) {
      console.error('Error deleting category:', err);
      alert('Failed to delete category');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      const r = await fetch(`/api/admin/articles/${id}`, { method: 'DELETE' });
      if (r.ok) {
        await fetchArticles();
      } else {
        const json = await r.json().catch(() => null);
        alert(json?.message || 'Failed to delete article');
      }
    } catch (err) {
      console.error('Error deleting article:', err);
      alert('Failed to delete article');
    }
  };

  const togglePublish = async (id: string) => {
    try {
      const r = await fetch(`/api/admin/articles/${id}/toggle-publish`, { method: 'PATCH' });
      if (r.ok) {
        await fetchArticles();
      }
    } catch (err) {
      console.error('Error toggling publish:', err);
    }
  };

  const handleViewArticle = (a: any) => {
    try {
      const id = a?.id;
      if (!id) return;
      window.open(`/articles/${id}`, '_blank');
    } catch (err) {
      console.error('Error viewing article:', err);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload: any = { ...form };

      const isDataMediaUrl = (s: string) => /^data:(image|video)\//i.test(String(s || '').trim());
      const dataUrlToFile = (dataUrl: string, filename: string) => {
        const [meta, content] = String(dataUrl || '').split(',');
        const match = /data:([^;]+);base64/i.exec(meta || '');
        const mime = match?.[1] || 'application/octet-stream';
        const binary = atob(content || '');
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        return new File([bytes], filename, { type: mime });
      };
      const uploadSingleFile = async (file: File): Promise<string> => {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
        if (!res.ok) throw new Error(`Upload failed (${res.status})`);
        const data = await res.json();
        if (!data?.url || typeof data.url !== 'string') throw new Error('Upload failed: missing url');
        return data.url;
      };

      if (isDataMediaUrl(payload.thumbnailUrl)) {
        payload.thumbnailUrl = await uploadSingleFile(dataUrlToFile(payload.thumbnailUrl, `cover-${Date.now()}.png`));
      }
      if (Array.isArray(payload.images)) {
        const uploadedUrls: string[] = [];
        for (const img of payload.images) {
          if (isDataMediaUrl(img)) {
            const url = await uploadSingleFile(dataUrlToFile(img, `img-${Date.now()}.png`));
            uploadedUrls.push(url);
          } else if (typeof img === 'string' && img.startsWith('/uploads/')) {
            uploadedUrls.push(img);
          }
        }
        payload.images = uploadedUrls;
      }

      // Attach current userId/role from localStorage if available (server expects userId sometimes)
      try {
        const stored = localStorage.getItem('user');
        if (stored) {
          const u = JSON.parse(stored);
          if (u?.id) payload.userId = payload.userId || u.id;
          if (u?.role) payload.role = payload.role || u.role;
        }
      } catch (err) {
        // ignore parsing errors
      }

      // Coerce pages to integer if provided, otherwise remove
      if (payload.pages === "" || payload.pages === null || payload.pages === undefined) {
        delete payload.pages;
      } else {
        const p = Number(payload.pages);
        if (!Number.isFinite(p) || isNaN(p)) {
          alert('Pages must be a number');
          setIsSubmitting(false);
          return;
        }
        payload.pages = Math.floor(p);
      }

      // Booleans
      payload.isFeatured = !!payload.isFeatured;
      payload.isPublished = !!payload.isPublished;
      payload.isPremium = !!payload.isPremium;

      // Remove empty strings for optional fields so server-side insert schema accepts
      ['authorId','authorName','thumbnailUrl','seoTitle','seoDescription','role','userId','downloads','likes','categoryId','categoryName'].forEach(k => {
        if (payload[k] === "" || payload[k] === null || payload[k] === undefined) delete payload[k];
      });

      if (!Array.isArray(payload.images) || payload.images.length === 0) {
        delete payload.images;
      }

      const method = editingArticle ? 'PUT' : 'POST';
      const url = editingArticle ? `/api/admin/articles/${editingArticle.id}` : '/api/admin/articles';

      const r = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (r.ok) {
        setShowForm(false);
        setEditingArticle(null);
        setForm({ title:'', slug:'', excerpt:'', content:'', type:'Guide', authorName:'', authorId:'', pages:'', thumbnailUrl:'', images: [], isPremium:false, isFeatured:false, isPublished:false, seoTitle:'', seoDescription:'', userId:'', role:'', categoryId:'', categoryName:'' });
        fetchArticles();
      } else {
        const json = await r.json().catch(() => null);
        console.error('Save failed', json || await r.text());
        alert(json?.message || 'Failed to save article. Check console for details.');
      }
    } catch (e) { console.error(e); }
    setIsSubmitting(false);
  };

  const handleEditArticle = (a: any) => {
    setEditingArticle(a);
    setShowForm(true);
    setForm({
      title: a.title || '',
      slug: a.slug || '',
      excerpt: a.excerpt || '',
      content: a.content || '',
      type: a.type || 'Guide',
      authorName: a.authorName || '',
      authorId: a.authorId || '',
      pages: a.pages ?? '',
      thumbnailUrl: a.thumbnailUrl || '',
      images: Array.isArray(a.images) ? a.images : [],
      isPremium: !!a.isPremium,
      isFeatured: !!a.isFeatured,
      isPublished: !!a.isPublished,
      seoTitle: a.seoTitle || '',
      seoDescription: a.seoDescription || '',

      userId: a.userId || '',
      role: a.role || '',
      categoryId: a.categoryId || '',
      categoryName: a.categoryName || '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Articles</h2>
          <p className="text-muted-foreground">Manage guides, research papers and whitepapers</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Article
        </Button>
        <Button variant="outline" onClick={() => setShowCategoryManager(true)} className="ml-2">
          <Settings className="w-4 h-4 mr-2" />
          Manage Categories
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Article</DialogTitle>
            <DialogDescription>Fill fields and create an article</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <div className="space-y-3">
              <Label>Title</Label>
              <Input value={form.title} onChange={e => setForm((f: any) => ({ ...f, title: e.target.value }))} placeholder="Title" required />

              <Label>Slug</Label>
              <Input value={form.slug} onChange={e => setForm((f: any) => ({ ...f, slug: e.target.value }))} placeholder="Slug" required />

              <Label>Excerpt</Label>
              <Input value={form.excerpt} onChange={e => setForm((f: any) => ({ ...f, excerpt: e.target.value }))} placeholder="Excerpt" />

              <Label>Content</Label>
              <Textarea value={form.content} onChange={e => setForm((f: any) => ({ ...f, content: e.target.value }))} rows={8} placeholder="Content" />
              <Label>Category</Label>
              <Select value={form.categoryId || ''} onValueChange={(v) => {
                const sel = categories.find((c:any) => c.id === v);
                setForm((f: any) => ({ ...f, categoryId: v, categoryName: sel?.name || '' }));
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c:any) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <Label>Type</Label>
                  <select className="input w-full" value={form.type} onChange={e => setForm((f: any) => ({ ...f, type: e.target.value }))}>
                    <option>Guide</option>
                    <option>Research</option>
                    <option>Whitepaper</option>
                  </select>
                </div>
                <div>
                  <Label>Pages</Label>
                  <Input type="number" min={0} value={form.pages} onChange={e => setForm((f: any) => ({ ...f, pages: e.target.value }))} placeholder="Pages (number)" />
                </div>
              </div>

              <Label>Cover Image URL</Label>
              <Input value={form.thumbnailUrl} onChange={e => setForm((f: any) => ({ ...f, thumbnailUrl: e.target.value }))} placeholder="Cover Image URL" />
              <div>
                <Label>Or choose file</Label>
                <input
                  type="file"
                  className="w-full"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files && e.target.files[0];
                    if (!file) return;
                    setIsUploadingThumbnail(true);
                    try {
                      const fd = new FormData();
                      fd.append('file', file);
                      const r = await fetch('/api/admin/upload', { method: 'POST', body: fd });
                      if (!r.ok) {
                        const j = await r.json().catch(() => null);
                        alert(j?.message || 'Failed to upload cover image');
                        return;
                      }
                      const j = await r.json();
                      if (j?.url) setForm((f: any) => ({ ...f, thumbnailUrl: j.url }));
                    } catch (err) {
                      console.error(err);
                      alert('Failed to upload cover image');
                    } finally {
                      setIsUploadingThumbnail(false);
                      try { (e.currentTarget as HTMLInputElement).value = ''; } catch (_) {}
                    }
                  }}
                />
              </div>

              <div>
                <Label>Article Images (multiple)</Label>
                <input
                  type="file"
                  className="w-full"
                  accept="image/*"
                  multiple
                  onChange={async (e) => {
                    const files = e.target.files ? Array.from(e.target.files) : [];
                    if (!files || files.length === 0) return;
                    setIsUploadingImages(true);
                    try {
                      const fd = new FormData();
                      for (const f of files) fd.append('files', f);
                      const r = await fetch('/api/admin/upload-multiple', { method: 'POST', body: fd });
                      if (!r.ok) {
                        const j = await r.json().catch(() => null);
                        alert(j?.message || 'Failed to upload images');
                        return;
                      }
                      const j = await r.json();
                      const urls = Array.isArray(j?.files) ? j.files.map((x: any) => x?.url).filter(Boolean) : [];
                      if (urls.length > 0) {
                        setForm((prev: any) => ({ ...prev, images: [...(Array.isArray(prev.images) ? prev.images : []), ...urls] }));
                      }
                    } catch (err) {
                      console.error(err);
                      alert('Failed to upload images');
                    } finally {
                      setIsUploadingImages(false);
                      try { (e.currentTarget as HTMLInputElement).value = ''; } catch (_) {}
                    }
                  }}
                />

                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  {isUploadingThumbnail ? <Badge variant="outline">Uploading cover...</Badge> : null}
                  {isUploadingImages ? <Badge variant="outline">Uploading images...</Badge> : null}
                  {Array.isArray(form.images) && form.images.length > 0 ? (
                    <Badge variant="secondary">{form.images.length} image(s) selected</Badge>
                  ) : null}
                </div>

                {Array.isArray(form.images) && form.images.length > 0 ? (
                  <div className="mt-2 flex gap-2 overflow-x-auto">
                    {form.images.map((u: string, idx: number) => (
                      <div key={u + idx} className="relative flex-shrink-0 w-20 h-20 rounded border overflow-hidden">
                        <img src={u} alt={`img-${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-black/60 text-white text-xs rounded px-1"
                          onClick={() => setForm((prev: any) => ({ ...prev, images: (prev.images || []).filter((_: any, i: number) => i !== idx) }))}
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              <Label>Author name</Label>
              <Input value={form.authorName} onChange={e => setForm((f: any) => ({ ...f, authorName: e.target.value }))} placeholder="Author name" />

              <Label>Author ID (optional)</Label>
              <Input value={form.authorId} onChange={e => setForm((f: any) => ({ ...f, authorId: e.target.value }))} placeholder="Author ID (optional)" />

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch checked={!!form.isPublished} onCheckedChange={v => setForm((f: any) => ({ ...f, isPublished: !!v }))} />
                  <span>Published</span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={!!form.isFeatured} onCheckedChange={v => setForm((f: any) => ({ ...f, isFeatured: !!v }))} />
                  <span>Featured</span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={!!form.isPremium} onCheckedChange={v => setForm((f: any) => ({ ...f, isPremium: !!v }))} />
                  <span>Premium</span>
                </div>
              </div>

              <Label>SEO Title</Label>
              <Input value={(form as any).seoTitle || ''} onChange={e => setForm((f: any) => ({ ...f, seoTitle: e.target.value }))} placeholder="SEO Title" />

              <Label>SEO Description</Label>
              <Textarea value={(form as any).seoDescription || ''} onChange={e => setForm((f: any) => ({ ...f, seoDescription: e.target.value }))} rows={4} placeholder="SEO Description" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <Label>User ID (optional)</Label>
                  <Input value={form.userId} onChange={e => setForm((f: any) => ({ ...f, userId: e.target.value }))} placeholder="User ID (optional)" />
                </div>
                <div>
                  <Label>Role (optional)</Label>
                  <Input value={form.role} onChange={e => setForm((f: any) => ({ ...f, role: e.target.value }))} placeholder="Role (optional)" />
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create Article'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showCategoryManager} onOpenChange={setShowCategoryManager}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Article Categories</DialogTitle>
            <DialogDescription>Create and manage article categories</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCategorySave} className="space-y-4 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <Label>Name</Label>
                <Input value={categoryForm.name} onChange={e => setCategoryForm((s:any) => ({ ...s, name: e.target.value }))} required />
              </div>
              <div>
                <Label>Slug</Label>
                <Input value={categoryForm.slug} onChange={e => setCategoryForm((s:any) => ({ ...s, slug: e.target.value }))} required />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={categoryForm.description} onChange={e => setCategoryForm((s:any) => ({ ...s, description: e.target.value }))} rows={3} />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={!!categoryForm.isActive} onCheckedChange={v => setCategoryForm((s:any) => ({ ...s, isActive: !!v }))} />
              <span>Active</span>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => { setShowCategoryManager(false); setEditingCategory(null); setCategoryForm({ name:'', slug:'', description:'', isActive:true }); }}>Close</Button>
              <Button type="submit" disabled={isCatSubmitting}>{editingCategory ? (isCatSubmitting ? 'Saving...' : 'Save') : (isCatSubmitting ? 'Creating...' : 'Create')}</Button>
            </div>
          </form>

          <div className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="w-24">Active</TableHead>
                  <TableHead className="w-36">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((c:any) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.slug}</TableCell>
                    <TableCell>{c.isActive ? 'Yes' : 'No'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditCategory(c)}>Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteCategory(c.id)}>Delete</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map(a => (
          <Card key={a.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1">{a.title}</CardTitle>
                  <div className="flex gap-2 flex-wrap text-sm text-muted-foreground">
                    <Badge>{a.type}</Badge>
                    {a.categoryName && <Badge variant="outline">{a.categoryName}</Badge>}
                    {a.pages && <Badge variant="outline">{a.pages} pages</Badge>}
                    {a.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                    {a.isPublished && <Badge className="bg-green-500">Published</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleViewArticle(a)} title="View"><Eye className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleEditArticle(a)} title="Edit"><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => togglePublish(a.id)} title="Toggle Publish"><Plus className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(a.id)} title="Delete"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">{a.excerpt}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SliderCardSection() {
  const [cards, setCards] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState<any>(null);
  const [form, setForm] = useState({ title: '', imageUrl: '', status: 'Active' });
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const thumbsRef = useRef<HTMLDivElement | null>(null);

  const isDataMediaUrl = (s: string) => /^data:(image|video)\//i.test(String(s || '').trim());
  const dataUrlToFile = (dataUrl: string, filename: string) => {
    const [meta, content] = String(dataUrl || '').split(',');
    const match = /data:([^;]+);base64/i.exec(meta || '');
    const mime = match?.[1] || 'application/octet-stream';
    const binary = atob(content || '');
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new File([bytes], filename, { type: mime });
  };
  const uploadSingleFile = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    if (!res.ok) throw new Error(`Upload failed (${res.status})`);
    const data = await res.json();
    if (!data?.url || typeof data.url !== 'string') throw new Error('Upload failed: missing url');
    return data.url;
  };

  // Prevent body scrolling when the dialog is open so only modal scrolls
  useEffect(() => {
    const prev = typeof document !== 'undefined' ? document.body.style.overflow : '';
    if (showForm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = prev || '';
    }
    return () => {
      if (typeof document !== 'undefined') document.body.style.overflow = prev || '';
    };
  }, [showForm]);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const res = await fetch('/api/admin/slider-card');
      const data = await res.json();
      setCards(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching slider cards:', err);
      setCards([]);
    }
  };

  const handleAdd = () => {
    setEditingCard(null);
    setForm({ title: '', imageUrl: '', status: 'Active' });
    setImages([]);
    setSelectedIndex(0);
    setSubmitError(null);
    setShowForm(true);
  };

  const handleEdit = (c: any) => {
    setEditingCard(c);
    setForm({ title: c.title || '', imageUrl: c.image_url || c.imageUrl || '', status: c.status || 'Active' });
    setImages((c.image_url || c.imageUrl) ? [c.image_url || c.imageUrl] : []);
    setSelectedIndex(0);
    setSubmitError(null);
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const readFile = (file: File) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

      const results = await Promise.all(files.map(readFile));
      const newImages = [...images, ...results];
      setImages(newImages);
      setForm(prev => ({ ...prev, imageUrl: newImages[0] || '' }));
      setSelectedIndex(newImages.length - results.length);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const removeImageAt = (idx: number) => {
    const next = images.filter((_, i) => i !== idx);
    setImages(next);
    const nextIndex = Math.max(0, Math.min(selectedIndex, next.length - 1));
    setSelectedIndex(nextIndex);
    setForm(prev => ({ ...prev, imageUrl: next[0] || '' }));
  };

  const selectIndex = (idx: number) => {
    setSelectedIndex(idx);
    const thumb = thumbsRef.current?.children[idx] as HTMLElement | undefined;
    thumb?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const prevImage = () => {
    if (images.length === 0) return;
    selectIndex((selectedIndex - 1 + images.length) % images.length);
  };

  const nextImage = () => {
    if (images.length === 0) return;
    selectIndex((selectedIndex + 1) % images.length);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slider card?')) return;
    try {
      const res = await fetch(`/api/admin/slider-card/${id}`, { method: 'DELETE' });
      if (res.ok) fetchCards();
    } catch (err) {
      console.error('Error deleting slider card:', err);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/slider-card/${id}/toggle-active`, { method: 'PATCH' });
      if (res.ok) fetchCards();
    } catch (err) {
      console.error('Error toggling slider card status:', err);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitError(null);

    // Validation: title is required
    if (!form.title || !form.title.trim()) {
      setSubmitError('Title is required');
      return;
    }

    // Validation: image is required (from newly uploaded images or existing)
    let finalImageUrl = images.length > 0 ? images[0] : form.imageUrl;
    if (!finalImageUrl) {
      setSubmitError('Image is required');
      return;
    }

    try {
      if (isDataMediaUrl(finalImageUrl)) {
        finalImageUrl = await uploadSingleFile(dataUrlToFile(finalImageUrl, `slider-${Date.now()}.png`));
      }

      const payload = { title: form.title, imageUrl: finalImageUrl, status: form.status };
      let res;
      if (editingCard) {
        res = await fetch(`/api/admin/slider-card/${editingCard.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      } else {
        res = await fetch('/api/admin/slider-card', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      }
      if (res.ok) {
        setShowForm(false);
        setEditingCard(null);
        setSubmitError(null);
        fetchCards();
      } else {
        const errMsg = await res.text();
        setSubmitError(`Save failed: ${errMsg}`);
        console.error('Save failed', errMsg);
      }
    } catch (err: any) {
      const msg = err.message || String(err);
      setSubmitError(`Error: ${msg}`);
      console.error('Error saving slider card:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Slider Cards</h2>
          <p className="text-muted-foreground">Manage slider cards (CRUD)</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Card
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={(open) => { setShowForm(open); if (!open) { setEditingCard(null); setSubmitError(null); } }}>
          <DialogContent className="max-w-lg max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>{editingCard ? 'Edit Slider Card' : 'Add Slider Card'}</DialogTitle>
              <DialogDescription>Provide title, image and status</DialogDescription>
            </DialogHeader>
            {submitError && <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">{submitError}</div>}
            <form onSubmit={handleSubmit} className="space-y-4 py-2 max-h-[72vh] overflow-y-auto">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input id="title" value={form.title} onChange={(e: any) => setForm(prev => ({ ...prev, title: e.target.value }))} required />
              </div>

              <div>
                <Label htmlFor="imageFile">Slider Image *</Label>
                <Input id="imageFile" type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} />
                {images.length > 0 && (
                  <div className="mt-2 flex gap-4 items-start">
                    <div className="flex flex-col items-center">
                      <Button type="button" variant="ghost" size="icon" onClick={prevImage}>
                        <ChevronUp className="w-4 h-4" />
                      </Button>

                      <div
                        ref={thumbsRef}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'ArrowUp') prevImage();
                          if (e.key === 'ArrowDown') nextImage();
                        }}
                        className="mt-2 flex flex-col gap-2 overflow-y-auto h-48 w-28 p-1"
                      >
                        {images.map((src, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => selectIndex(idx)}
                            className={`flex-shrink-0 rounded-md overflow-hidden border ${idx === selectedIndex ? 'ring-2 ring-offset-2 ring-indigo-400' : ''}`}
                          >
                            <img src={src} className="w-28 h-16 " />
                          </button>
                        ))}
                      </div>

                      <Button type="button" variant="ghost" size="icon" onClick={nextImage} className="mt-2">
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex-1 relative">
                      <img src={images[selectedIndex]} alt="Preview" className="w-full h-48  rounded-lg" />

                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => removeImageAt(selectedIndex)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label>Status</Label>
                <Select onValueChange={(v) => setForm(prev => ({ ...prev, status: v }))}>
                  <SelectTrigger>
                    <SelectValue>{form.status}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setEditingCard(null); setSubmitError(null); }}>Cancel</Button>
                <Button type="submit" disabled={uploading}>{editingCard ? 'Update' : 'Create'}</Button>
              </div>
            </form>
          </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(cards) && cards.map((c) => (
          <Card key={c.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{c.title || 'Untitled'}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(c)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(c.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {(c.image_url || c.imageUrl || c.image) && (
                <img src={c.image_url || c.imageUrl || c.image} alt={c.title || 'card'} className="w-full h-40  rounded-md" />
              )}
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status: {c.status}</span>
                <Badge variant={c.status === 'Active' ? 'default' : 'secondary'}>{c.status}</Badge>
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex gap-2">
              <Button variant={c.status === 'Active' ? 'outline' : 'default'} size="sm" className="flex-1" onClick={() => handleToggle(c.id)}>
                {c.status === 'Active' ? 'Deactivate' : 'Activate'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}