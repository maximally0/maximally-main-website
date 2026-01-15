import { useState, useCallback, createContext, useContext, ReactNode } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'default';
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    console.error('useConfirm must be used within a ConfirmProvider');
    // Fallback to native confirm if provider is missing
    return (options: ConfirmOptions) => Promise.resolve(window.confirm(options.message));
  }
  return context.confirm;
}

interface ConfirmProviderProps {
  children: ReactNode;
}

export function ConfirmProvider({ children }: ConfirmProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolveRef, setResolveRef] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    console.log('Confirm called with:', opts);
    return new Promise((resolve) => {
      setOptions(opts);
      setResolveRef(() => resolve);
      setIsOpen(true);
    });
  }, []);

  const handleConfirm = () => {
    setIsOpen(false);
    resolveRef?.(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    resolveRef?.(false);
  };

  console.log('ConfirmProvider render, isOpen:', isOpen);

  const getVariantStyles = (variant: string = 'default') => {
    switch (variant) {
      case 'danger':
        return {
          border: 'border-red-500/50',
          header: 'from-red-900/30 to-rose-900/20',
          headerBorder: 'border-red-500/30',
          title: 'from-red-400 to-rose-400',
          icon: 'text-red-400',
          confirmBtn: 'from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 border-red-500/50',
        };
      case 'warning':
        return {
          border: 'border-amber-500/50',
          header: 'from-amber-900/30 to-orange-900/20',
          headerBorder: 'border-amber-500/30',
          title: 'from-amber-400 to-orange-400',
          icon: 'text-amber-400',
          confirmBtn: 'from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 border-amber-500/50',
        };
      default:
        return {
          border: 'border-purple-500/50',
          header: 'from-purple-900/30 to-pink-900/20',
          headerBorder: 'border-purple-500/30',
          title: 'from-purple-400 to-pink-400',
          icon: 'text-purple-400',
          confirmBtn: 'from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 border-pink-500/50',
        };
    }
  };

  const styles = options ? getVariantStyles(options.variant) : getVariantStyles();

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {isOpen && options && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className={`bg-gradient-to-br from-gray-900 to-gray-950 border ${styles.border} max-w-md w-full animate-in fade-in zoom-in-95 duration-200`}>
            <div className={`p-4 border-b ${styles.headerBorder} bg-gradient-to-r ${styles.header}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className={`h-5 w-5 ${styles.icon}`} />
                  <h2 className={`font-press-start text-sm bg-gradient-to-r ${styles.title} bg-clip-text text-transparent`}>
                    {options.title || 'CONFIRM'}
                  </h2>
                </div>
                <button 
                  onClick={handleCancel} 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-300 font-jetbrains text-sm leading-relaxed mb-6">
                {options.message}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-800/50 border border-gray-600/50 hover:border-gray-500 text-gray-300 hover:text-white px-4 py-3 font-press-start text-xs transition-all"
                >
                  {options.cancelText || 'CANCEL'}
                </button>
                <button
                  onClick={handleConfirm}
                  className={`flex-1 bg-gradient-to-r ${styles.confirmBtn} text-white px-4 py-3 font-press-start text-xs transition-all`}
                >
                  {options.confirmText || 'CONFIRM'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}
