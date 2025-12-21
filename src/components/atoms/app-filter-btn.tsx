import { Box } from 'common';
import { AppPresseble, AppText } from 'components/atoms';
import { ChevronSmall } from 'components/icons';
import { FC } from 'react';

interface IProps {
  label: string;
  onPress: () => void;
  isActive?: boolean;
  marginLeft?: boolean;
}

const AppFilterBtn: FC<IProps> = ({
  label,
  onPress,
  isActive = false,
  marginLeft = false,
}) => {
  return (
    <AppPresseble onPress={onPress}>
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        borderWidth={1}
        borderColor={isActive ? 'primary' : 'grayLight'}
        borderRadius={12}
        paddingHorizontal="sm"
        paddingVertical="s"
        marginLeft={marginLeft ? 's' : undefined}
        backgroundColor={isActive ? 'primary' : 'white'}
      >
        <AppText color={isActive ? 'white' : 'cutomBlack'}>{label}</AppText>
        <ChevronSmall color={isActive ? 'white' : undefined} />
      </Box>
    </AppPresseble>
  );
};

export default AppFilterBtn;
