import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const settingsSchema = z.object({
  billing_rate: z.number().min(0, "Billing rate must be positive"),
  reading_due_day: z.number().min(1, "Due day must be between 1 and 28").max(28, "Due day must be between 1 and 28"),
  payment_grace_period: z.number().min(1, "Grace period must be at least 1 day")
});

const SystemSettings = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      billing_rate: 0,
      reading_due_day: 1,
      payment_grace_period: 7
    }
  });

  const onSubmit = async (data: z.infer<typeof settingsSchema>) => {
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          id: 1, // Single row for system settings
          billing_rate: data.billing_rate,
          reading_due_day: data.reading_due_day,
          payment_grace_period: data.payment_grace_period
        });

      if (error) throw error;

      toast({
        title: "Settings updated",
        description: "System settings have been updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update system settings",
        variant: "destructive"
      });
    }
  };

  return (
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

            <Button type="submit">Save Settings</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SystemSettings;