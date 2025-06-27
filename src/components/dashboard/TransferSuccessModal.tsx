
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Download, Share } from "lucide-react";

interface TransferSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  transferData: any;
  transferType: string;
}

const TransferSuccessModal = ({ isOpen, onClose, transferData, transferType }: TransferSuccessModalProps) => {
  const transactionId = `TXN${Date.now().toString().slice(-8)}`;
  const currentDate = new Date().toLocaleString();

  const handleSaveSlip = () => {
    // In a real app, this would generate and download a PDF
    const slipContent = `
Transfer Receipt
Transaction ID: ${transactionId}
Date: ${currentDate}
Type: ${transferType}
Amount: $${transferData.amount}
Status: Successful
    `;
    
    const blob = new Blob([slipContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transfer-receipt-${transactionId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShareSlip = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Transfer Receipt',
        text: `Transfer of $${transferData.amount} completed successfully. Transaction ID: ${transactionId}`,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`Transfer Receipt - Transaction ID: ${transactionId} - Amount: $${transferData.amount}`);
      alert('Receipt details copied to clipboard!');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-6 w-6" />
            Transfer Successful
          </DialogTitle>
        </DialogHeader>
        
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Transfer Completed</h3>
                <p className="text-2xl font-bold text-green-600">${transferData.amount}</p>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Transaction ID:</span>
                  <span className="font-mono">{transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{currentDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transfer Type:</span>
                  <span>{transferType}</span>
                </div>
                {transferData.recipientName && (
                  <div className="flex justify-between">
                    <span>Recipient:</span>
                    <span>{transferData.recipientName}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-green-600 font-semibold">Successful</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={handleShareSlip} className="flex items-center gap-2">
            <Share className="h-4 w-4" />
            Share Slip
          </Button>
          <Button onClick={handleSaveSlip} className="flex items-center gap-2 banking-gradient text-white">
            <Download className="h-4 w-4" />
            Save Slip
          </Button>
        </div>

        <Button variant="ghost" onClick={onClose} className="w-full">
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default TransferSuccessModal;
