
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, MapPin, Briefcase, Shield, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <User className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-banking-navy">Profile</h2>
          <p className="text-banking-slate">Manage your account information</p>
        </div>
      </div>

      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="text-2xl banking-gradient text-white">JS</AvatarFallback>
            </Avatar>
          </div>
          <CardTitle>John Smith</CardTitle>
          <CardDescription>Premium Account Holder</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <User className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">John Smith</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Briefcase className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Occupation</p>
                <p className="font-medium">Software Engineer</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Shield className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">SSN</p>
                <p className="font-medium">***-**-5678</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Mail className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">john.smith@email.com</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Phone className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">+1 (555) 123-4567</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <MapPin className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">123 Main Street, New York, NY 10001</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t">
            <Button 
              onClick={handleLogout}
              variant="destructive" 
              className="w-full flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
