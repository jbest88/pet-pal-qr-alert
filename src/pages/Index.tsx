
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PawPrint, QrCode, Bell, Check, Sparkles } from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user } = useAuth();
  const { isSubscribed } = useSubscription();
  const navigate = useNavigate();
  
  const features = [
    {
      icon: <QrCode className="h-8 w-8 text-primary" />,
      title: "Custom QR Codes",
      description: "Generate unique QR codes for each of your pets that link to their profile."
    },
    {
      icon: <Bell className="h-8 w-8 text-primary" />,
      title: "Instant Alerts",
      description: "Receive immediate notifications with location information when someone scans your pet's QR code."
    },
    {
      icon: <PawPrint className="h-8 w-8 text-primary" />,
      title: "Pet Profiles",
      description: "Create detailed profiles for your pets with important information to help them get home safely."
    }
  ];

  const steps = [
    {
      number: 1,
      title: "Register & Create Profile",
      description: "Create an account and add a detailed profile for each of your pets."
    },
    {
      number: 2,
      title: "Generate QR Code",
      description: "The app will create a unique QR code linked to your pet's profile."
    },
    {
      number: 3,
      title: "Attach to Collar",
      description: "Print the QR code and attach it securely to your pet's collar."
    },
    {
      number: 4,
      title: "Get Notified",
      description: "If your pet is found, the finder can scan the QR code and you'll be alerted immediately."
    }
  ];

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-accent to-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Keep Your Pets Safe with Smart QR Alerts
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            The fastest way to reunite with your lost pets. Easy to use QR codes that alert you immediately when scanned.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="text-lg px-8" onClick={handleGetStarted}>
              Get Started
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8">
              <Link to="/how-it-works">How It Works</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Features That Keep Pets Safe
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PetPal+ Section */}
      <section className="py-16 bg-gradient-to-r from-amber-50 to-amber-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-8">
            <Sparkles className="h-8 w-8 text-amber-500 mr-2" />
            <h2 className="text-3xl font-bold text-center">
              Upgrade to PetPal+
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-xl font-semibold mb-4">Premium Features</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Priority customer support with faster response times</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Advanced location tracking for better pet recovery</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Premium pet profile templates for more detailed information</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Early access to all new features as they're developed</span>
                </li>
              </ul>
              <div className="mt-6">
                <Button asChild>
                  <Link to="/subscription">
                    {isSubscribed ? "Manage Subscription" : "Upgrade Now"}
                  </Link>
                </Button>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Flexible Plans</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b">
                  <div>
                    <p className="font-medium">Monthly Subscription</p>
                    <p className="text-sm text-gray-600">Flexible monthly billing</p>
                  </div>
                  <p className="text-xl font-bold">$4.99</p>
                </div>
                <div className="flex justify-between items-center pb-4 border-b">
                  <div>
                    <p className="font-medium">Annual Subscription</p>
                    <p className="text-sm text-gray-600">Save 17% with yearly billing</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">$49.99</p>
                    <p className="text-xs text-green-600">Save $9.89/year</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Choose the plan that works best for you. Cancel anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            How PetPal QR Alert Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Start Protecting Your Pets Today
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Don't wait until your pet goes missing. Create an account now and get your pet's QR code ready.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="text-lg px-8" onClick={handleGetStarted}>
              {user ? "Go to Dashboard" : "Create Your Free Account"}
            </Button>
            {!isSubscribed && (
              <Button asChild size="lg" variant="outline" className="text-lg px-8">
                <Link to="/subscription">
                  <Sparkles className="mr-2 h-5 w-5" /> Explore PetPal+
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
