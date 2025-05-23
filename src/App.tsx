
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";

// Pages
import Index from "./pages/Index";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddPet from "./pages/AddPet";
import EditPet from "./pages/EditPet";
import PetProfile from "./pages/PetProfile";
import QRCodePage from "./pages/QRCode";
import Scan from "./pages/Scan";
import HowItWorks from "./pages/HowItWorks";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import LostPets from "./pages/LostPets";
import QRRedirect from "./pages/QRRedirect";
import Subscription from "./pages/Subscription";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import SubscriptionCanceled from "./pages/SubscriptionCanceled";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <SubscriptionProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/add-pet" element={<AddPet />} />
              <Route path="/edit-pet/:petId" element={<EditPet />} />
              <Route path="/pet/:petId" element={<PetProfile />} />
              <Route path="/qr-code/:petId" element={<QRCodePage />} />
              <Route path="/scan/:scanId" element={<Scan />} />
              <Route path="/qr/:slug" element={<QRRedirect />} />
              <Route path="/lost-pets" element={<LostPets />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/subscription/success" element={<SubscriptionSuccess />} />
              <Route path="/subscription/canceled" element={<SubscriptionCanceled />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SubscriptionProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
