import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { SystemSettingsFormData } from "./types";

interface BillingSettingsProps {
  form: UseFormReturn<SystemSettingsFormData>;
}

export const BillingSettings = ({ form }: BillingSettingsProps) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};