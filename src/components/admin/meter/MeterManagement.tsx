import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MeterForm } from "./MeterForm";
import { MeterList } from "./MeterList";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Meter {
  id: string;
  qr_code: string;
  longitude: number;
  latitude: number;
  is_enabled: boolean;
  secret_word: string;
  table_name: string;
  unit_rate: number;
  consumer_id?: number;
  created_at: string;
  updated_at: string;
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
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const createMeterMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('meters')
        .insert([{
          qr_code: data.qrCode,
          longitude: data.longitude,
          latitude: data.latitude,
          is_enabled: data.enabled,
          secret_word: data.secretWord,
          table_name: data.tableName,
          unit_rate: data.unitRate,
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meters'] });
    },
  });

  const updateMeterMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!editingMeter) return;

      const { error } = await supabase
        .from('meters')
        .update({
          qr_code: data.qrCode,
          longitude: data.longitude,
          latitude: data.latitude,
          is_enabled: data.enabled,
          secret_word: data.secretWord,
          table_name: data.tableName,
          unit_rate: data.unitRate,
        })
        .eq('id', editingMeter.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meters'] });
      setEditingMeter(null);
    },
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
    },
  });

  const handleCreateMeter = async (data: any) => {
    await createMeterMutation.mutateAsync(data);
  };

  const handleUpdateMeter = async (data: any) => {
    await updateMeterMutation.mutateAsync(data);
  };

  const handleDeleteMeter = async (meterId: string) => {
    await deleteMeterMutation.mutateAsync(meterId);
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
            initialData={editingMeter ? {
              qrCode: editingMeter.qr_code,
              longitude: editingMeter.longitude,
              latitude: editingMeter.latitude,
              enabled: editingMeter.is_enabled,
              secretWord: editingMeter.secret_word,
              tableName: editingMeter.table_name,
              unitRate: editingMeter.unit_rate,
            } : undefined}
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
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};