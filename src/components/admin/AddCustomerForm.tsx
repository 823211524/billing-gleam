import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const AddCustomerForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    givenName: "",
    surname: "",
    email: "",
    address: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // First check if we're authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please log in as an admin to add customers",
        variant: "destructive"
      });
      navigate("/admin/login");
      return;
    }

    try {
      // First check if email exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
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

      // Generate a temporary password
      const temporaryPassword = Math.random().toString(36).slice(-8);

      // Create auth user first
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: temporaryPassword,
        options: {
          data: {
            role: 'CONSUMER'
          }
        }
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Failed to create auth user');
      }

      // Create user in the users table
      const { error } = await supabase
        .from('users')
        .insert({
          email: formData.email,
          given_name: formData.givenName,
          surname: formData.surname,
          address: formData.address,
          role: 'CONSUMER',
          is_enabled: true,
          password_hash: temporaryPassword
        });

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