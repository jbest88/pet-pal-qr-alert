
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, LogIn } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");

  // If user is already logged in, redirect to dashboard
  if (user) {
    navigate("/dashboard");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    
    // Simple validation
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    
    if (!password.trim()) {
      toast.error("Please enter your password");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Attempting login with:", email);
      await login(email, password);
      // The redirect will happen in AuthContext if login is successful
    } catch (error: any) {
      console.error("Login error:", error);
      setLoginError(error.message || "Login failed");
      toast.error(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <div className="text-center mb-8">
        <LogIn className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="text-3xl font-bold">Login to Your Account</h1>
        <p className="text-gray-600 mt-2">
          Access your pet profiles and QR codes
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isSubmitting}
              required
            />
          </div>
          
          {loginError && (
            <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {loginError}
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
