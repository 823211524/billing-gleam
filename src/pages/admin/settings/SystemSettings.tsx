import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NotificationSettings } from "@/components/admin/settings/NotificationSettings";
import { BillingSettings } from "@/components/admin/settings/BillingSettings";
import { SystemSettingsFormData } from "@/components/admin/settings/types";

const settingsSchema = z.object({
  billing_rate: z.number().min(0, "Billing rate must be positive"),
  reading_due_day: z.number().min(1).max(28),
  payment_grace_period: z.number().min(1),
  enable_notifications: z.boolean(),
  enable_auto_billing: z.boolean(),
  enable_reading_reminders: z.boolean(),
  minimum_reading_interval: z.number().min(1),
  maximum_reading_interval: z.number().min(1)
});

const SystemSettings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<SystemSettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      billing_rate: 0,
      reading_due_day: 1,
      payment_grace_period: 7,
      enable_notifications: true,
      enable_auto_billing: false,
      enable_reading_reminders: true,
      minimum_reading_interval: 25,
      maximum_reading_interval: 35,
    }
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching settings:', error);
        return;
      }

      if (data) {
        form.reset(data);
      }
    };

    fetchSettings();
  }, [form]);

  const onSubmit = async (data: SystemSettingsFormData) => {
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          id: 1,
          billing_rate: data.billing_rate,
          reading_due_day: data.reading_due_day,
          payment_grace_period: data.payment_grace_period,
          enable_notifications: data.enable_notifications,
          enable_auto_billing: data.enable_auto_billing,
          enable_reading_reminders: data.enable_reading_reminders,
          minimum_reading_interval: data.minimum_reading_interval,
          maximum_reading_interval: data.maximum_reading_interval,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Settings updated",
        description: "System settings have been updated successfully"
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: "Error",
        description: "Failed to update system settings",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Button 
        variant="outline" 
        onClick={() => navigate('/admin/dashboard')}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <BillingSettings form={form} />
              <NotificationSettings form={form} />
              <Button type="submit" className="w-full">Save Settings</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSettings;