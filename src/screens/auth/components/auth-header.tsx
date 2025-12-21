import { Box } from 'common';
import { AppText } from 'components';
import { FC } from 'react';

interface IProps {
  label: string;
  subLabel: string;
}

const AuthHeader: FC<IProps> = ({ label, subLabel }) => {
  return (
    <Box alignSelf="flex-start" width={'100%'}>
      <Box
        alignItems="center"
        justifyContent="center"
        marginTop="xxl"
        marginBottom="xxl"
      >
        <Box width={'100%'} alignSelf="center">
          <AppText children={label} variant="h1" />
        </Box>
        <Box width={'100%'} alignSelf="center">
          <AppText children={subLabel} variant="s1" color={'grayDark'} />
        </Box>
      </Box>
    </Box>
  );
};

export default AuthHeader;
