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
      <AlertDialogContent className="bg-gradient-to-br from-gray-900/95 to-gray-900/80 border-2 border-purple-500/50 max-w-md backdrop-blur-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className={`font-press-start text-lg ${variant === 'destructive' ? 'text-red-400' : 'text-purple-300'}`}>
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="font-jetbrains text-sm text-gray-300 leading-relaxed">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-3">
          <AlertDialogCancel className="bg-gray-800/50 border border-gray-700 text-gray-300 hover:bg-gray-700/50 hover:text-white font-press-start text-xs transition-all duration-300">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={`font-press-start text-xs transition-all duration-300 ${
              variant === 'destructive'
                ? 'bg-gradient-to-r from-red-600/40 to-rose-500/30 border border-red-500/50 text-red-200 hover:border-red-400 hover:text-white'
                : 'bg-gradient-to-r from-purple-600/40 to-pink-500/30 border border-purple-500/50 text-purple-200 hover:border-purple-400 hover:text-white'
            }`}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
