import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MeterForm } from "./MeterForm";
import { MeterList } from "./MeterList";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Meter {
  id: string;
  secretWord: string;
  tableName: string;
  enabled: boolean;
  dateOfChange: string;
}

export const MeterManagement = () => {
  const [editingMeter, setEditingMeter] = useState<Meter | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: meters = [], isLoading } = useQuery({
    queryKey: ['meters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meters')
        .select('*');
      
      if (error) throw error;
      return data.map(meter => ({
        id: meter.id,
        secretWord: meter.secret_word || '',
        tableName: meter.table_name || '',
        enabled: meter.is_enabled,
        dateOfChange: new Date(meter.updated_at).toISOString().split('T')[0]
      }));
    }
  });

  const createMeterMutation = useMutation({
    mutationFn: async (data: Omit<Meter, 'id'>) => {
      const { error } = await supabase
        .from('meters')
        .insert([{
          secret_word: data.secretWord,
          table_name: data.tableName,
          is_enabled: data.enabled,
          qr_code: Math.random().toString(36).substr(2, 9), // Generate a random QR code
          longitude: 0, // Default values
          latitude: 0
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meters'] });
      toast({
        title: "Success",
        description: "Meter created successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const updateMeterMutation = useMutation({
    mutationFn: async (data: Meter) => {
      const { error } = await supabase
        .from('meters')
        .update({
          secret_word: data.secretWord,
          table_name: data.tableName,
          is_enabled: data.enabled
        })
        .eq('id', data.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meters'] });
      setEditingMeter(null);
      toast({
        title: "Success",
        description: "Meter updated successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const deleteMeterMutation = useMutation({
    mutationFn: async (meterId: string) => {
      const { error } = await supabase
        .from('meters')
        .delete()
        .eq('id', meterId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meters'] });
      toast({
        title: "Success",
        description: "Meter deleted successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

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
            onSubmit={editingMeter ? updateMeterMutation.mutate : createMeterMutation.mutate}
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
            isLoading={isLoading}
            onEdit={setEditingMeter}
            onDelete={deleteMeterMutation.mutate}
          />
        </CardContent>
      </Card>
    </div>
  );
};