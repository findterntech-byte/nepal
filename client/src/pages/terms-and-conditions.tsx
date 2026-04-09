import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Shield, Users, FileText, AlertTriangle, CheckCircle, Scale, Building } from "lucide-react";
import { useState } from "react";

export default function TermsAndConditions() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections = [
    {
      id: "platform-nature",
      title: "Nature of the Platform",
      icon: <Building className="w-5 h-5" />,
      content: "Jeevika is a digital marketplace platform that allows individuals, professionals, and businesses to publish listings related to products, services, job opportunities, and professional profiles. The platform's purpose is to connect buyers, sellers, service providers, and users so they can communicate and interact directly. Jeevika acts only as an intermediary platform and does not directly sell products, provide services, or participate in transactions between users."
    },
    {
      id: "user-registration",
      title: "User Registration and Information",
      icon: <Users className="w-5 h-5" />,
      content: "Users who create listings or profiles must provide accurate, truthful, and up-to-date information, which may include: Name, Phone number, Email address, Location or address, Professional or business details, Product or service information, Profile or product images. Users are solely responsible for the authenticity and accuracy of the information they provide. Providing false, misleading, or fraudulent information may result in account suspension, removal of listings, or permanent banning from the platform."
    },
    {
      id: "consent-display",
      title: "Consent to Display Information",
      icon: <FileText className="w-5 h-5" />,
      content: "By submitting information to Jeevika, users grant permission to Jeevika Services Pvt. Ltd. to display and publish the submitted information on the platform. This may include: Personal or business name, Contact information, Professional or business profile details, Product or service descriptions, Images or logos. This information is displayed for the purpose of connecting buyers, sellers, and service providers."
    },
    {
      id: "seller-responsibility",
      title: "Seller and Service Provider Responsibility",
      icon: <Shield className="w-5 h-5" />,
      content: "All sellers, professionals, and service providers listed on the platform are independent individuals or businesses. They are solely responsible for: Authenticity of products or services, Accuracy of listings, Pricing and availability, Communication with buyers, Delivery or completion of services. Jeevika shall not be responsible for disputes, losses, damages, fraud, or misconduct arising from interactions or transactions between users."
    },
    {
      id: "listings-advertisements",
      title: "Listings and Advertisements",
      icon: <FileText className="w-5 h-5" />,
      content: "Sellers are responsible for the accuracy and legality of the listings they post on Jeevika. Sellers must provide clear and honest information regarding the product or service offered, including images, descriptions, and pricing. Sellers must ensure that their listings comply with all applicable laws and regulations of Nepal. Jeevika reserves the right to review, edit, or remove any listings that violate platform policies, contain misleading information, or are deemed inappropriate or harmful."
    },
    {
      id: "payment-transactions",
      title: "Payment and Transactions",
      icon: <Scale className="w-5 h-5" />,
      content: "Jeevika is a platform-only service and does not handle payments. Transactions between buyers and sellers are made directly between the parties. By using the platform, you agree that: Jeevika is not responsible for any disputes, delays, fraud, or issues arising from payments, refunds, deliveries, or transactions between users. All sales and services are subject to the terms agreed upon directly between the buyer and the seller. Users are encouraged to verify product details and seller authenticity before completing any transaction."
    },
    {
      id: "prohibited-activities",
      title: "Prohibited Activities",
      icon: <AlertTriangle className="w-5 h-5" />,
      content: "Users are strictly prohibited from: Posting fraudulent or misleading listings, Uploading illegal products or services, Sharing harmful or malicious content, Attempting to hack or disrupt the platform, Misusing another person's identity or information, Publishing spam, scams, or misleading advertisements. Violation of these rules may result in account termination and possible legal action."
    },
    {
      id: "adult-content",
      title: "Prohibition of Adult or Illegal Content",
      icon: <AlertTriangle className="w-5 h-5" />,
      content: "Users are strictly prohibited from uploading, posting, promoting, or sharing any illegal, harmful, or inappropriate content under the laws of Nepal. This includes but is not limited to: Adult or 18+ content, Pornographic material, Escort or prostitution services, Sexually explicit images or videos, Content involving minors, Content that violates public morality or decency. Jeevika maintains a zero-tolerance policy for such content. Any user found uploading such material will have their account immediately suspended or permanently removed from the platform. Serious violations may be reported to the relevant authorities according to the laws of Nepal."
    },
    {
      id: "compliance-laws",
      title: "Compliance with Laws of Nepal",
      icon: <Scale className="w-5 h-5" />,
      content: "All users must comply with the applicable laws and regulations of Nepal while using the platform. This includes but is not limited to compliance with: Electronic Transaction Act 2063, Consumer Protection Act 2018 Nepal. Any illegal activity conducted through the platform may be reported to the appropriate authorities."
    },
    {
      id: "limitation-liability",
      title: "Limitation of Liability",
      icon: <Shield className="w-5 h-5" />,
      content: "Jeevika Services Pvt. Ltd. shall not be liable for any direct, indirect, incidental, or consequential damages arising from: User interactions, Transactions between buyers and sellers, Incorrect information provided by users, Fraud or misconduct by third parties. Users access and use the platform at their own risk."
    },
    {
      id: "account-suspension",
      title: "Account Suspension and Content Removal",
      icon: <AlertTriangle className="w-5 h-5" />,
      content: "Jeevika reserves the right to: Remove listings or content, Suspend or terminate user accounts, Restrict access to the platform if any user violates these Terms and Conditions or engages in suspicious or harmful activity."
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property",
      icon: <FileText className="w-5 h-5" />,
      content: "All platform content including logos, designs, branding, layout, and original materials related to Jeevika are the intellectual property of Jeevika Services Pvt. Ltd. Unauthorized reproduction, copying, or distribution is strictly prohibited."
    },
    {
      id: "changes-terms",
      title: "Changes to Terms",
      icon: <FileText className="w-5 h-5" />,
      content: "Jeevika may update or modify these Terms and Conditions at any time without prior notice. Continued use of the platform after updates constitutes acceptance of the revised terms."
    },
    {
      id: "governing-law",
      title: "Governing Law and Jurisdiction",
      icon: <Scale className="w-5 h-5" />,
      content: "These Terms and Conditions shall be governed by and interpreted in accordance with the laws of Nepal. Any disputes arising from the use of the platform shall fall under the jurisdiction of the courts of Nepal."
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
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                <FileText className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Terms and Conditions
            </h1>
            <p className="text-xl text-blue-100 mb-4">
              Jeevika Services Pvt. Ltd.
            </p>
            <p className="text-lg text-blue-200">
              Effective Date: 2026
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto border-l-4 border-blue-600 shadow-lg">
          <CardContent className="p-8">
            <p className="text-gray-700 leading-relaxed text-lg">
              Welcome to the website and platform operated by Jeevika Services Pvt. Ltd. ("Jeevika", "we", "our", or "the platform"). By accessing, browsing, registering, or using this platform, you agree to comply with and be legally bound by the following Terms and Conditions.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Terms Sections */}
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
                        className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-center gap-3 ${
                          activeSection === section.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                        }`}
                      >
                        <div className="text-blue-600">{section.icon}</div>
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
                    activeSection === section.id ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                  }`}
                >
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-600 text-white p-2 rounded-lg">
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
                    <p className="text-gray-700 leading-relaxed">
                      {section.content}
                    </p>
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
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center">
              <CardTitle className="text-2xl font-bold">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Company Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Building className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700"><strong>Company:</strong> {contactInfo.company}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700"><strong>Founder & CEO:</strong> {contactInfo.founder}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700"><strong>General Manager:</strong> {contactInfo.generalManager}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700"><strong>Address:</strong> {contactInfo.address}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Get in Touch</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700"><strong>Email:</strong> {contactInfo.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700"><strong>Website:</strong> {contactInfo.website}</span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Support
                    </Button>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-gray-600 mb-2">For inquiries, complaints, or legal matters, users may contact us through the above information.</p>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700 font-medium">Approved by:</p>
                    <p className="text-lg font-semibold text-blue-800 mt-1">Founder & CEO – Rajaul Khan</p>
                    <p className="text-gray-600">Jeevika Services Pvt. Ltd.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />

      {/* Important Marketplace Disclaimer */}
     
    </div>
  );
}
