import { useState } from "react";
import { Plus, Minus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { Faq } from "@shared/schema";

const FAQ_CATEGORIES = [
  { id: "agent", label: "I am a Real Estate Agent or Broker" },
  { id: "listing", label: "I am Interested in Listing my Property" },
  { id: "looking", label: "I am Looking For Properties" },
] as const;

export default function FAQSection() {
  const [activeTab, setActiveTab] = useState<string>("agent");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);

  const { data: faqs = [], isLoading } = useQuery<Faq[]>({
    queryKey: [`/api/faqs?category=${activeTab}`],
  });

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  const displayedFaqs = showMore ? faqs : faqs.slice(0, 4);

  return (
    <section className="bg-muted py-16" data-testid="faq-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="text-faq-title">
            FAQ's
          </h2>
          <p className="text-lg text-muted-foreground" data-testid="text-faq-description">
            Find quick answers to your most common questions and get the help you need to make the
            most of Qatar Living
          </p>
        </div>

        {/* FAQ Tabs */}
        <div className="flex justify-center mb-8" data-testid="faq-tabs">
          <div className="inline-flex bg-white rounded-lg p-1 shadow-sm">
            {FAQ_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === category.id
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-testid={`tab-${category.id}`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Questions */}
        <div className="max-w-4xl mx-auto space-y-4" data-testid="faq-questions">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-pulse">Loading FAQs...</div>
            </div>
          ) : displayedFaqs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No FAQs available for this category.</p>
            </div>
          ) : (
            displayedFaqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-lg border border-border overflow-hidden"
                data-testid={`faq-item-${faq.id}`}
              >
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                  onClick={() => toggleFAQ(faq.id)}
                  data-testid={`button-toggle-faq-${faq.id}`}
                >
                  <span className="font-medium text-foreground pr-4">{faq.question}</span>
                  {expandedFAQ === faq.id ? (
                    <Minus className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <Plus className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  )}
                </button>
                {expandedFAQ === faq.id && (
                  <div className="px-6 pb-4 text-muted-foreground" data-testid={`faq-content-${faq.id}`}>
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))
          )}

          {faqs.length > 4 && (
            <div className="text-center mt-8">
              <Button
                variant="ghost"
                onClick={() => setShowMore(!showMore)}
                className="text-accent hover:text-accent/80"
                data-testid="button-show-more-faqs"
              >
                {showMore ? "Show Less" : "Show More"}
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showMore ? "rotate-180" : ""}`} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
