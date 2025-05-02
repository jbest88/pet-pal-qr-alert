
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
    // Set up auth state change listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change event:", event, "for user:", session?.user?.email || "no user");
      
      if (event === 'SIGNED_IN' && session?.user) {
        // Use synchronous state update for the initial user state
        if (session.user.email) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.email.split('@')[0],
            phone: null,
            created_at: new Date().toISOString()
          });
        }
        
        // Defer profile fetch to avoid blocking
        setTimeout(async () => {
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (profileError) {
              console.error('Error fetching user profile on auth change:', profileError);
            } else if (profile) {
              console.log("Setting user from auth state change:", profile);
              setUser(mapSupabaseProfile(profile));
            }
          } catch (error) {
            console.error('Error during profile fetch on auth change:', error);
          }
        }, 0);
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out, clearing user state");
        setUser(null);
      }
    });

    // THEN check for existing session
    const checkUser = async () => {
      try {
        setLoading(true);
        
        // Get session from Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking auth session:', error);
          setUser(null);
          setLoading(false);
          return;
        }
        
        if (session?.user) {
          console.log("Session found for user:", session.user.email);
          // Set initial user data
          if (session.user.email) {
            setUser({
              id: session.user.id,
              email: session.user.email,
              name: session.user.email.split('@')[0],
              phone: null,
              created_at: new Date().toISOString()
            });
          }
          
          // Get user profile
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (profileError) {
              console.error('Error fetching user profile:', profileError);
            } else if (profile) {
              console.log("Profile found:", profile);
              setUser(mapSupabaseProfile(profile));
            }
          } catch (error) {
            console.error('Error during profile fetch on init:', error);
          }
        } else {
          console.log("No active session found");
          setUser(null);
        }
      } catch (error) {
        console.error('Unexpected error during auth check:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
    
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
      
      if (data.user) {
        // Set basic user data immediately for better UX
        setUser({
          id: data.user.id,
          email: data.user.email || email,
          name: name || email.split('@')[0],
          phone,
          created_at: new Date().toISOString()
        });
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || "Registration failed. Please try again.");
      throw error;
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
      
      // Set basic user data immediately for better UX
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || email,
          name: data.user.email || email.split('@')[0],
          phone: null,
          created_at: new Date().toISOString()
        });
        
        toast.success("Successfully logged in!");
        navigate("/dashboard");
        
        // Fetch complete profile in background
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
            
          if (profileError) {
            console.error('Error fetching user profile after login:', profileError);
          } else if (profile) {
            setUser(mapSupabaseProfile(profile));
          }
        } catch (profileFetchError) {
          console.error('Exception during profile fetch after login:', profileFetchError);
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || "Login failed. Please check your credentials.");
      throw error;
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
