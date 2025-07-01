
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, CreditCard, MapPin, Building } from "lucide-react";

interface CreateUserDialogProps {
  onSubmit: (userData: any) => void;
  onCancel: () => void;
}

const CreateUserDialog = ({ onSubmit, onCancel }: CreateUserDialogProps) => {
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    phone: "",
    balance: "0",
    verification_status: "pending",
    is_active: true,
    is_admin: false,
    admin_role: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States"
    }
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    
    if (!formData.full_name) newErrors.full_name = "Full name is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    
    const balance = parseFloat(formData.balance);
    if (isNaN(balance) || balance < 0) newErrors.balance = "Balance must be a valid positive number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const userData = {
      ...formData,
      balance: parseFloat(formData.balance),
      admin_role: formData.is_admin ? formData.admin_role : undefined
    };

    onSubmit(userData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="user@example.com"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                placeholder="John Doe"
                className={errors.full_name ? "border-red-500" : ""}
              />
              {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>}
            </div>

            <div>
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number *
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <Label htmlFor="balance" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Initial Balance ($)
              </Label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                min="0"
                value={formData.balance}
                onChange={(e) => handleInputChange("balance", e.target.value)}
                placeholder="0.00"
                className={errors.balance ? "border-red-500" : ""}
              />
              {errors.balance && <p className="text-red-500 text-sm mt-1">{errors.balance}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5" />
            Address Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              value={formData.address.street}
              onChange={(e) => handleAddressChange("street", e.target.value)}
              placeholder="123 Main Street"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.address.city}
                onChange={(e) => handleAddressChange("city", e.target.value)}
                placeholder="New York"
              />
            </div>

            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.address.state}
                onChange={(e) => handleAddressChange("state", e.target.value)}
                placeholder="NY"
              />
            </div>

            <div>
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                value={formData.address.zipCode}
                onChange={(e) => handleAddressChange("zipCode", e.target.value)}
                placeholder="10001"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building className="h-5 w-5" />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="verification_status">Verification Status</Label>
              <Select 
                value={formData.verification_status} 
                onValueChange={(value) => handleInputChange("verification_status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="is_active">Account Status</Label>
              <Select 
                value={formData.is_active ? "active" : "inactive"} 
                onValueChange={(value) => handleInputChange("is_active", value === "active")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="is_admin">Admin Status</Label>
              <Select 
                value={formData.is_admin ? "admin" : "user"} 
                onValueChange={(value) => handleInputChange("is_admin", value === "admin")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Regular User</SelectItem>
                  <SelectItem value="admin">Admin User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.is_admin && (
              <div>
                <Label htmlFor="admin_role">Admin Role</Label>
                <Select 
                  value={formData.admin_role} 
                  onValueChange={(value) => handleInputChange("admin_role", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select admin role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button type="submit" className="w-full sm:w-auto">
          Create User
        </Button>
      </div>
    </form>
  );
};

export default CreateUserDialog;
