import { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext(null);

   export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

const styles = {
  success: {
    bg: 'bg-emerald-950/80 border-emerald-500/30 text-emerald-200',
    icon: <CheckCircle className="text-emerald-400 h-5 w-5 shrink-0" />,
    progress: 'bg-emerald-500',
  },
  error: {
    bg: 'bg-rose-950/80 border-rose-500/30 text-rose-200',
    icon: <AlertCircle className="text-rose-400 h-5 w-5 shrink-0" />,
    progress: 'bg-rose-500',
  },
  warning: {
    bg: 'bg-amber-950/80 border-amber-500/30 text-amber-200',
    icon: <AlertTriangle className="text-amber-400 h-5 w-5 shrink-0" />,
    progress: 'bg-amber-500',
  },
  info: {
    bg: 'bg-blue-950/80 border-blue-500/30 text-blue-200',
    icon: <Info className="text-blue-400 h-5 w-5 shrink-0" />,
    progress: 'bg-blue-500',
  },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full">
        {toasts.map((t) => {
          const s = styles[t.type] || styles.info;
          return (
            <div key={t.id} className={`w-full flex flex-col rounded-xl border backdrop-blur-md shadow-lg overflow-hidden ${s.bg}`}>
              <div className="flex items-start gap-3 p-4">
                {s.icon}
                <div className="flex-1 text-sm font-medium pr-2">{t.message}</div>
                <button onClick={() => removeToast(t.id)} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                  <X size={16} />
                </button>
              </div>
              <div className="h-1 w-full bg-white/5">
                <div className={`h-full ${s.progress}`} style={{ animation: 'toast-progress 2s linear forwards', transformOrigin: 'left' }} />
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
