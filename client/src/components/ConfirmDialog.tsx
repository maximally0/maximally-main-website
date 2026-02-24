import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: 'default' | 'destructive';
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  variant = 'default'
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-gradient-to-br from-gray-900/95 to-gray-900/80 border border-gray-700 max-w-md backdrop-blur-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className={`font-space font-bold text-lg ${variant === 'destructive' ? 'text-red-400' : 'text-white'}`}>
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="font-space text-sm text-gray-300 leading-relaxed">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-3">
          <AlertDialogCancel className="bg-gray-800/50 border border-gray-700 text-gray-300 hover:bg-gray-700/50 hover:text-white font-space text-sm font-medium transition-all duration-300">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={`font-space text-sm font-medium transition-all duration-300 ${
              variant === 'destructive'
                ? 'bg-gradient-to-r from-red-600/40 to-rose-500/30 border border-red-500/50 text-red-200 hover:border-red-400 hover:text-white'
                : 'bg-gradient-to-r from-orange-600 to-orange-500 border-none text-white hover:from-orange-500 hover:to-orange-400'
            }`}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
