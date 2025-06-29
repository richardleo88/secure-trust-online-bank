
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, MapPin, Briefcase, Shield, LogOut, Calendar, CreditCard, FileText, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (data) {
          setUserProfile(data);
        } else if (error) {
          console.error('Error fetching profile:', error);
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

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

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Verification</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Verification Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-banking-navy">Profile</h2>
            <p className="text-banking-slate">Loading your account information...</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <User className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-banking-navy">Profile</h2>
          <p className="text-banking-slate">Your professional banking account information</p>
        </div>
      </div>

      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="w-24 h-24">
              {userProfile?.profile_picture_url ? (
                <AvatarImage src={userProfile.profile_picture_url} />
              ) : (
                <AvatarFallback className="text-2xl banking-gradient text-white">
                  {getUserInitials()}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
          <CardTitle className="flex items-center justify-center gap-2">
            {userProfile?.full_name || 'User'}
            {getVerificationBadge(userProfile?.verification_status)}
          </CardTitle>
          <CardDescription>Professional Banking Account Holder</CardDescription>
          <div className="text-sm text-green-600 font-medium">
            Member Since: {formatDate(userProfile?.created_at)}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Personal Information
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{userProfile?.full_name || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="font-medium">{formatDate(userProfile?.date_of_birth)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Mail className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{userProfile?.email || user?.email || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Phone className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Primary Phone</p>
                  <p className="font-medium">{userProfile?.phone || 'Not provided'}</p>
                </div>
              </div>

              {userProfile?.secondary_phone && (
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Secondary Phone</p>
                    <p className="font-medium">{userProfile.secondary_phone}</p>
                  </div>
                </div>
              )}

              {userProfile?.mother_maiden_name && (
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <User className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Mother's Maiden Name</p>
                    <p className="font-medium">****** (Secured)</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              Account Information
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Account Number</p>
                  <p className="font-medium">{userProfile?.account_number || 'Not assigned'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Account Type</p>
                  <p className="font-medium capitalize">{userProfile?.account_type || 'Checking'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg bg-green-50 md:col-span-2">
                <Shield className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Current Balance</p>
                  <p className="font-bold text-green-600 text-lg">${userProfile?.balance?.toLocaleString() || '0.00'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          {userProfile?.address && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Address Information
              </h3>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <MapPin className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">
                    {typeof userProfile.address === 'object' 
                      ? `${userProfile.address.street || ''}, ${userProfile.address.city || ''}, ${userProfile.address.state || ''} ${userProfile.address.zip || ''}`
                      : userProfile.address
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Employment Information */}
          {userProfile?.employment_status && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                Employment Information
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Employment Status</p>
                    <p className="font-medium capitalize">{userProfile.employment_status.replace('_', ' ')}</p>
                  </div>
                </div>

                {userProfile?.employer_name && (
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Employer</p>
                      <p className="font-medium">{userProfile.employer_name}</p>
                    </div>
                  </div>
                )}

                {userProfile?.annual_income && (
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Annual Income</p>
                      <p className="font-medium">${userProfile.annual_income.toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Document Information */}
          {userProfile?.document_type && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Verification Documents
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Document Type</p>
                    <p className="font-medium capitalize">{userProfile.document_type.replace('_', ' ')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Document Number</p>
                    <p className="font-medium">***{userProfile.document_number?.slice(-4) || ''}</p>
                  </div>
                </div>

                {userProfile?.document_expiry_date && (
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Document Expiry</p>
                      <p className="font-medium">{formatDate(userProfile.document_expiry_date)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

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
