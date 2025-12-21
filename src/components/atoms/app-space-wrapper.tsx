import { Box } from 'common';

const AppSpaceWrapper = ({ children }: any) => {
  return (
    <Box flex={1} width={'95%'} alignSelf="center">
      {children}
    </Box>
  );
};
export default AppSpaceWrapper;
