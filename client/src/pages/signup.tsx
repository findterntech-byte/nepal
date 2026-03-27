import { Link } from "wouter";
import MultiStepSignup from "@/components/multi-step-signup";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Signup() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MultiStepSignup />
      <Footer />
    </div>
  );
}