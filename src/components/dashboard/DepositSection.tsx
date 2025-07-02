import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Upload, DollarSign, Receipt, CreditCard, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { mockDataService } from "@/services/mockDataService";

const DepositSection = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const { toast } = useToast();
  const { user, logActivity } = useAuth();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = event.target.files?.[0];
    if (file) {
      if (side === 'front') {
        setFrontImage(file);
      } else {
        setBackImage(file);
      }
      toast({
        title: "Image Uploaded",
        description: `${side === 'front' ? 'Front' : 'Back'} of check uploaded successfully`,
      });
    }
  };

  const handleMobileDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid deposit amount",
        variant: "destructive",
      });
      return;
    }

    if (!frontImage || !backImage) {
      toast({
        title: "Missing Images",
        description: "Please upload both front and back images of the check",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please log in to make a deposit",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Get current balance and create transaction using mock service
      const depositAmount = parseFloat(amount);
      
      const { data: transaction, error: transactionError } = await mockDataService.createTransaction({
        user_id: user.id,
        transaction_type: 'deposit',
        recipient_name: 'Check Deposit',
        amount: depositAmount,
        fee: 0,
        status: 'completed',
        description: 'Mobile check deposit',
        metadata: {
          deposit_type: 'mobile_check',
          has_front_image: true,
          has_back_image: true
        }
      });

      if (transactionError) throw new Error(transactionError);

      // Log the activity
      await logActivity('check_deposit', 'transaction', transaction.id, {
        amount: depositAmount
      });

      toast({
        title: "Deposit Successful",
        description: `$${depositAmount.toFixed(2)} has been deposited to your account`,
      });

      // Reset form
      setAmount("");
      setFrontImage(null);
      setBackImage(null);
      
      // Reset file inputs
      const frontInput = document.getElementById('front-upload') as HTMLInputElement;
      const backInput = document.getElementById('back-upload') as HTMLInputElement;
      if (frontInput) frontInput.value = '';
      if (backInput) backInput.value = '';

    } catch (error: any) {
      console.error('Deposit error:', error);
      toast({
        title: "Deposit Failed",
        description: error.message || "Failed to process deposit",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleATMDeposit = () => {
    toast({
      title: "ATM Locator",
      description: "Find nearby ATMs that accept deposits using our mobile app",
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2 sm:gap-3">
        <Receipt className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Deposit</h1>
          <p className="text-gray-600 text-sm sm:text-base">Make deposits easily and securely</p>
        </div>
      </div>

      <Tabs defaultValue="mobile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mobile" className="text-xs sm:text-sm">Mobile Deposit</TabsTrigger>
          <TabsTrigger value="atm" className="text-xs sm:text-sm">ATM Deposit</TabsTrigger>
          <TabsTrigger value="wire" className="text-xs sm:text-sm">Wire Deposit</TabsTrigger>
        </TabsList>

        <TabsContent value="mobile" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Camera className="h-5 w-5" />
                Mobile Check Deposit
              </CardTitle>
              <CardDescription className="text-sm">
                Deposit checks instantly by taking photos with your mobile device
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deposit-amount" className="text-sm font-medium">
                  Check Amount ($)
                </Label>
                <Input
                  id="deposit-amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-base"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {frontImage ? (
                    <div className="space-y-2">
                      <CheckCircle className="mx-auto h-8 w-8 text-green-500" />
                      <p className="text-sm text-green-600">Front uploaded</p>
                      <p className="text-xs text-gray-500">{frontImage.name}</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Front of Check</p>
                    </>
                  )}
                  <input
                    id="front-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'front')}
                    className="hidden"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => document.getElementById('front-upload')?.click()}
                  >
                    {frontImage ? 'Change Image' : 'Upload Image'}
                  </Button>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {backImage ? (
                    <div className="space-y-2">
                      <CheckCircle className="mx-auto h-8 w-8 text-green-500" />
                      <p className="text-sm text-green-600">Back uploaded</p>
                      <p className="text-xs text-gray-500">{backImage.name}</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Back of Check</p>
                    </>
                  )}
                  <input
                    id="back-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'back')}
                    className="hidden"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => document.getElementById('back-upload')?.click()}
                  >
                    {backImage ? 'Change Image' : 'Upload Image'}
                  </Button>
                </div>
              </div>

              <Button 
                onClick={handleMobileDeposit} 
                disabled={loading}
                className="w-full banking-gradient text-white"
              >
                {loading ? "Processing..." : "Submit Deposit"}
              </Button>

              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                <p className="font-semibold mb-1">Important Notes:</p>
                <ul className="space-y-1">
                  <li>• Deposits are processed immediately and added to your balance</li>
                  <li>• Daily mobile deposit limit: $5,000</li>
                  <li>• Both front and back images are required</li>
                  <li>• Keep the original check until funds are available</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="atm" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <CreditCard className="h-5 w-5" />
                ATM Deposit
              </CardTitle>
              <CardDescription className="text-sm">
                Find ATMs near you that accept cash and check deposits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <CreditCard className="mx-auto h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Find Nearby ATMs</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Locate ATMs that accept deposits in your area
                </p>
                <Button onClick={handleATMDeposit} className="banking-gradient text-white">
                  Find ATM Locations
                </Button>
              </div>

              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                <p className="font-semibold mb-1">ATM Deposit Features:</p>
                <ul className="space-y-1">
                  <li>• 24/7 availability at most locations</li>
                  <li>• Instant deposit confirmation</li>
                  <li>• Cash and check deposits accepted</li>
                  <li>• Receipt provided for all transactions</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wire" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <DollarSign className="h-5 w-5" />
                Wire Deposit
              </CardTitle>
              <CardDescription className="text-sm">
                Receive wire transfers from other financial institutions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Wire Transfer Information</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Bank Name:</span> UnionTrust Bank
                  </div>
                  <div>
                    <span className="font-medium">Routing Number:</span> 123456789
                  </div>
                  <div>
                    <span className="font-medium">Account Number:</span> Your account number
                  </div>
                  <div>
                    <span className="font-medium">SWIFT Code:</span> UNTRUS33
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                <p className="font-semibold mb-1">Wire Deposit Information:</p>
                <ul className="space-y-1">
                  <li>• Incoming wires typically process same day</li>
                  <li>• International wires may take 1-2 business days</li>
                  <li>• Contact us for large wire transfer notifications</li>
                  <li>• Fees may apply for incoming international wires</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DepositSection;
