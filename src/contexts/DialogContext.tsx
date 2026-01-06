import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import CustomDialog, { DialogType, DialogButton } from '../components/ui/CustomDialog';

interface DialogOptions {
  title: string;
  message: string;
  type?: DialogType;
  buttons?: DialogButton[];
  dismissable?: boolean;
}

interface DialogContextType {
  showDialog: (options: DialogOptions) => void;
  showAlert: (title: string, message: string, onOk?: () => void) => void;
  showSuccess: (title: string, message: string, onOk?: () => void) => void;
  showError: (title: string, message: string, onOk?: () => void) => void;
  showConfirm: (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    confirmText?: string,
    cancelText?: string
  ) => void;
  showDestructiveConfirm: (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    confirmText?: string,
    cancelText?: string
  ) => void;
  hideDialog: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [dialogOptions, setDialogOptions] = useState<DialogOptions>({
    title: '',
    message: '',
  });

  const hideDialog = useCallback(() => {
    setVisible(false);
  }, []);

  const showDialog = useCallback((options: DialogOptions) => {
    setDialogOptions(options);
    setVisible(true);
  }, []);

  const showAlert = useCallback((title: string, message: string, onOk?: () => void) => {
    showDialog({
      title,
      message,
      type: 'info',
      buttons: [
        {
          text: 'OK',
          onPress: () => {
            hideDialog();
            onOk?.();
          },
        },
      ],
    });
  }, [showDialog, hideDialog]);

  const showSuccess = useCallback((title: string, message: string, onOk?: () => void) => {
    showDialog({
      title,
      message,
      type: 'success',
      buttons: [
        {
          text: 'OK',
          onPress: () => {
            hideDialog();
            onOk?.();
          },
        },
      ],
    });
  }, [showDialog, hideDialog]);

  const showError = useCallback((title: string, message: string, onOk?: () => void) => {
    showDialog({
      title,
      message,
      type: 'error',
      buttons: [
        {
          text: 'OK',
          onPress: () => {
            hideDialog();
            onOk?.();
          },
        },
      ],
    });
  }, [showDialog, hideDialog]);

  const showConfirm = useCallback((
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    confirmText: string = 'Confirmar',
    cancelText: string = 'Cancelar'
  ) => {
    showDialog({
      title,
      message,
      type: 'confirm',
      dismissable: false,
      buttons: [
        {
          text: cancelText,
          style: 'cancel',
          onPress: () => {
            hideDialog();
            onCancel?.();
          },
        },
        {
          text: confirmText,
          onPress: () => {
            hideDialog();
            onConfirm();
          },
        },
      ],
    });
  }, [showDialog, hideDialog]);

  const showDestructiveConfirm = useCallback((
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    confirmText: string = 'Eliminar',
    cancelText: string = 'Cancelar'
  ) => {
    showDialog({
      title,
      message,
      type: 'warning',
      dismissable: false,
      buttons: [
        {
          text: cancelText,
          style: 'cancel',
          onPress: () => {
            hideDialog();
            onCancel?.();
          },
        },
        {
          text: confirmText,
          style: 'destructive',
          onPress: () => {
            hideDialog();
            onConfirm();
          },
        },
      ],
    });
  }, [showDialog, hideDialog]);

  return (
    <DialogContext.Provider
      value={{
        showDialog,
        showAlert,
        showSuccess,
        showError,
        showConfirm,
        showDestructiveConfirm,
        hideDialog,
      }}
    >
      {children}
      <CustomDialog
        visible={visible}
        onDismiss={hideDialog}
        {...dialogOptions}
      />
    </DialogContext.Provider>
  );
};

export const useDialog = (): DialogContextType => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};
