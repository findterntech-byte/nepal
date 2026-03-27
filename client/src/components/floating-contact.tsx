import { Mail, MessageCircle } from "lucide-react";

export default function FloatingContact() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <a
        href="https://wa.me/9779709142561"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="h-12 w-12 rounded-full bg-[#25D366] text-white shadow-lg flex items-center justify-center hover:brightness-95 transition"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
      <a
        href="https://mail.google.com/mail/?view=cm&fs=1&to=jeevika7076@gmail.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Email"
        className="h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition"
      >
        <Mail className="h-6 w-6" />
      </a>
    </div>
  );
}
