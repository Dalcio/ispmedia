import toast from 'react-hot-toast';

interface ToastOptions {
  duration?: number;
  position?: 'top-center' | 'top-right' | 'bottom-center' | 'bottom-right';
}

export const useToast = () => {
  const success = (message: string, options?: ToastOptions) => {
    toast.success(message, {
      duration: options?.duration || 4000,
      position: options?.position || 'top-center',
      style: {
        background: 'rgba(16, 185, 129, 0.9)',
        color: 'white',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '12px',
        padding: '12px 16px',
        fontSize: '14px',
        fontWeight: '500',
      },
      iconTheme: {
        primary: 'white',
        secondary: 'rgba(16, 185, 129, 0.9)',
      },
    });
  };

  const error = (message: string, options?: ToastOptions) => {
    toast.error(message, {
      duration: options?.duration || 5000,
      position: options?.position || 'top-center',
      style: {
        background: 'rgba(239, 68, 68, 0.9)',
        color: 'white',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '12px',
        padding: '12px 16px',
        fontSize: '14px',
        fontWeight: '500',
      },
      iconTheme: {
        primary: 'white',
        secondary: 'rgba(239, 68, 68, 0.9)',
      },
    });
  };

  const info = (message: string, options?: ToastOptions) => {
    toast(message, {
      duration: options?.duration || 4000,
      position: options?.position || 'top-center',
      style: {
        background: 'rgba(59, 130, 246, 0.9)',
        color: 'white',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '12px',
        padding: '12px 16px',
        fontSize: '14px',
        fontWeight: '500',
      },
      icon: 'ℹ️',
    });
  };

  const loading = (message: string) => {
    return toast.loading(message, {
      style: {
        background: 'rgba(107, 114, 128, 0.9)',
        color: 'white',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(107, 114, 128, 0.3)',
        borderRadius: '12px',
        padding: '12px 16px',
        fontSize: '14px',
        fontWeight: '500',
      },
    });
  };

  const dismiss = (toastId?: string) => {
    toast.dismiss(toastId);
  };

  return {
    success,
    error,
    info,
    loading,
    dismiss,
  };
};
