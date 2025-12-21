import Snackbar from 'react-native-snackbar';

interface IShowSnackBar {
  text: string;
  type?: 'error' | 'default';
}

export const ShowSnackBar = ({ text, type = 'default' }: IShowSnackBar) => {
  Snackbar.show({
    text: text,
    duration: Snackbar.LENGTH_SHORT,
    backgroundColor: type === 'error' ? 'red' : undefined,
  });
};
