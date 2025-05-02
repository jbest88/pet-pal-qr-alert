
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change event:", event, "for user:", session?.user?.email || "no user");
      
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          // Get user profile information
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) {
            console.error('Error fetching user profile on auth change:', profileError);
            // Even if we can't get the profile, we know the user is authenticated
            // Set minimal user data from the session to prevent hanging
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.email || 'User',
              phone: null,
              created_at: new Date().toISOString()
            });
          } else if (profile) {
            console.log("Setting user from auth state change:", profile);
            setUser(mapSupabaseProfile(profile));
          }
        } catch (error) {
          console.error('Error during profile fetch on auth change:', error);
          // Still set basic user info from session to prevent hanging
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.email || 'User',
              phone: null,
              created_at: new Date().toISOString()
            });
          }
        }
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out, clearing user state");
        setUser(null);
      }
    });

    // THEN check for existing session
    const checkUser = async () => {
      try {
        setLoading(true);
        
        // Get session from Supabase with timeout to prevent hanging
        const sessionPromise = supabase.auth.getSession();
        
        // Add a timeout for the session check to prevent hanging
        const timeoutPromise = new Promise(resolve => {
          setTimeout(() => {
            console.log("Session check timed out");
            resolve({ data: { session: null }, error: new Error("Session check timed out") });
          }, 5000);
        });
        
        // Race the promises to prevent hanging
        const { data: { session }, error } = await Promise.race([
          sessionPromise, 
          timeoutPromise
        ]) as any;
        
        if (error && error.message !== "Session check timed out") {
          console.error('Error checking auth session:', error);
          setUser(null);
          return;
        }
        
        if (session?.user) {
          console.log("Session found for user:", session.user.email);
          try {
            // Get user profile information
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (profileError) {
              console.error('Error fetching user profile:', profileError);
              // Set minimal user data from the session to prevent hanging
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.email || 'User',
                phone: null,
                created_at: new Date().toISOString()
              });
            } else if (profile) {
              console.log("Profile found:", profile);
              setUser(mapSupabaseProfile(profile));
            } else {
              console.error('No profile found for user:', session.user.id);
              // Set minimal user data from the session to prevent hanging
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.email || 'User',
                phone: null,
                created_at: new Date().toISOString()
              });
            }
          } catch (error) {
            console.error('Error during profile fetch on init:', error);
            // Still set basic user info from session to prevent hanging
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.email || 'User',
              phone: null,
              created_at: new Date().toISOString()
            });
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
      
      // Fetch user profile after successful login
      if (data.user) {
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
            
          if (profileError) {
            console.error('Error fetching user profile after login:', profileError);
            // Set minimal user data to prevent hanging
            setUser({
              id: data.user.id,
              email: data.user.email || '',
              name: data.user.email || 'User',
              phone: null,
              created_at: new Date().toISOString()
            });
          } else if (profile) {
            setUser(mapSupabaseProfile(profile));
          } else {
            console.warn('No profile found for user after login');
            // Set minimal user data to prevent hanging
            setUser({
              id: data.user.id,
              email: data.user.email || '',
              name: data.user.email || 'User',
              phone: null,
              created_at: new Date().toISOString()
            });
          }
        } catch (profileFetchError) {
          console.error('Exception during profile fetch after login:', profileFetchError);
          // Set minimal user data to prevent hanging
          setUser({
            id: data.user.id,
            email: data.user.email || '',
            name: data.user.email || 'User',
            phone: null,
            created_at: new Date().toISOString()
          });
        }
        
        // Always show success and navigate regardless of profile fetch outcome
        toast.success("Successfully logged in!");
        navigate("/dashboard");
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
