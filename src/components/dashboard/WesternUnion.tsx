import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Banknote, Users } from "lucide-react";
import TransferPinModal from "./TransferPinModal";
import TransferSuccessModal from "./TransferSuccessModal";

const WesternUnion = () => {
  const [amount, setAmount] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientCountry, setRecipientCountry] = useState("");
  const [recipientCity, setRecipientCity] = useState("");
  const [transferPurpose, setTransferPurpose] = useState("");
  const [showPinModal, setShowPinModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transferData, setTransferData] = useState<any>({});

  const countries = [
    "Mexico", "Philippines", "India", "China", "Guatemala", "El Salvador",
    "Dominican Republic", "Honduras", "Nigeria", "Colombia", "Ecuador",
    "Peru", "Jamaica", "Haiti", "Bangladesh", "Pakistan", "Vietnam",
    "Ghana", "Kenya", "Morocco", "Egypt", "Jordan", "Lebanon", "Nepal"
  ];

  const purposes = [
    "Family Support", "Education", "Medical Expenses", "Business",
    "Property Purchase", "Travel", "Emergency", "Other"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      amount, recipientName, recipientCountry, recipientCity, transferPurpose
    };
    setTransferData(data);
    setShowPinModal(true);
  };

  const handlePinSuccess = () => {
    setShowPinModal(false);
    setShowSuccessModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
          <Banknote className="h-5 w-5 text-yellow-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-banking-navy">Western Union Transfer</h2>
          <p className="text-banking-slate">Send money worldwide through Western Union</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Western Union Transfer
          </CardTitle>
          <CardDescription>
            Send money for cash pickup or direct to bank account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Send Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipientName">Recipient Full Name</Label>
              <Input
                id="recipientName"
                placeholder="First and last name (as on ID)"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recipientCountry">Recipient Country</Label>
                <Select value={recipientCountry} onValueChange={setRecipientCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipientCity">Recipient City</Label>
                <Input
                  id="recipientCity"
                  placeholder="City for pickup"
                  value={recipientCity}
                  onChange={(e) => setRecipientCity(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transferPurpose">Transfer Purpose</Label>
              <Select value={transferPurpose} onValueChange={setTransferPurpose}>
                <SelectTrigger>
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  {purposes.map((purpose) => (
                    <SelectItem key={purpose} value={purpose}>
                      {purpose}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full banking-gradient text-white">
                Send via Western Union
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-orange-800 mb-2">Cash Pickup</h3>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• Available in minutes</li>
              <li>• 500,000+ agent locations</li>
              <li>• Recipient needs valid ID</li>
              <li>• Fee: $4.99 - $99.99</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-green-800 mb-2">Bank Account</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Direct to bank account</li>
              <li>• 1-3 business days</li>
              <li>• Lower fees</li>
              <li>• Fee: $2.99 - $19.99</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <TransferPinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSuccess={handlePinSuccess}
        transferData={transferData}
      />

      <TransferSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        transferData={transferData}
        transferType="Western Union Transfer"
      />
    </div>
  );
};

export default WesternUnion;
