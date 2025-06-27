import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, DollarSign } from "lucide-react";
import TransferPinModal from "./TransferPinModal";
import TransferSuccessModal from "./TransferSuccessModal";

const WireTransfer = () => {
  const [amount, setAmount] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientAccount, setRecipientAccount] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [country, setCountry] = useState("");
  const [showPinModal, setShowPinModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transferData, setTransferData] = useState<any>({});

  const countries = [
    "United Kingdom", "Canada", "Germany", "France", "Japan", "Australia", 
    "Switzerland", "Netherlands", "Sweden", "Norway", "Denmark", "Singapore"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      amount, recipientName, recipientAccount, swiftCode, bankName, country
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
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <Globe className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-banking-navy">International Wire Transfer</h2>
          <p className="text-banking-slate">Send money worldwide securely</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Transfer Details
          </CardTitle>
          <CardDescription>
            Enter the recipient's information for international wire transfer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Transfer Amount (USD)</Label>
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
                <Label htmlFor="country">Destination Country</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipientName">Recipient Name</Label>
              <Input
                id="recipientName"
                placeholder="Full name as on bank account"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipientAccount">Recipient Account Number/IBAN</Label>
              <Input
                id="recipientAccount"
                placeholder="Account number or IBAN"
                value={recipientAccount}
                onChange={(e) => setRecipientAccount(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bankName">Recipient Bank Name</Label>
                <Input
                  id="bankName"
                  placeholder="Bank name"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="swiftCode">SWIFT/BIC Code</Label>
                <Input
                  id="swiftCode"
                  placeholder="SWIFT code"
                  value={swiftCode}
                  onChange={(e) => setSwiftCode(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full banking-gradient text-white">
                Send Wire Transfer
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-yellow-800 mb-2">Important Notice</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Wire transfer fee: $25 for international transfers</li>
            <li>• Processing time: 1-5 business days</li>
            <li>• Transfers are irreversible once processed</li>
            <li>• Verify all recipient details before submitting</li>
          </ul>
        </CardContent>
      </Card>

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
        transferType="International Wire Transfer"
      />
    </div>
  );
};

export default WireTransfer;
