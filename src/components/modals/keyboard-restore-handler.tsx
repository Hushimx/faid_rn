import { useEffect } from 'react';
import { useKeyboardState } from 'react-native-keyboard-controller';
import { IModalRef } from 'types';

interface IProps {
  modalRef: React.RefObject<IModalRef>;
  children?: React.ReactNode;
}

/**
 * KeyboardRestoreHandler component
 *
 * Automatically restores the modal to its initial position when the keyboard is dismissed.
 * This is useful for modals with input fields to prevent the modal from staying in a raised position
 * after the keyboard closes.
 *
 * @param modalRef - Reference to the modal that needs to be restored
 * @param children - Optional children to render
 */
const KeyboardRestoreHandler = ({ modalRef, children }: IProps) => {
  const isKeyboardVisible = useKeyboardState(state => state.isVisible);

  useEffect(() => {
    // Only apply this behavior on iOS and Android
    // if (Platform.OS !== 'ios') return;

    if (!isKeyboardVisible && modalRef.current?.snapToIndexZero) {
      modalRef.current.snapToIndexZero();
    }
  }, [modalRef, isKeyboardVisible]);

  return <>{children}</>;
};

export default KeyboardRestoreHandler;
