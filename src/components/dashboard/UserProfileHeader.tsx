
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
import { User, LogOut, Settings, MapPin, Mail, Phone } from "lucide-react";
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
              <AvatarImage src={userProfile.profile_picture_url} />
            ) : (
              <AvatarFallback className="banking-gradient text-white font-semibold">
                {getUserInitials()}
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-4" align="end" forceMount>
        <div className="flex flex-col space-y-4">
          {/* Profile Header */}
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              {userProfile?.profile_picture_url ? (
                <AvatarImage src={userProfile.profile_picture_url} />
              ) : (
                <AvatarFallback className="banking-gradient text-white font-semibold text-lg">
                  {getUserInitials()}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium leading-none">
                {userProfile?.full_name || 'User'}
              </p>
              <p className="text-xs leading-none text-muted-foreground mt-1">
                Professional Account Holder
              </p>
              <p className="text-xs leading-none text-muted-foreground mt-1">
                Account: {userProfile?.account_number}
              </p>
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* Profile Details */}
          <div className="space-y-3">
            {userProfile?.email && (
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-blue-600" />
                <span className="text-gray-600">{userProfile.email}</span>
              </div>
            )}
            
            {userProfile?.phone && (
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-blue-600" />
                <span className="text-gray-600">{userProfile.phone}</span>
              </div>
            )}

            {userProfile?.address && (
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span className="text-gray-600">
                  {typeof userProfile.address === 'object' 
                    ? `${userProfile.address.city || ''}, ${userProfile.address.state || ''}`
                    : userProfile.address
                  }
                </span>
              </div>
            )}

            <div className="text-xs text-gray-500">
              Account Balance: ${userProfile?.balance?.toLocaleString() || '0.00'}
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
