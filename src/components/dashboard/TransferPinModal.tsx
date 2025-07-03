
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";

interface TransferPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  transferData: any;
}

const TransferPinModal = ({ isOpen, onClose, onSuccess, transferData }: TransferPinModalProps) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) {
      setError("PIN must be 4 digits");
      return;
    }
    if (pin === "1234") { // Demo PIN
      console.log('Transfer authorized with PIN:', pin);
      console.log('Transfer data:', transferData);
      onSuccess();
      setPin("");
      setError("");
    } else {
      setError("Invalid PIN. Try 1234 for demo");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Enter Transfer PIN
          </DialogTitle>
          <DialogDescription>
            Please enter your 4-digit transfer PIN to authorize this transaction.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pin">Transfer PIN</Label>
            <Input
              id="pin"
              type="password"
              maxLength={4}
              placeholder="Enter 4-digit PIN"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/\D/g, ''));
                setError("");
              }}
              className="text-center text-lg tracking-widest"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <p className="text-xs text-gray-500">Demo PIN: 1234</p>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 banking-gradient text-white">
              Authorize Transfer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransferPinModal;
