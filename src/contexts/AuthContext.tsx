
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { mapSupabaseProfile } from "@/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string, phone: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for user session on load
  useEffect(() => {
    const checkUser = async () => {
      try {
        setLoading(true);
        
        // Get session from Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking auth session:', error);
          return;
        }
        
        if (session?.user) {
          console.log("Session found for user:", session.user.email);
          // Get user profile information
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) {
            console.error('Error fetching user profile:', profileError);
            return;
          }
          
          if (profile) {
            console.log("Profile found:", profile);
            setUser(mapSupabaseProfile(profile));
          }
        } else {
          console.log("No active session found");
        }
      } catch (error) {
        console.error('Unexpected error during auth check:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change event:", event, "for user:", session?.user?.email || "no user");
      
      if (event === 'SIGNED_IN' && session?.user) {
        // Get user profile information
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (!profileError && profile) {
          console.log("Setting user from auth state change:", profile);
          setUser(mapSupabaseProfile(profile));
        }
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out, clearing user state");
        setUser(null);
      }
    });

    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const register = async (email: string, password: string, name: string, phone: string) => {
    try {
      console.log("Registering new user:", email);
      // Register user with Supabase auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone
          }
        }
      });

      if (error) throw error;
      
      toast.success("Successfully registered! Please check your email to verify your account.");
      navigate("/dashboard");
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || "Registration failed. Please try again.");
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting to sign in:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      console.log("Login successful:", data.user?.email);
      toast.success("Successfully logged in!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || "Login failed. Please check your credentials.");
    }
  };

  const logout = async () => {
    try {
      console.log("Logging out current user");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      toast.info("You have been logged out");
      navigate("/");
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || "Logout failed. Please try again.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
