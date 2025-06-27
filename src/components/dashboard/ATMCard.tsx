
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Lock, Unlock, Eye, EyeOff, Settings } from "lucide-react";

const ATMCard = () => {
  const [cardLocked, setCardLocked] = useState(false);
  const [showPin, setShowPin] = useState(false);

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
                <p className="text-lg font-mono">**** **** **** 5678</p>
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
                <p className="font-semibold">JOHN SMITH</p>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default ATMCard;
