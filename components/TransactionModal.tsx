import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: 'pending' | 'success' | 'error' | null;
  error?: string;
}

export function TransactionModal({ isOpen, onClose, status, error }: TransactionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {status === 'pending' && 'Processing Transaction'}
            {status === 'success' && 'Transaction Successful'}
            {status === 'error' && 'Transaction Failed'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-4">
          {status === 'pending' && (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-2 text-sm">Please confirm the transaction in your wallet...</p>
            </>
          )}
          
          {status === 'success' && (
            <p className="text-sm text-green-500">Match has been added to feed successfully!</p>
          )}
          
          {status === 'error' && (
            <p className="text-sm text-red-500">{error || 'Transaction failed. Please try again.'}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 