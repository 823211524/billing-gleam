import { Card, CardContent } from "@/components/ui/card";

export const ProfileLoadingState = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-center h-48">
          <p className="text-gray-500">Loading profile data...</p>
        </div>
      </CardContent>
    </Card>
  );
};