import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MeterManagement } from "@/components/admin/meter/MeterManagement";

const ViewMeters = () => {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Manage Meters</CardTitle>
        </CardHeader>
        <CardContent>
          <MeterManagement />
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewMeters;