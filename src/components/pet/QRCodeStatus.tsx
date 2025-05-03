
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { QrCode } from "lucide-react";

interface QRCodeStatusProps {
  petId: string;
}

const QRCodeStatus = ({ petId }: QRCodeStatusProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Code Status</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="mb-4">
          <QrCode className="h-12 w-12 mx-auto text-primary" />
        </div>
        <Button asChild className="w-full">
          <Link to={`/qr-code/${petId}`}>View & Download QR Code</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default QRCodeStatus;
