
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, DollarSign, ArrowRight, ArrowLeft } from "lucide-react";
import TransferPinModal from "./TransferPinModal";
import TransferSuccessModal from "./TransferSuccessModal";
import { useTransactions } from "@/hooks/useTransactions";

const WireTransfer = () => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [country, setCountry] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAddress, setBankAddress] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [showPinModal, setShowPinModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transferData, setTransferData] = useState<any>({});
  const { createTransaction } = useTransactions();

  const countries = [
    "United Kingdom", "Canada", "Germany", "France", "Japan", "Australia", 
    "Switzerland", "Netherlands", "Sweden", "Norway", "Denmark", "Singapore",
    "South Korea", "Hong Kong", "New Zealand", "Belgium", "Austria", "Italy",
    "Spain", "Portugal", "Ireland", "Finland", "Luxembourg", "Iceland",
    "Czech Republic", "Poland", "Hungary", "Slovenia", "Slovakia", "Estonia",
    "Latvia", "Lithuania", "Malta", "Cyprus", "Greece", "Bulgaria", "Romania",
    "Croatia", "Serbia", "Montenegro", "Bosnia and Herzegovina", "Albania",
    "North Macedonia", "Moldova", "Ukraine", "Belarus", "Russia", "Turkey",
    "Israel", "UAE", "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman",
    "Jordan", "Lebanon", "Egypt", "Morocco", "Tunisia", "Algeria", "Libya",
    "South Africa", "Nigeria", "Kenya", "Ghana", "Ethiopia", "Tanzania",
    "Uganda", "Rwanda", "Botswana", "Namibia", "Zambia", "Zimbabwe",
    "Mauritius", "Seychelles", "Madagascar", "India", "China", "Thailand",
    "Malaysia", "Indonesia", "Philippines", "Vietnam", "Cambodia", "Laos",
    "Myanmar", "Bangladesh", "Sri Lanka", "Nepal", "Bhutan", "Maldives",
    "Pakistan", "Afghanistan", "Iran", "Iraq", "Syria", "Yemen", "Armenia",
    "Azerbaijan", "Georgia", "Kazakhstan", "Kyrgyzstan", "Tajikistan",
    "Turkmenistan", "Uzbekistan", "Mongolia", "North Korea", "Taiwan",
    "Macau", "Brunei", "East Timor", "Papua New Guinea", "Fiji", "Vanuatu",
    "Solomon Islands", "New Caledonia", "French Polynesia", "Samoa", "Tonga",
    "Cook Islands", "Palau", "Marshall Islands", "Micronesia", "Kiribati",
    "Nauru", "Tuvalu", "Brazil", "Argentina", "Chile", "Peru", "Colombia",
    "Venezuela", "Ecuador", "Bolivia", "Paraguay", "Uruguay", "Guyana",
    "Suriname", "French Guiana", "Mexico", "Guatemala", "Belize", "Honduras",
    "El Salvador", "Nicaragua", "Costa Rica", "Panama", "Cuba", "Jamaica",
    "Haiti", "Dominican Republic", "Puerto Rico", "Trinidad and Tobago",
    "Barbados", "Bahamas", "Antigua and Barbuda", "Saint Lucia", "Grenada",
    "Saint Vincent and the Grenadines", "Dominica", "Saint Kitts and Nevis"
  ];

  const banksByCountry: { [key: string]: string[] } = {
    "United Kingdom": ["HSBC UK", "Barclays", "Lloyds Banking Group", "NatWest", "Santander UK", "TSB Bank", "Metro Bank"],
    "Canada": ["Royal Bank of Canada", "Toronto-Dominion Bank", "Bank of Nova Scotia", "Bank of Montreal", "Canadian Imperial Bank"],
    "Germany": ["Deutsche Bank", "Commerzbank", "DZ Bank", "KfW", "Landesbank Baden-Württemberg", "Bayerische Landesbank"],
    "France": ["BNP Paribas", "Crédit Agricole", "Société Générale", "Banque Populaire", "Crédit Mutuel", "La Banque Postale"],
    "Japan": ["Mitsubishi UFJ", "Sumitomo Mitsui Banking", "Mizuho Bank", "Japan Post Bank", "Resona Bank", "Shinsei Bank"],
    "Australia": ["Commonwealth Bank", "ANZ", "Westpac", "National Australia Bank", "Bendigo Bank", "Bank of Queensland"],
    "Switzerland": ["UBS", "Credit Suisse", "Julius Baer", "Pictet", "Vontobel", "EFG International"],
    "Netherlands": ["ING Bank", "ABN AMRO", "Rabobank", "SNS Bank", "ASN Bank", "Triodos Bank"],
    "Default": ["Standard Chartered", "Citibank", "HSBC", "Deutsche Bank", "BNP Paribas", "Credit Suisse"]
  };

  const requiresRoutingNumber = ["United States", "Canada"];

  const getBanksForCountry = (country: string) => {
    return banksByCountry[country] || banksByCountry["Default"];
  };

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
      amount, country, bankName, bankAddress, accountName, accountNumber, 
      routingNumber, swiftCode, paymentReference
    };
    setTransferData(data);
    setShowPinModal(true);
  };

  const handlePinSuccess = async () => {
    const result = await createTransaction({
      transaction_type: 'wire_transfer',
      recipient_name: transferData.accountName || 'International Recipient',
      recipient_account: transferData.accountNumber,
      amount: parseFloat(transferData.amount),
      fee: 25.00,
      description: `Wire transfer to ${transferData.bankName}, ${transferData.country}`,
      metadata: { 
        bankName: transferData.bankName, 
        country: transferData.country,
        swiftCode: transferData.swiftCode,
        routingNumber: transferData.routingNumber 
      }
    });

    if (!result.error) {
      setShowPinModal(false);
      setShowSuccessModal(true);
    }
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

      {/* Progress indicator */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step >= 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
            1
          </div>
          <span className="ml-2 hidden sm:block">Select Type</span>
        </div>
        <div className="w-8 h-px bg-gray-300"></div>
        <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step >= 2 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
            2
          </div>
          <span className="ml-2 hidden sm:block">Fill Form</span>
        </div>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Method Selection</CardTitle>
            <CardDescription>Choose Wire Transfer for international payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border-2 border-blue-200 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Globe className="h-6 w-6 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-blue-900">Wire Transfer</h3>
                    <p className="text-sm text-blue-700">International bank-to-bank transfers</p>
                  </div>
                </div>
              </div>
              <Button onClick={handleNext} className="w-full banking-gradient text-white">
                Continue with Wire Transfer
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
              <DollarSign className="h-5 w-5" />
              Wire Transfer Details
            </CardTitle>
            <CardDescription>
              Enter recipient information for international wire transfer
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
                    <SelectContent className="max-h-60">
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {country && (
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Select value={bankName} onValueChange={setBankName}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {getBanksForCountry(country).map((bank) => (
                        <SelectItem key={bank} value={bank}>
                          {bank}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="bankAddress">Bank Address</Label>
                <Input
                  id="bankAddress"
                  placeholder="Complete bank address"
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

              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number/IBAN</Label>
                <Input
                  id="accountNumber"
                  placeholder="Account number or IBAN"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requiresRoutingNumber.includes(country) && (
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
                )}
                <div className="space-y-2">
                  <Label htmlFor="swiftCode">SWIFT Code/BIC</Label>
                  <Input
                    id="swiftCode"
                    placeholder="SWIFT/BIC code"
                    value={swiftCode}
                    onChange={(e) => setSwiftCode(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentReference">Payment Reference</Label>
                <Input
                  id="paymentReference"
                  placeholder="Reference or purpose of payment"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" onClick={handleBack} variant="outline" className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button type="submit" className="flex-1 banking-gradient text-white">
                  Send Wire Transfer
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

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
        transferType="Wire Transfer"
      />
    </div>
  );
};

export default WireTransfer;
