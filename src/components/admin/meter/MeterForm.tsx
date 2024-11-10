import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const meterSchema = z.object({
  secretWord: z.string().min(1, "Secret word is required"),
  tableName: z.string().min(1, "Table name is required"),
  enabled: z.boolean(),
  dateOfChange: z.string(),
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
      secretWord: "",
      tableName: "",
      enabled: true,
      dateOfChange: new Date().toISOString().split('T')[0],
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

        <FormField
          control={form.control}
          name="dateOfChange"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Change</FormLabel>
              <FormControl>
                <Input {...field} type="date" />
              </FormControl>
              <FormMessage />
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