import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/types";

export const AddCustomerForm = () => {
  const { toast } = useToast();
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
      // TODO: Implement actual API call
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
    } catch (error) {
      toast({
        title: "Error adding customer",
        description: "Please try again later",
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
        <Label htmlFor="meterId">Meter ID</Label>
        <Input
          id="meterId"
          value={formData.meterId}
          onChange={(e) => setFormData({ ...formData, meterId: e.target.value })}
          required
        />
      </div>
      <Button type="submit" className="w-full">Add Customer</Button>
    </form>
  );
};