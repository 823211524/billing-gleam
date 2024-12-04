import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReadingValidation } from "@/components/admin/ReadingValidation";

const ReviewReadings = () => {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Review Readings</CardTitle>
        </CardHeader>
        <CardContent>
          <ReadingValidation />
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewReadings;