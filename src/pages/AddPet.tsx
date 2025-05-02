
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import PetForm from "@/components/PetForm";
import Layout from "@/components/Layout";

const AddPet = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user authentication is done loading and there's no user, redirect to register
    if (!loading && !user) {
      navigate("/register");
    }
  }, [user, loading, navigate]);
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Add a New Pet</h1>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <PetForm />
        </div>
      </div>
    </Layout>
  );
};

export default AddPet;
