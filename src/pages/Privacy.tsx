
import Layout from "@/components/Layout";

const Privacy = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
        <div className="prose prose-lg max-w-none text-gray-700">
          <p>
            At PetPal QR Alert, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Information We Collect</h2>
          <p>
            We collect personal information that you voluntarily provide to us when you register with the service, including:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Pet information (name, breed, description)</li>
          </ul>
          <p>
            When someone scans a QR code, we collect:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Location data (with user permission)</li>
            <li>Any contact information or message voluntarily provided</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Create and manage your account</li>
            <li>Generate QR codes linked to pet profiles</li>
            <li>Notify you when your pet's QR code is scanned</li>
            <li>Provide the location where your pet was found</li>
            <li>Enable communication between pet finders and owners</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Data Security</h2>
          <p>
            We implement appropriate security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Third-Party Disclosure</h2>
          <p>
            We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except when we have your permission or as required by law.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Your Rights</h2>
          <p>
            You have the right to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Access and update your personal information</li>
            <li>Delete your account and associated data</li>
            <li>Object to our processing of your personal information</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p>
            <strong>Email:</strong> privacy@petpalqralert.com<br />
            <strong>Address:</strong> PetPal QR Alert, 123 Main Street, Anytown, USA
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;
