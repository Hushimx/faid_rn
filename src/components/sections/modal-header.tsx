import { Box } from 'common';
import { AppText } from 'components/atoms';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface IProps {
  title: string;
  onReset: () => void;
}

const ModalHeader: FC<IProps> = ({ title, onReset }) => {
  const { t } = useTranslation();
  return (
    <Box alignItems="center" flexDirection="row" justifyContent="space-between">
      <AppText variant="h6">{title}</AppText>
      <AppText textDecorationLine="underline" onPress={onReset} variant="s1">
        {t('reset')}
      </AppText>
    </Box>
  );
};

export default ModalHeader;
