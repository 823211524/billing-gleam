import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProfileLoadingState } from "./profile/ProfileLoadingState";
import { ProfileForm } from "./profile/ProfileForm";

export const ProfileSection = () => {
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
    return <ProfileLoadingState />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>Manage your account information</CardDescription>
      </CardHeader>
      <CardContent>
        <ProfileForm 
          formData={formData}
          isEditing={isEditing}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          onEditToggle={() => setIsEditing(true)}
        />
      </CardContent>
    </Card>
  );
};