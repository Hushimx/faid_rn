import { AppString } from 'i18n/AppString';
import { useTranslation } from 'react-i18next';

type AppStringKey = keyof typeof AppString; // Keys of APP_STRING

export interface IAppString {
  welcome: string;
}

export const useLocalization = (value: string, obj: any) => {
  const { t } = useTranslation();
  return t(value);
};
