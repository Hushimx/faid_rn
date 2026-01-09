import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import SuccessBottomSheet, {
  SuccessBottomSheetRef,
} from 'components/modals/success-bottom-sheet';
import { createContext, ReactNode, useEffect, useRef } from 'react';

interface SuccessBottomSheetContextType {
  showSuccessBottomSheet: (_message: string) => void;
}

export const SuccessBottomSheetContext = createContext<SuccessBottomSheetContextType | null>(
  null,
);

// Global ref to access the bottom sheet from anywhere
let globalSuccessBottomSheetRef: React.RefObject<SuccessBottomSheetRef> | null = null;

export const showSuccessBottomSheetGlobal = (
  message: string,
  title?: string,
  subtitle?: string
) => {
  globalSuccessBottomSheetRef?.current?.present(message, title, subtitle);
};

interface SuccessBottomSheetProviderProps {
  children: ReactNode;
}

export const SuccessBottomSheetProvider = ({
  children,
}: SuccessBottomSheetProviderProps) => {
  const successBottomSheetRef = useRef<SuccessBottomSheetRef>(null);

  // Set global ref when component mounts
  useEffect(() => {
    globalSuccessBottomSheetRef = successBottomSheetRef;
    return () => {
      globalSuccessBottomSheetRef = null;
    };
  }, []);

  const showSuccessBottomSheet = (message: string) => {
    successBottomSheetRef.current?.present(message);
  };

  return (
    <BottomSheetModalProvider>
      <SuccessBottomSheetContext.Provider value={{ showSuccessBottomSheet }}>
        {children}
        <SuccessBottomSheet ref={successBottomSheetRef} />
      </SuccessBottomSheetContext.Provider>
    </BottomSheetModalProvider>
  );
};

