import AppText from './app-text';

interface IErrorMessageProps {
  text: string;
  isError?: boolean;
}

const AppErrorMessage = ({ text, isError }: IErrorMessageProps) =>
  isError && text ? <AppText color={'red'}>{text}</AppText> : null;

export default AppErrorMessage;
