import { Box } from 'common';
import { AppButton, AppSpacer, AppText } from 'components';
import { FC } from 'react';

interface IProps {
  onPress?: () => void;
  isLoading?: boolean;
  btnLabel?: string;
  firstSubLabel: string;
  secondSubLabel: string;
  onSecondTitlePress?: () => void;
  disableSecondLabel?: boolean;
}

const AuthFooter: FC<IProps> = ({
  onPress,
  isLoading,
  btnLabel,
  firstSubLabel,
  secondSubLabel,
  onSecondTitlePress,
  disableSecondLabel = false,
}) => {
  return (
    <Box
      position="absolute"
      bottom={0}
      width={'100%'}
      alignItems="center"
      justifyContent="center"
    >
      {btnLabel && (
        <AppButton label={btnLabel} onPress={onPress} isLoading={isLoading} />
      )}
      <AppSpacer variant="s" />
      {!disableSecondLabel && (
        <Box alignItems="center" justifyContent="center">
          <AppText variant="s2">
            {firstSubLabel}{' '}
            <AppText onPress={onSecondTitlePress} color="primary">
              {secondSubLabel}
            </AppText>
          </AppText>
        </Box>
      )}
    </Box>
  );
};

export default AuthFooter;
