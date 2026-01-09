import Snackbar from 'react-native-snackbar';
import { showSuccessBottomSheetGlobal } from 'contexts/success-bottom-sheet-context';
import i18n from 'i18n';

interface IShowSnackBar {
  text: string;
  type?: 'error' | 'default';
}

export const ShowSnackBar = ({ text, type = 'default' }: IShowSnackBar) => {
  // Use bottom sheet for success messages, snackbar for errors
  if (type === 'error') {
    Snackbar.show({
      text: text,
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: 'red',
    });
  } else {
    // Show success bottom sheet for default/success messages
    const title = i18n.t('success') || 'Success!';
    const subtitle = i18n.t('actionCompletedSuccessfully') || 'Your action has been completed successfully';
    showSuccessBottomSheetGlobal(text, title, subtitle);
  }
};
