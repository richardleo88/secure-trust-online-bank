
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, ArrowRight, ArrowLeft, RefreshCw } from "lucide-react";
import TransferPinModal from "./TransferPinModal";
import TransferSuccessModal from "./TransferSuccessModal";

const ACHTransfer = () => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAddress, setBankAddress] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [accountType, setAccountType] = useState("");
  const [paymentDescription, setPaymentDescription] = useState("");
  const [showPinModal, setShowPinModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transferData, setTransferData] = useState<any>({});

  const usaBanks = [
    "JPMorgan Chase Bank", "Bank of America", "Wells Fargo Bank", "Citibank",
    "U.S. Bank", "Truist Bank", "PNC Bank", "Goldman Sachs Bank USA",
    "TD Bank", "Capital One", "Bank of New York Mellon", "State Street Corporation",
    "American Express National Bank", "USAA Bank", "Charles Schwab Bank",
    "Navy Federal Credit Union", "Ally Bank", "Discover Bank", "Marcus by Goldman Sachs",
    "SunTrust Bank", "KeyBank", "Regions Bank", "Fifth Third Bank",
    "Santander Bank", "First Citizens Bank", "M&T Bank", "Huntington National Bank",
    "Comerica Bank", "Zions Bancorporation", "Popular Bank", "First Republic Bank",
    "Silicon Valley Bank", "Signature Bank", "East West Bank", "City National Bank",
    "First National Bank of Omaha", "Arvest Bank", "Synovus Bank", "Renasant Bank"
  ];

  const accountTypes = ["Checking", "Savings"];

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      amount, bankName, bankAddress, accountName, accountNumber, 
      routingNumber, accountType, paymentDescription
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
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <RefreshCw className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-banking-navy">ACH Transfer</h2>
          <p className="text-banking-slate">Automated Clearing House transfers within the US</p>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <div className={`flex items-center ${step >= 1 ? 'text-purple-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step >= 1 ? 'border-purple-600 bg-purple-600 text-white' : 'border-gray-300'}`}>
            1
          </div>
          <span className="ml-2 hidden sm:block">Select Type</span>
        </div>
        <div className="w-8 h-px bg-gray-300"></div>
        <div className={`flex items-center ${step >= 2 ? 'text-purple-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step >= 2 ? 'border-purple-600 bg-purple-600 text-white' : 'border-gray-300'}`}>
            2
          </div>
          <span className="ml-2 hidden sm:block">Fill Form</span>
        </div>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Method Selection</CardTitle>
            <CardDescription>Choose ACH Transfer for domestic US payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border-2 border-purple-200 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-6 w-6 text-purple-600" />
                  <div>
                    <h3 className="font-semibold text-purple-900">ACH Transfer</h3>
                    <p className="text-sm text-purple-700">Automated Clearing House transfers</p>
                  </div>
                </div>
              </div>
              <Button onClick={handleNext} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Continue with ACH Transfer
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              ACH Transfer Details
            </CardTitle>
            <CardDescription>
              Enter recipient information for ACH transfer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <Label htmlFor="bankName">Bank Name</Label>
                <Select value={bankName} onValueChange={setBankName}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select recipient's bank" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {usaBanks.map((bank) => (
                      <SelectItem key={bank} value={bank}>
                        {bank}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankAddress">Bank Address</Label>
                <Input
                  id="bankAddress"
                  placeholder="Bank's complete address"
                  value={bankAddress}
                  onChange={(e) => setBankAddress(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountName">Account Name</Label>
                <Input
                  id="accountName"
                  placeholder="Account holder's full name"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    placeholder="Recipient's account number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="routingNumber">Routing Number</Label>
                  <Input
                    id="routingNumber"
                    placeholder="9-digit routing number"
                    value={routingNumber}
                    onChange={(e) => setRoutingNumber(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountType">Account Type</Label>
                <Select value={accountType} onValueChange={setAccountType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    {accountTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentDescription">Payment Description</Label>
                <Input
                  id="paymentDescription"
                  placeholder="Purpose of this payment"
                  value={paymentDescription}
                  onChange={(e) => setPaymentDescription(e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" onClick={handleBack} variant="outline" className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
                  Send ACH Transfer
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-800 mb-2">ACH Transfer Information</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Standard ACH: Free (1-3 business days)</li>
            <li>• Same-day ACH: $5 fee (before 2:45 PM EST)</li>
            <li>• Daily limit: $25,000</li>
            <li>• Available to all US banks and credit unions</li>
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
        transferType="ACH Transfer"
      />
    </div>
  );
};

export default ACHTransfer;
