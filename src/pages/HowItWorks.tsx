
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { PawPrint, QrCode, Bell, Send } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: <PawPrint className="h-10 w-10 text-primary" />,
      title: "Create Pet Profiles",
      content: "Register and create detailed profiles for each of your pets with important information like breed, appearance, and any special needs."
    },
    {
      icon: <QrCode className="h-10 w-10 text-primary" />,
      title: "Generate QR Codes",
      content: "Our system automatically generates a unique QR code for each pet. Print it and attach it to your pet's collar."
    },
    {
      icon: <Send className="h-10 w-10 text-primary" />,
      title: "Finder Scans QR Code",
      content: "When someone finds your pet, they can scan the QR code with any smartphone camera, no app required."
    },
    {
      icon: <Bell className="h-10 w-10 text-primary" />,
      title: "Get Notified",
      content: "You receive an instant alert with the finder's location and contact information so you can reunite with your pet quickly."
    }
  ];

  const faqs = [
    {
      question: "Do I need to pay for PetPal QR Alert?",
      answer: "PetPal QR Alert is free to use for creating pet profiles and generating QR codes. Premium features for multiple pets and advanced alerts may be available in the future."
    },
    {
      question: "Does the person who finds my pet need the app?",
      answer: "No, they don't need any app! They can simply scan the QR code with their phone's camera, and it will open a web page where they can contact you."
    },
    {
      question: "How does the location tracking work?",
      answer: "When someone scans your pet's QR code, we use their device's location (with their permission) to show you where your pet was found."
    },
    {
      question: "Is my personal information safe?",
      answer: "Yes, we only share your contact information when your pet's QR code is scanned. We never sell your data or use it for marketing purposes."
    },
    {
      question: "What if my QR code gets damaged?",
      answer: "You can always download and print a new QR code from your pet's profile page. It's a good idea to have a spare one just in case."
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">How PetPal QR Alert Works</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our simple system helps reunite lost pets with their owners quickly and safely. Here's how it works.
          </p>
        </div>
        
        {/* Steps Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.content}</p>
              <div className="mt-4 flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block w-full h-0.5 bg-primary/10"></div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Protect Your Pets?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Create an account now and generate your first QR code in minutes. It's free and could help bring your pet home safely.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button asChild size="lg">
              <Link to="/register">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/dashboard">View Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HowItWorks;
