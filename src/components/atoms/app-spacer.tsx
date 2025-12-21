import { Box, SPACING } from '@common';
import { FC } from 'react';

interface IProps {
  variant?: keyof typeof SPACING;
}

const AppSpacer: FC<IProps> = ({ variant = 's' }) => {
  return <Box marginVertical={variant} />;
};

export default AppSpacer;
