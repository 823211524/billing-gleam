import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";

const meterSchema = z.object({
  qrCode: z.string().optional(), // Made optional
  secretWord: z.string().min(1, "Secret word is required"),
  tableName: z.string().min(1, "Table name is required"),
  longitude: z.number().min(-180).max(180),
  latitude: z.number().min(-90).max(90),
  enabled: z.boolean(),
  unitRate: z.number().min(0, "Unit rate must be positive"),
});

type MeterFormData = z.infer<typeof meterSchema>;

interface MeterFormProps {
  initialData?: MeterFormData;
  onSubmit: (data: MeterFormData) => Promise<void>;
  mode: 'create' | 'edit';
}

export const MeterForm = ({ initialData, onSubmit, mode }: MeterFormProps) => {
  const { toast } = useToast();
  const form = useForm<MeterFormData>({
    resolver: zodResolver(meterSchema),
    defaultValues: initialData || {
      qrCode: "",
      secretWord: "",
      tableName: "",
      longitude: 0,
      latitude: 0,
      enabled: true,
      unitRate: 0,
    },
  });

  const handleSubmit = async (data: MeterFormData) => {
    try {
      await onSubmit(data);
      toast({
        title: `Meter ${mode === 'create' ? 'created' : 'updated'} successfully`,
        description: `The meter has been ${mode === 'create' ? 'added to' : 'updated in'} the system`,
      });
      if (mode === 'create') form.reset();
    } catch (error) {
      toast({
        title: `Error ${mode === 'create' ? 'creating' : 'updating'} meter`,
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="qrCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>QR Code (Optional)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Optional identifier for the meter</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.000001"
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.000001"
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="unitRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit Rate</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01"
                  {...field}
                  onChange={e => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormDescription>Cost per unit for billing calculations</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="secretWord"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Secret Word</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tableName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Table Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="enabled"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel>Enabled</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {mode === 'create' ? 'Add Meter' : 'Update Meter'}
        </Button>
      </form>
    </Form>
  );
};