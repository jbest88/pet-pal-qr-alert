
import Layout from "@/components/Layout";

const DashboardLoading = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-accent flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardLoading;
