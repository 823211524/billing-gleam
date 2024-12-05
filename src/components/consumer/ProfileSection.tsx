import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { User } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProfileSectionProps {
  user?: User;
}

export const ProfileSection = ({ user }: ProfileSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    given_name: '',
    surname: '',
    email: '',
    address: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (!authUser?.id) {
          toast({
            title: "Error",
            description: "No authenticated user found",
            variant: "destructive",
          });
          return;
        }

        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (error) throw error;

        if (userData) {
          setFormData({
            given_name: userData.given_name || '',
            surname: userData.surname || '',
            email: userData.email || '',
            address: userData.address || ''
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser?.id) {
        toast({
          title: "Error",
          description: "No authenticated user found",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('users')
        .update({
          given_name: formData.given_name,
          surname: formData.surname,
          address: formData.address,
        })
        .eq('id', authUser.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-48">
            <p className="text-gray-500">Loading profile data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

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