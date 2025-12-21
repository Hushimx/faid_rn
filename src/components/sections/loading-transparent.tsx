import { Spinner } from '@ui-kitten/components';
import { Box } from 'common';

const LoadingTransparent = () => {
  return (
    <Box
      height={'100%'}
      alignItems="center"
      justifyContent="center"
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      backgroundColor="red"
      style={{ backgroundColor: 'rgba(0,0,0,.5)' }}
    >
      <Box
        backgroundColor="white"
        height={100}
        width={100}
        alignItems="center"
        justifyContent="center"
        borderRadius={10}
      >
        <Spinner status="primary" size="medium" />
      </Box>
    </Box>
  );
};

export default LoadingTransparent;
