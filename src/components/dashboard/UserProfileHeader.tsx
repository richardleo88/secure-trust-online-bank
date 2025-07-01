
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, Settings, MapPin, Mail, Phone, CreditCard, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const UserProfileHeader = () => {
  const { user, signOut } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    // Create dummy profile data based on authenticated user
    if (user) {
      const dummyProfile = {
        id: user.id,
        full_name: user.user_metadata?.full_name || 'User',
        email: user.email,
        phone: '+1 (555) 123-4567',
        address: {
          city: 'New York',
          state: 'NY'
        },
        account_number: '****1234',
        balance: 5000.00,
        profile_picture_url: null
      };
      setUserProfile(dummyProfile);
    }
  }, [user]);

  const getUserInitials = () => {
    if (userProfile?.full_name) {
      return userProfile.full_name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            {userProfile?.profile_picture_url ? (
              <AvatarImage src={userProfile.profile_picture_url} className="object-cover" />
            ) : (
              <AvatarFallback className="banking-gradient text-white font-semibold">
                {getUserInitials()}
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 p-4" align="end" forceMount>
        <div className="flex flex-col space-y-4">
          {/* Enhanced Profile Header */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              {userProfile?.profile_picture_url ? (
                <AvatarImage src={userProfile.profile_picture_url} className="object-cover" />
              ) : (
                <AvatarFallback className="banking-gradient text-white font-semibold text-xl">
                  {getUserInitials()}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <p className="text-base font-semibold leading-none">
                {userProfile?.full_name || 'User'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Professional Account Holder
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-600 font-medium">Account Active</span>
              </div>
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* Enhanced Profile Details */}
          <div className="space-y-3">
            {userProfile?.email && (
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="h-4 w-4 text-blue-600" />
                <span className="text-gray-600 truncate flex-1">{userProfile.email}</span>
              </div>
            )}
            
            {userProfile?.phone && (
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="h-4 w-4 text-blue-600" />
                <span className="text-gray-600">{userProfile.phone}</span>
              </div>
            )}

            {userProfile?.address && (
              <div className="flex items-center space-x-3 text-sm">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span className="text-gray-600">
                  {typeof userProfile.address === 'object' 
                    ? `${userProfile.address.city || ''}, ${userProfile.address.state || ''}`
                    : userProfile.address
                  }
                </span>
              </div>
            )}

            <div className="flex items-center space-x-3 text-sm">
              <CreditCard className="h-4 w-4 text-blue-600" />
              <span className="text-gray-600">
                Account: {userProfile?.account_number}
              </span>
            </div>

            <div className="flex items-center space-x-3 text-sm bg-green-50 p-2 rounded-lg">
              <Shield className="h-4 w-4 text-green-600" />
              <div className="flex-1">
                <span className="text-gray-600 text-xs">Current Balance</span>
                <p className="font-bold text-green-600">${userProfile?.balance?.toLocaleString() || '0.00'}</p>
              </div>
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* Actions */}
          <div className="space-y-1">
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>View Full Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Account Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer text-red-600 focus:text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileHeader;
