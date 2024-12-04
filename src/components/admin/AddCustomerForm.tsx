import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const userSchema = z.object({
  givenName: z.string().min(2, "Given name must be at least 2 characters"),
  surname: z.string().min(2, "Surname must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address must be at least 5 characters"),
});

export const AddCustomerForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    givenName: "",
    surname: "",
    email: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate form data
      const validatedData = userSchema.parse(formData);
      
      // Generate a temporary password (in production, you'd want to send this via email)
      const tempPassword = Math.random().toString(36).slice(-8);
      
      const { error } = await supabase
        .from('users')
        .insert({
          given_name: validatedData.givenName,
          surname: validatedData.surname,
          email: validatedData.email,
          address: validatedData.address,
          password_hash: tempPassword, // In production, this should be properly hashed
          role: 'CONSUMER',
          is_enabled: true
        });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Customer added successfully. Temporary password: " + tempPassword
      });
      
      setFormData({
        givenName: "",
        surname: "",
        email: "",
        address: "",
      });
      
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add customer",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="surname">Surname</Label>
          <Input
            id="surname"
            value={formData.surname}
            onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
            required
            disabled={isLoading}
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
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          required
          disabled={isLoading}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Adding Customer..." : "Add Customer"}
      </Button>
    </form>
  );
};