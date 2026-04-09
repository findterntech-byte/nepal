import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Shield, Users, FileText, AlertTriangle, CheckCircle, Scale, Building, Lock, Database, Eye, UserCheck, ExternalLink, Clock, HelpCircle } from "lucide-react";
import { useState } from "react";

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections = [
    {
      id: "information-collect",
      title: "Information We Collect",
      icon: <Database className="w-5 h-5" />,
      content: "When users register, submit listings, or interact with the platform, we may collect the following information: Full name, Phone number, Email address, Location or address, Professional or business details, Product or service information, Profile photographs or product images, Any other information voluntarily submitted by the user. This information may be displayed on the platform for the purpose of connecting buyers, sellers, and service providers.",
      items: [
        "Full name",
        "Phone number", 
        "Email address",
        "Location or address",
        "Professional or business details",
        "Product or service information",
        "Profile photographs or product images",
        "Any other information voluntarily submitted by the user"
      ]
    },
    {
      id: "purpose-collection",
      title: "Purpose of Information Collection",
      icon: <UserCheck className="w-5 h-5" />,
      content: "The information collected by Jeevika is used for the following purposes:",
      items: [
        "To create and manage user profiles or listings",
        "To enable communication between buyers and sellers",
        "To improve the functionality and user experience of the platform",
        "To ensure platform security and prevent fraudulent activity",
        "To provide customer support and respond to inquiries"
      ]
    },
    {
      id: "public-display",
      title: "Public Display of Information",
      icon: <Eye className="w-5 h-5" />,
      content: "Since Jeevika is a marketplace platform, some user information submitted voluntarily may be publicly visible on the platform. This information is displayed to allow users to connect directly with each other.",
      items: [
        "Name",
        "Contact number",
        "Professional details",
        "Business information",
        "Product or service descriptions",
        "Images provided by the user"
      ]
    },
    {
      id: "data-protection",
      title: "Data Protection and Security",
      icon: <Lock className="w-5 h-5" />,
      content: "Jeevika takes reasonable technical and administrative measures to protect user data from unauthorized access, misuse, or disclosure. However, no internet-based platform can guarantee absolute security. Users are encouraged to protect their account information and avoid sharing sensitive data publicly."
    },
    {
      id: "user-responsibility",
      title: "User Responsibility",
      icon: <Users className="w-5 h-5" />,
      content: "Users are responsible for ensuring that the information they provide is accurate and lawful. Jeevika is not responsible for incorrect or misleading information submitted by users. Users should also exercise caution when sharing personal information publicly on the platform."
    },
    {
      id: "third-party-links",
      title: "Third-Party Links",
      icon: <ExternalLink className="w-5 h-5" />,
      content: "The platform may contain links to third-party websites or external services. Jeevika does not control or take responsibility for the privacy practices of those external websites. Users are encouraged to review the privacy policies of third-party services before sharing their information."
    },
    {
      id: "data-retention",
      title: "Data Retention",
      icon: <Clock className="w-5 h-5" />,
      content: "Jeevika may retain user information for as long as necessary to operate the platform, maintain listings, and comply with legal obligations. Users may request removal or modification of their information by contacting the platform."
    },
    {
      id: "compliance-laws",
      title: "Compliance with Laws of Nepal",
      icon: <Scale className="w-5 h-5" />,
      content: "Jeevika operates in accordance with applicable laws and regulations of Nepal. User information will only be used in a lawful and transparent manner.",
      items: [
        "Electronic Transaction Act 2063",
        "Consumer Protection Act 2018 Nepal"
      ]
    },
    {
      id: "changes-policy",
      title: "Changes to the Privacy Policy",
      icon: <FileText className="w-5 h-5" />,
      content: "Jeevika reserves the right to update or modify this Privacy Policy at any time. Updated policies will be published on this page. Continued use of the platform indicates acceptance of the updated policy."
    }
  ];

  const contactInfo = {
    company: "Jeevika Services Pvt. Ltd.",
    founder: "Rajaul Khan",
    generalManager: "Salman Khan",
    address: "Nepal",
    email: "support@jeevika.services",
    website: "www.jeevika.live"
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                <Shield className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-purple-100 mb-4">
              Jeevika Services Pvt. Ltd.
            </p>
            <p className="text-lg text-purple-200">
              Effective Date: 2026
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto border-l-4 border-purple-600 shadow-lg">
          <CardContent className="p-8">
            <p className="text-gray-700 leading-relaxed text-lg">
              Jeevika Services Pvt. Ltd. ("Jeevika", "we", "our", or "the platform") respects the privacy of all users and is committed to protecting the personal information shared on our website. This Privacy Policy explains how we collect, use, store, and protect user information when using the Jeevika platform.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Privacy Sections */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    Quick Navigation
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <nav className="space-y-1">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                        className={`w-full text-left px-4 py-3 hover:bg-purple-50 transition-colors flex items-center gap-3 ${
                          activeSection === section.id ? 'bg-purple-50 border-l-4 border-purple-600' : ''
                        }`}
                      >
                        <div className="text-purple-600">{section.icon}</div>
                        <span className="text-sm font-medium text-gray-700">{section.title}</span>
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {sections.map((section, index) => (
                <Card 
                  key={section.id}
                  className={`shadow-md hover:shadow-lg transition-shadow duration-300 ${
                    activeSection === section.id ? 'ring-2 ring-purple-500 ring-opacity-50' : ''
                  }`}
                >
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-600 text-white p-2 rounded-lg">
                        {section.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl font-semibold text-gray-800">
                          {index + 1}. {section.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {section.content}
                    </p>
                    {section.items && (
                      <div className="mt-4">
                        <div className="grid gap-2">
                          {section.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                              <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center">
              <CardTitle className="text-2xl font-bold flex items-center justify-center gap-3">
                <HelpCircle className="w-6 h-6" />
                Privacy-Related Inquiries
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Company Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Building className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-700"><strong>Company:</strong> {contactInfo.company}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-700"><strong>Founder & CEO:</strong> {contactInfo.founder}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-700"><strong>General Manager:</strong> {contactInfo.generalManager}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-700"><strong>Address:</strong> {contactInfo.address}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Us</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-700"><strong>Email:</strong> {contactInfo.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-700"><strong>Website:</strong> {contactInfo.website}</span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Privacy Support
                    </Button>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-gray-600 mb-2">
                    For any privacy-related questions, requests for data correction, or removal of information, users may contact us through the above information.
                  </p>
                  <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-700 font-medium">Approved by:</p>
                    <p className="text-lg font-semibold text-purple-800 mt-1">Founder & CEO – Rajaul Khan</p>
                    <p className="text-gray-600">Jeevika Services Pvt. Ltd.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Security Badge Section */}
      <section className="py-12 bg-gradient-to-r from-purple-100 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-full shadow-lg">
                <Lock className="w-12 h-12 text-purple-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Privacy Matters</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We are committed to protecting your personal information and ensuring transparency in how we handle your data. 
              Your trust is important to us, and we work diligently to maintain the highest standards of privacy and security.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <div className="bg-white px-6 py-3 rounded-lg shadow-md">
                <Shield className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">Secure Platform</p>
              </div>
              <div className="bg-white px-6 py-3 rounded-lg shadow-md">
                <CheckCircle className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">Compliant</p>
              </div>
              <div className="bg-white px-6 py-3 rounded-lg shadow-md">
                <Eye className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">Transparent</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Important Marketplace Disclaimer */}
      
    </div>
  );
}
