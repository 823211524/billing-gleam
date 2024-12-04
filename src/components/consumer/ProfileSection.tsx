import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { User } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProfileSectionProps {
  user?: User;
}

export const ProfileSection = ({ user }: ProfileSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    given_name: user?.given_name || '',
    surname: user?.surname || '',
    email: user?.email || '',
    address: user?.address || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          given_name: formData.given_name,
          surname: formData.surname,
          address: formData.address,
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>Manage your account information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Given Name</label>
              <Input 
                name="given_name"
                value={formData.given_name} 
                onChange={handleInputChange}
                readOnly={!isEditing}
                className={!isEditing ? 'bg-gray-50' : ''}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Surname</label>
              <Input 
                name="surname"
                value={formData.surname} 
                onChange={handleInputChange}
                readOnly={!isEditing}
                className={!isEditing ? 'bg-gray-50' : ''}
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input 
              name="email"
              value={formData.email} 
              readOnly 
              className="bg-gray-50"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Address</label>
            <Input 
              name="address"
              value={formData.address} 
              onChange={handleInputChange}
              readOnly={!isEditing}
              className={!isEditing ? 'bg-gray-50' : ''}
            />
          </div>

          <Button 
            variant={isEditing ? "default" : "outline"}
            onClick={() => {
              if (isEditing) {
                handleSubmit();
              } else {
                setIsEditing(true);
              }
            }}
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};