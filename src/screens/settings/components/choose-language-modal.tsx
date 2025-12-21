import SplashScreen from '@abeman/react-native-splash-screen';
import { Radio } from '@ui-kitten/components';
import { Box } from 'common';
import { AppSpacer, AppSpaceWrapper, AppText, BaseModal } from 'components';
import i18n from 'i18n';
import { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGES_ENUM } from 'types';
import { appChangeLangaugeHandler } from 'utils';
const LanguageItem = ({
  title,
  isActive,
  onChange,
}: {
  title: string;
  isActive: boolean;
  onChange: () => void;
}) => {
  return (
    <Box
      alignItems="center"
      flexDirection="row"
      padding="sm"
      borderRadius={10}
      borderWidth={1}
      borderColor="grayLight"
    >
      <Box flex={1} alignItems="center" justifyContent="center">
        <Radio checked={isActive} onChange={onChange} />
      </Box>
      <Box flex={8} alignItems="flex-start">
        <AppText variant="s1">{title}</AppText>
      </Box>
    </Box>
  );
};

const ChooseLanguageModal = (props: any, ref: any) => {
  const { t } = useTranslation();
  const [activeLanguage, setActiveLanguage] = useState(i18n.language);
  const onLanguageChangeHandler = (lang: LANGUAGES_ENUM) => {
    if (lang === activeLanguage) {
      closeModal();
      return;
    }
    setActiveLanguage(lang);
    changeLanguage(lang);
  };
  const changeLanguage = async (lang: LANGUAGES_ENUM) => {
    SplashScreen.show();
    closeModal();
    appChangeLangaugeHandler(lang);
  };
  const closeModal = () => {
    ref?.current?.closeModal();
  };
  return (
    <BaseModal ref={ref}>
      <AppSpaceWrapper>
        <AppText variant="h6">{t('chooseLangauge')}</AppText>
        <AppSpacer />
        <LanguageItem
          title="العربية"
          isActive={LANGUAGES_ENUM?.ar === activeLanguage}
          onChange={() => onLanguageChangeHandler(LANGUAGES_ENUM?.ar)}
        />
        <AppSpacer />
        <LanguageItem
          title="English"
          isActive={LANGUAGES_ENUM?.en === activeLanguage}
          onChange={() => onLanguageChangeHandler(LANGUAGES_ENUM?.en)}
        />
      </AppSpaceWrapper>
    </BaseModal>
  );
};

export default forwardRef(ChooseLanguageModal);
