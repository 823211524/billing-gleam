import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MeterForm } from "./MeterForm";
import { MeterList } from "./MeterList";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Meter } from "@/types/meter";
import { generateMeterQRCode } from "@/utils/qrCodeGenerator";

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
      return data as Meter[];
    },
  });

  const createMeterMutation = useMutation({
    mutationFn: async (data: Partial<Meter>) => {
      // Generate QR code for the meter
      const qrCode = await generateMeterQRCode(crypto.randomUUID());
      
      const { error } = await supabase
        .from('meters')
        .insert([{
          qr_code: qrCode,
          longitude: data.longitude,
          latitude: data.latitude,
          is_enabled: data.is_enabled,
          secret_word: data.secret_word,
          table_name: data.table_name,
          unit_rate: data.unit_rate,
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meters'] });
      toast({
        title: "Success",
        description: "Meter created successfully",
      });
    },
  });

  const updateMeterMutation = useMutation({
    mutationFn: async (data: Partial<Meter>) => {
      if (!editingMeter) return;

      const { error } = await supabase
        .from('meters')
        .update({
          qr_code: data.qr_code,
          longitude: data.longitude,
          latitude: data.latitude,
          is_enabled: data.is_enabled,
          secret_word: data.secret_word,
          table_name: data.table_name,
          unit_rate: data.unit_rate,
        })
        .eq('id', editingMeter.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meters'] });
      setEditingMeter(null);
      toast({
        title: "Success",
        description: "Meter updated successfully",
      });
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
      toast({
        title: "Success",
        description: "Meter deleted successfully",
      });
    },
  });

  const handleCreateMeter = async (data: Partial<Meter>) => {
    await createMeterMutation.mutateAsync(data);
  };

  const handleUpdateMeter = async (data: Partial<Meter>) => {
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
            initialData={editingMeter}
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
