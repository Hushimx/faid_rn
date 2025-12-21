import { Box } from 'common';
import { AppShadowContainer, AppText } from 'components/atoms';
import { Chevron } from 'components/icons';

const ProfileItem = () => {
  return (
    <AppShadowContainer>
      <Box
        flexDirection="row"
        alignItems="center"
        width={'95%'}
        alignSelf="center"
        padding="sm"
      >
        <Box flex={4} alignItems="flex-start">
          <AppText>dsljfh</AppText>
        </Box>
        <Box flex={1} alignItems="center" justifyContent="center">
          <Chevron />
        </Box>
      </Box>
    </AppShadowContainer>
  );
};

export default ProfileItem;
