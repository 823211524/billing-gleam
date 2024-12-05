import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProfileFormData {
  given_name: string;
  surname: string;
  email: string;
  address: string;
}

interface ProfileFormProps {
  formData: ProfileFormData;
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onEditToggle: () => void;
}

export const ProfileForm = ({
  formData,
  isEditing,
  onInputChange,
  onSubmit,
  onEditToggle,
}: ProfileFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Given Name</label>
          <Input 
            name="given_name"
            value={formData.given_name} 
            onChange={onInputChange}
            readOnly={!isEditing}
            className={!isEditing ? 'bg-gray-50' : ''}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Surname</label>
          <Input 
            name="surname"
            value={formData.surname} 
            onChange={onInputChange}
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
          onChange={onInputChange}
          readOnly={!isEditing}
          className={!isEditing ? 'bg-gray-50' : ''}
        />
      </div>

      <Button 
        variant={isEditing ? "default" : "outline"}
        onClick={() => {
          if (isEditing) {
            onSubmit();
          } else {
            onEditToggle();
          }
        }}
      >
        {isEditing ? 'Save Changes' : 'Edit Profile'}
      </Button>
    </div>
  );
};