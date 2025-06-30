
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Share2, Copy, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  type: string;
  recipient: string;
  amount: string;
  status: string;
  date: string;
  time: string;
  reference: string;
  method: string;
  account: string;
  fee?: string;
  description?: string;
}

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

const TransactionDetailModal = ({ transaction, isOpen, onClose }: TransactionDetailModalProps) => {
  const { toast } = useToast();

  if (!transaction) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed": return <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />;
      case "Pending": return <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />;
      case "Failed": return <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />;
      default: return <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "text-green-600 bg-green-50";
      case "Pending": return "text-yellow-600 bg-yellow-50";
      case "Failed": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const handleDownloadReceipt = () => {
    toast({
      title: "Receipt Downloaded",
      description: "Transaction receipt has been downloaded successfully.",
    });
  };

  const handleShareReceipt = () => {
    if (navigator.share) {
      navigator.share({
        title: `Transaction Receipt - ${transaction.reference}`,
        text: `Transaction details for ${transaction.amount} to ${transaction.recipient}`,
      }).then(() => {
        toast({
          title: "Receipt Shared",
          description: "Transaction receipt has been shared successfully.",
        });
      }).catch(() => {
        toast({
          title: "Share Failed",
          description: "Unable to share receipt. Please try again.",
          variant: "destructive",
        });
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`Transaction Receipt - ${transaction.reference}\nAmount: ${transaction.amount}\nRecipient: ${transaction.recipient}\nDate: ${transaction.date} at ${transaction.time}\nReference: ${transaction.reference}`);
      toast({
        title: "Receipt Copied",
        description: "Transaction details have been copied to clipboard.",
      });
    }
  };

  const handleCopyReference = () => {
    navigator.clipboard.writeText(transaction.reference);
    toast({
      title: "Reference Copied",
      description: "Transaction reference has been copied to clipboard.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <span>Transaction Details</span>
            {getStatusIcon(transaction.status)}
          </DialogTitle>
        </DialogHeader>

        {/* Transaction Receipt */}
        <Card className="border-2 border-blue-100">
          <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            {/* Header */}
            <div className="text-center border-b pb-3 sm:pb-4">
              <div className="text-xl sm:text-2xl font-bold text-blue-900">UnionTrust Bank</div>
              <div className="text-xs sm:text-sm text-gray-600">Transaction Receipt</div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-center">
              <div className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-2 ${getStatusColor(transaction.status)}`}>
                {getStatusIcon(transaction.status)}
                <span className="font-medium text-sm sm:text-base">{transaction.status}</span>
              </div>
            </div>

            {/* Amount */}
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">{transaction.amount}</div>
              <div className="text-xs sm:text-sm text-gray-600">Amount Transferred</div>
            </div>

            {/* Transaction Details */}
            <div className="space-y-2 sm:space-y-3 border-t pt-3 sm:pt-4">
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-600">Transaction Type:</span>
                <span className="font-medium">{transaction.type}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-600">Recipient:</span>
                <span className="font-medium break-all text-right">{transaction.recipient}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-600">Method:</span>
                <span className="font-medium">{transaction.method}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-600">Account:</span>
                <span className="font-medium">{transaction.account}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-600">Date & Time:</span>
                <span className="font-medium text-right">{transaction.date} at {transaction.time}</span>
              </div>
              <div className="flex justify-between items-center text-sm sm:text-base">
                <span className="text-gray-600">Reference:</span>
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="font-medium text-xs sm:text-sm break-all">{transaction.reference}</span>
                  <Button variant="ghost" size="sm" onClick={handleCopyReference} className="p-1">
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              {transaction.fee && (
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Transaction Fee:</span>
                  <span className="font-medium">{transaction.fee}</span>
                </div>
              )}
              {transaction.description && (
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Description:</span>
                  <span className="font-medium text-right break-words">{transaction.description}</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-500 border-t pt-3 sm:pt-4">
              <div>Generated on {new Date().toLocaleString()}</div>
              <div className="mt-1 break-all">For support, contact: support@uniontrust.com</div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={handleDownloadReceipt} className="flex-1 text-sm">
            <Download className="h-4 w-4 mr-2" />
            Download Receipt
          </Button>
          <Button onClick={handleShareReceipt} variant="outline" className="flex-1 text-sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share Receipt
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetailModal;
