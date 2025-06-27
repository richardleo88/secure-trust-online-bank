
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
  const currentDate = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const handleSaveSlip = () => {
    // Generate JP Morgan Chase style payment slip
    const slipContent = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    UNIONTRUST BANK
                   Payment Confirmation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Transaction Details:
────────────────────────────────────────────────────
Transaction ID:     ${transactionId}
Date & Time:        ${currentDate}
Transfer Type:      ${transferType}
Amount:             $${transferData.amount} USD
Status:             COMPLETED ✓

Recipient Information:
────────────────────────────────────────────────────
${transferData.recipientName ? `Name:               ${transferData.recipientName}` : ''}
${transferData.accountNumber ? `Account Number:     ${transferData.accountNumber}` : ''}
${transferData.bankName ? `Bank:               ${transferData.bankName}` : ''}
${transferData.country ? `Country:            ${transferData.country}` : ''}
${transferData.swiftCode ? `SWIFT Code:         ${transferData.swiftCode}` : ''}
${transferData.routingNumber ? `Routing Number:     ${transferData.routingNumber}` : ''}

Security Information:
────────────────────────────────────────────────────
Authorized by PIN:  ****
Processing Time:    1-3 Business Days
Reference Number:   ${transactionId}

Important Notes:
────────────────────────────────────────────────────
• Keep this receipt for your records
• Funds will be processed within stated timeframe
• Contact customer service for any inquiries
• This transaction is irreversible once processed

Customer Service: 1-800-UNION-TRUST
Online Banking: www.uniontrustbank.com

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            Thank you for banking with UnionTrust
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;
    
    const blob = new Blob([slipContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UnionTrust-Transfer-${transactionId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShareSlip = () => {
    const shareText = `UnionTrust Transfer Receipt\nTransaction ID: ${transactionId}\nAmount: $${transferData.amount}\nType: ${transferType}\nStatus: Completed ✓`;
    
    if (navigator.share) {
      navigator.share({
        title: 'UnionTrust Transfer Receipt',
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Receipt details copied to clipboard!');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-6 w-6" />
            Transfer Successful
          </DialogTitle>
        </DialogHeader>
        
        {/* Premium JP Morgan Chase style receipt */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              {/* Header with logo area */}
              <div className="border-b border-blue-200 pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">U</span>
                </div>
                <h3 className="font-bold text-lg text-blue-900">UNIONTRUST BANK</h3>
                <p className="text-sm text-blue-700">Payment Confirmation</p>
              </div>
              
              {/* Amount display */}
              <div className="py-4">
                <p className="text-sm text-gray-600 mb-1">Transfer Amount</p>
                <p className="text-3xl font-bold text-green-600">${transferData.amount}</p>
                <p className="text-sm text-gray-500">USD</p>
              </div>
              
              {/* Transaction details in premium format */}
              <div className="bg-white/70 rounded-lg p-4 space-y-3 text-left">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Transaction ID:</span>
                    <p className="font-mono font-semibold text-blue-900">{transactionId}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Date & Time:</span>
                    <p className="font-semibold text-blue-900">{currentDate}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Transfer Type:</span>
                    <p className="font-semibold text-blue-900">{transferType}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <p className="font-semibold text-green-600 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      COMPLETED
                    </p>
                  </div>
                </div>
                
                {transferData.recipientName && (
                  <div>
                    <span className="text-gray-500 text-xs">Recipient:</span>
                    <p className="font-semibold text-blue-900">{transferData.recipientName}</p>
                  </div>
                )}
                
                {transferData.bankName && (
                  <div>
                    <span className="text-gray-500 text-xs">Bank:</span>
                    <p className="font-semibold text-blue-900">{transferData.bankName}</p>
                  </div>
                )}
              </div>

              {/* Security footer */}
              <div className="text-xs text-blue-700 pt-2 border-t border-blue-200">
                <p>🔒 Secured by 256-bit encryption</p>
                <p>Customer Service: 1-800-UNION-TRUST</p>
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
