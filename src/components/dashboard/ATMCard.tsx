
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Lock, Unlock, Eye, EyeOff, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const ATMCard = () => {
  const [cardLocked, setCardLocked] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data && !error) {
        setUserProfile(data);
      }
    };

    fetchUserProfile();
  }, [user]);

  // Generate last 4 digits from user ID or account number
  const getCardLastFour = () => {
    if (userProfile?.account_number) {
      return userProfile.account_number.slice(-4);
    }
    return "5678";
  };

  const getCardholderName = () => {
    if (userProfile?.full_name) {
      return userProfile.full_name.toUpperCase();
    }
    return user?.user_metadata?.full_name?.toUpperCase() || "JOHN SMITH";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <CreditCard className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-banking-navy">ATM Card Management</h2>
          <p className="text-banking-slate">Manage your debit card settings</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your ATM Card</CardTitle>
          <CardDescription>UnionTrust Visa Debit Card</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 rounded-xl text-white relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <span className="text-xs opacity-75">VISA</span>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs opacity-75">Card Number</p>
                <p className="text-lg font-mono">**** **** **** {getCardLastFour()}</p>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="text-xs opacity-75">Valid Thru</p>
                  <p className="font-mono">12/28</p>
                </div>
                <div>
                  <p className="text-xs opacity-75">CVV</p>
                  <p className="font-mono">{showPin ? "123" : "***"}</p>
                </div>
              </div>
              <div>
                <p className="text-xs opacity-75">Cardholder Name</p>
                <p className="font-semibold">{getCardholderName()}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={cardLocked ? "destructive" : "outline"}
              onClick={() => setCardLocked(!cardLocked)}
              className="flex items-center gap-2"
            >
              {cardLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
              {cardLocked ? "Unlock Card" : "Lock Card"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowPin(!showPin)}
              className="flex items-center gap-2"
            >
              {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showPin ? "Hide CVV" : "Show CVV"}
            </Button>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Card Settings</h3>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Change PIN
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <CreditCard className="h-4 w-4 mr-2" />
                Request New Card
              </Button>
            </div>
          </div>

          {userProfile && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Account Details</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Account Number:</span> {userProfile.account_number}</p>
                <p><span className="font-medium">Email:</span> {userProfile.email}</p>
                <p><span className="font-medium">Phone:</span> {userProfile.phone || 'Not provided'}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ATMCard;
