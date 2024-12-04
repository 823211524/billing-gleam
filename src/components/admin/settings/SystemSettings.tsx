import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const SystemSettings = () => {
  const [settings, setSettings] = useState({
    billingRate: 0,
    readingDueDay: 1,
    paymentGracePeriod: 14,
  });
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      // Store settings in the meters table with a special flag
      const { error } = await supabase
        .from('meters')
        .update({
          billing_settings: {
            billing_rate: settings.billingRate,
            reading_due_day: settings.readingDueDay,
            payment_grace_period: settings.paymentGracePeriod,
          }
        })
        .eq('is_settings', true);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="billingRate">Billing Rate (per kWh)</Label>
          <Input
            id="billingRate"
            type="number"
            step="0.01"
            value={settings.billingRate}
            onChange={(e) => setSettings(prev => ({ ...prev, billingRate: parseFloat(e.target.value) }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="readingDueDay">Reading Due Day</Label>
          <Input
            id="readingDueDay"
            type="number"
            min="1"
            max="28"
            value={settings.readingDueDay}
            onChange={(e) => setSettings(prev => ({ ...prev, readingDueDay: parseInt(e.target.value) }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gracePeriod">Payment Grace Period (days)</Label>
          <Input
            id="gracePeriod"
            type="number"
            min="0"
            value={settings.paymentGracePeriod}
            onChange={(e) => setSettings(prev => ({ ...prev, paymentGracePeriod: parseInt(e.target.value) }))}
          />
        </div>

        <Button onClick={handleSave} className="w-full">Save Settings</Button>
      </CardContent>
    </Card>
  );
};

export default SystemSettings;