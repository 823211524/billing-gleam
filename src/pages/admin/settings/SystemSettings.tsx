import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const settingsSchema = z.object({
  billing_rate: z.number().min(0, "Billing rate must be positive"),
  reading_due_day: z.number().min(1, "Due day must be between 1 and 28").max(28, "Due day must be between 1 and 28"),
  payment_grace_period: z.number().min(1, "Grace period must be at least 1 day"),
  enable_notifications: z.boolean(),
  enable_auto_billing: z.boolean(),
  enable_reading_reminders: z.boolean(),
  minimum_reading_interval: z.number().min(1, "Minimum interval must be at least 1 day"),
  maximum_reading_interval: z.number().min(1, "Maximum interval must be at least 1 day"),
});

const SystemSettings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof settingsSchema>>({
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

  const onSubmit = async (data: z.infer<typeof settingsSchema>) => {
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          id: 1,
          ...data,
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="billing_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing Rate (per kWh)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormDescription>Set the rate per kilowatt-hour</FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reading_due_day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reading Due Day</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="28" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormDescription>Day of the month when readings are due</FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="payment_grace_period"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Grace Period (days)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormDescription>Number of days after bill generation before late fees apply</FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="enable_notifications"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div>
                      <FormLabel>Enable Notifications</FormLabel>
                      <FormDescription>Send notifications to users</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="enable_auto_billing"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div>
                      <FormLabel>Enable Auto-Billing</FormLabel>
                      <FormDescription>Automatically generate bills when readings are validated</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="enable_reading_reminders"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div>
                      <FormLabel>Enable Reading Reminders</FormLabel>
                      <FormDescription>Send reminders for meter readings</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="minimum_reading_interval"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Reading Interval (days)</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maximum_reading_interval"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Reading Interval (days)</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full">Save Settings</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSettings;