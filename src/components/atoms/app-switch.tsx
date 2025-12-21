import { useAppTheme } from 'common';
import { FC } from 'react';
import { Switch } from 'react-native';

interface IProps {
  isEnabled: boolean;
  toggleSwitch: () => void;
}

const AppSwitch: FC<IProps> = ({ isEnabled, toggleSwitch }) => {
  const { colors } = useAppTheme();
  return (
    <Switch
      trackColor={{ false: '#767577', true: colors.primary }}
      thumbColor={'white'}
      ios_backgroundColor="#3e3e3e"
      onValueChange={toggleSwitch}
      value={isEnabled}
      style={{ transform: [{ scale: 0.7 }] }}
    />
  );
};

export default AppSwitch;
