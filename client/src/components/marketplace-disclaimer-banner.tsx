import { useEffect, useState } from "react";
import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "jeevika_marketplace_disclaimer_dismissed_v1";

export default function MarketplaceDisclaimerBanner() {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      const v = window.localStorage.getItem(STORAGE_KEY);
      setDismissed(v === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  const onDismiss = () => {
    setDismissed(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
  };

  if (dismissed) return null;

  return (
    <div className="container mx-auto px-4 pt-4">
      <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 shadow-sm">
        <div className="flex flex-col gap-3 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-3">
              <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm sm:text-base font-semibold text-gray-900">
                  Marketplace Disclaimer
                </div>
                <div className="mt-1 text-sm text-gray-700 leading-relaxed">
                  <span className="font-medium">Jeevika</span> serves as a marketplace platform designed to connect buyers and sellers. Jeevika does not handle payments or transactions; all communications and agreements occur directly between the involved parties.
                </div>
              </div>
            </div>
           
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
            <div className="text-xs sm:text-sm text-amber-800/90">
              For details, read our
              <Link href="/terms-and-conditions" className="mx-1 underline underline-offset-4 font-medium hover:text-amber-900">
                Terms
              </Link>
              and
              <Link href="/privacy-policy" className="ml-1 underline underline-offset-4 font-medium hover:text-amber-900">
                Privacy Policy
              </Link>
              .
            </div>
            <div className="flex gap-2">
              <Link href="/terms-and-conditions" className="w-full sm:w-auto">
                <Button type="button" variant="outline" className="w-full sm:w-auto border-amber-300 bg-white/70 ">
                  View Terms
                </Button>
              </Link>
              <Button type="button" className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white" onClick={onDismiss}>
                I Understand
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
