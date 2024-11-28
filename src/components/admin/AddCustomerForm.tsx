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
      // First check if email exists - using .maybeSingle() instead of .single()
      const { data: existingUser, error: checkError } = await supabase
        .from('consumers')
        .select('email')
        .eq('email', formData.email)
        .maybeSingle();

      if (checkError) throw checkError;

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
        .from('consumers')
        .insert([
          {
            email: formData.email,
            given_name: formData.givenName,
            surname: formData.surname,
            address: formData.address,
            is_enabled: true
          }
        ])
        .select();

      if (error) throw error;

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
      <Button type="submit" className="w-full">Add Customer</Button>
    </form>
  );
};