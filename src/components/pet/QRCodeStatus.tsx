
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { QrCode } from "lucide-react";
import { glass } from "@/lib/utils";

interface QRCodeStatusProps {
  petId: string;
}

const QRCodeStatus = ({ petId }: QRCodeStatusProps) => {
  return (
    <Card className={glass}>
      <CardHeader>
        <CardTitle>QR Code Status</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="mb-4">
          <QrCode className="h-12 w-12 mx-auto text-primary" />
        </div>
        <Button asChild className={`w-full ${glass} hover:bg-white/40 transition-all duration-300`}>
          <Link to={`/qr-code/${petId}`}>
            <QrCode className="h-4 w-4 mr-2" /> View & Download QR Code
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default QRCodeStatus;
