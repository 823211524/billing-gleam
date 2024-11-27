import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const AddCustomerForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    givenName: "",
    surname: "",
    email: "",
    address: "",
    meterId: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // First check if email exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', formData.email)
        .single();

      if (existingUser) {
        toast({
          title: "Email already exists",
          description: "Please use a different email address",
          variant: "destructive"
        });
        return;
      }

      // If email doesn't exist, proceed with user creation
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            email: formData.email,
            given_name: formData.givenName,
            surname: formData.surname,
            address: formData.address,
            role: 'CONSUMER',
            password_hash: 'temporary_hash',
            is_enabled: true
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // If a meter ID was provided, update the meter with the new user's ID
      if (formData.meterId && data) {
        const { error: meterError } = await supabase
          .from('meters')
          .update({ consumer_id: data.id })
          .eq('id', formData.meterId);

        if (meterError) throw meterError;
      }

      queryClient.invalidateQueries({ queryKey: ['customers'] });

      toast({
        title: "Customer added successfully",
        description: "The customer has been registered in the system"
      });
      
      setFormData({
        givenName: "",
        surname: "",
        email: "",
        address: "",
        meterId: ""
      });
    } catch (error: any) {
      toast({
        title: "Error adding customer",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="givenName">Given Name</Label>
          <Input
            id="givenName"
            value={formData.givenName}
            onChange={(e) => setFormData({ ...formData, givenName: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="surname">Surname</Label>
          <Input
            id="surname"
            value={formData.surname}
            onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="meterId">Meter ID (Optional)</Label>
        <Input
          id="meterId"
          value={formData.meterId}
          onChange={(e) => setFormData({ ...formData, meterId: e.target.value })}
        />
      </div>
      <Button type="submit" className="w-full">Add Customer</Button>
    </form>
  );
};