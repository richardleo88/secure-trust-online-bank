
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Smartphone, ArrowRight, ArrowLeft } from "lucide-react";
import TransferPinModal from "./TransferPinModal";
import TransferSuccessModal from "./TransferSuccessModal";
import { useTransactions } from "@/hooks/useTransactions";

const LocalTransfer = () => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [showPinModal, setShowPinModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transferData, setTransferData] = useState<any>({});
  const { createTransaction } = useTransactions();

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
      amount, recipientName, emailOrMobile, bankName, accountNumber, 
      routingNumber, paymentNotes
    };
    setTransferData(data);
    setShowPinModal(true);
  };

  const handlePinSuccess = async () => {
    const result = await createTransaction({
      transaction_type: transferData.method === 'zelle' ? 'zelle_transfer' : 'local_transfer',
      recipient_name: transferData.recipientName,
      recipient_account: transferData.emailOrPhone,
      amount: parseFloat(transferData.amount),
      fee: 0.00,
      description: `${transferData.method === 'zelle' ? 'Zelle' : 'Local'} transfer to ${transferData.recipientName}`,
      metadata: { transferMethod: transferData.method }
    });

    if (!result.error) {
      setShowPinModal(false);
      setShowSuccessModal(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <Smartphone className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-banking-navy">Local Bank Transfer / Zelle / P2P</h2>
          <p className="text-banking-slate">Quick transfers for smaller payments</p>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <div className={`flex items-center ${step >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step >= 1 ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300'}`}>
            1
          </div>
          <span className="ml-2 hidden sm:block">Select Type</span>
        </div>
        <div className="w-8 h-px bg-gray-300"></div>
        <div className={`flex items-center ${step >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step >= 2 ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300'}`}>
            2
          </div>
          <span className="ml-2 hidden sm:block">Fill Form</span>
        </div>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Method Selection</CardTitle>
            <CardDescription>Choose Zelle/Local Transfer for quick P2P payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border-2 border-green-200 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-6 w-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-900">Zelle / Local Transfer</h3>
                    <p className="text-sm text-green-700">Person-to-person and local bank transfers</p>
                  </div>
                </div>
              </div>
              <Button onClick={handleNext} className="w-full bg-green-600 hover:bg-green-700 text-white">
                Continue with Local Transfer
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
              <Smartphone className="h-5 w-5" />
              Local Transfer Details
            </CardTitle>
            <CardDescription>
              Enter recipient information for Zelle or local bank transfer
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
                <Label htmlFor="recipientName">Recipient Name</Label>
                <Input
                  id="recipientName"
                  placeholder="Full name of recipient"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailOrMobile">Email or Mobile Linked to Zelle</Label>
                <Input
                  id="emailOrMobile"
                  placeholder="Email address or phone number"
                  value={emailOrMobile}
                  onChange={(e) => setEmailOrMobile(e.target.value)}
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
                <Label htmlFor="paymentNotes">Payment Notes</Label>
                <Input
                  id="paymentNotes"
                  placeholder="Optional payment notes or memo"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" onClick={handleBack} variant="outline" className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                  Send Local Transfer
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-green-800 mb-2">Transfer Information</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Zelle transfers: Instant (Free)</li>
            <li>• Local bank transfers: Same day ($3 fee)</li>
            <li>• Daily limit: $2,500 for Zelle, $10,000 for bank transfers</li>
            <li>• Perfect for smaller, everyday payments</li>
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
        transferType="Local Transfer / Zelle"
      />
    </div>
  );
};

export default LocalTransfer;
