
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Building } from "lucide-react";

const LocalTransfer = () => {
  const [amount, setAmount] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientAccount, setRecipientAccount] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [selectedBank, setSelectedBank] = useState("");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Local transfer submitted:", {
      amount, recipientName, recipientAccount, routingNumber, selectedBank
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <MapPin className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-banking-navy">Local Transfer (USA)</h2>
          <p className="text-banking-slate">Transfer money to any US bank account</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Domestic Transfer Details
          </CardTitle>
          <CardDescription>
            Send money to any bank account within the United States
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
                placeholder="Full name as on bank account"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="selectedBank">Recipient Bank</Label>
              <Select value={selectedBank} onValueChange={setSelectedBank}>
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
                <Label htmlFor="recipientAccount">Account Number</Label>
                <Input
                  id="recipientAccount"
                  placeholder="Recipient's account number"
                  value={recipientAccount}
                  onChange={(e) => setRecipientAccount(e.target.value)}
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

            <div className="pt-4">
              <Button type="submit" className="w-full banking-gradient text-white">
                Send Local Transfer
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-800 mb-2">Transfer Information</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Same-day transfers: $10 fee (before 2 PM EST)</li>
            <li>• Next-day transfers: $3 fee</li>
            <li>• Standard transfers: Free (2-3 business days)</li>
            <li>• Daily limit: $10,000</li>
            <li>• Available to all US banks and credit unions</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocalTransfer;
