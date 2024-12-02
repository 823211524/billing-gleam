import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MeterForm } from "./MeterForm";
import { MeterList } from "./MeterList";
import { useToast } from "@/components/ui/use-toast";

interface Meter {
  id: string;
  secretWord: string;
  tableName: string;
  enabled: boolean;
  dateOfChange: string;
}

export const MeterManagement = () => {
  const [meters, setMeters] = useState<Meter[]>([]);
  const [editingMeter, setEditingMeter] = useState<Meter | null>(null);
  const { toast } = useToast();

  const handleCreateMeter = async (data: Omit<Meter, 'id'>) => {
    // TODO: Implement API call
    const newMeter = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
    };
    setMeters([...meters, newMeter]);
  };

  const handleUpdateMeter = async (data: Omit<Meter, 'id'>) => {
    if (!editingMeter) return;
    // TODO: Implement API call
    const updatedMeters = meters.map((meter) =>
      meter.id === editingMeter.id ? { ...meter, ...data } : meter
    );
    setMeters(updatedMeters);
    setEditingMeter(null);
  };

  const handleDeleteMeter = async (meterId: string) => {
    // TODO: Implement API call
    const updatedMeters = meters.filter((meter) => meter.id !== meterId);
    setMeters(updatedMeters);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{editingMeter ? 'Edit Meter' : 'Add New Meter'}</CardTitle>
          <CardDescription>
            {editingMeter
              ? 'Modify the meter information below'
              : 'Enter the details for the new meter'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MeterForm
            mode={editingMeter ? 'edit' : 'create'}
            initialData={editingMeter || undefined}
            onSubmit={editingMeter ? handleUpdateMeter : handleCreateMeter}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Meters</CardTitle>
          <CardDescription>View and manage all meters in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <MeterList
            meters={meters}
            onEdit={setEditingMeter}
            onDelete={handleDeleteMeter}
          />
        </CardContent>
      </Card>
    </div>
  );
};