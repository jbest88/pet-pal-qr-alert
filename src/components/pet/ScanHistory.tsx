
import { ScanEvent } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ScanHistoryProps {
  scanEvents: ScanEvent[];
  petName: string;
}

const ScanHistory = ({ scanEvents, petName }: ScanHistoryProps) => {
  if (scanEvents.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Scan History</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          When someone scans {petName}'s QR code, the scan events will appear here with location information.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {scanEvents.map((event) => (
        <Card key={event.id}>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:justify-between">
              <div>
                <div className="flex items-center text-gray-600 mb-2">
                  <Clock className="h-4 w-4 mr-2" />
                  {formatDate(event.timestamp || event.createdAt)}
                </div>
                
                {event.location && (
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.location.address || `Lat: ${event.location.lat}, Lng: ${event.location.lng}`}
                  </div>
                )}
                
                {event.scannerContact && (
                  <p className="mb-2">
                    <span className="font-semibold">Contact:</span> {event.scannerContact}
                  </p>
                )}
                
                {event.message && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <p className="text-gray-700">{event.message}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ScanHistory;
