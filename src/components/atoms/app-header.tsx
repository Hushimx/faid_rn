import { useNavigation } from '@react-navigation/native';
import { Box } from 'common';
import { FC } from 'react';
import AppText from './app-text';
import { Chevron } from 'components/icons';
import { Pressable } from 'react-native';
import AppSearchInput from './app-search-input';
import UserAvatar from './user-avatar';
interface IPropsBase {
  label?: string;
  isChatHeader?: boolean;
}

interface IPropsWithSearch extends IPropsBase {
  isIncludesSearch: true;
  value: string;
  onChangeText: (text: string) => void;
}

interface IPropsWithoutSearch extends IPropsBase {
  isIncludesSearch?: false;
  value?: never;
  onChangeText?: never;
}

type IProps = IPropsWithSearch | IPropsWithoutSearch;

const AppHeader: FC<IProps> = ({
  label,
  isIncludesSearch,
  isChatHeader,
  value,
  onChangeText,
}) => {
  const navigation = useNavigation();

  return (
    <Box
      flexDirection="row"
      alignItems="center"
      paddingHorizontal="sm"
      paddingTop="sm"
    >
      <Box flex={1} alignItems="center" justifyContent="center">
        <Pressable onPress={() => navigation.goBack()}>
          <Box style={{ transform: [{ rotate: '180deg' }] }}>
            <Chevron size={20} />
          </Box>
        </Pressable>
      </Box>

      <Box
        flex={20}
        alignItems="flex-start"
        justifyContent="center"
        marginLeft="s"
      >
        {!isIncludesSearch ? (
          <Box flexDirection="row" alignItems="center">
            {isChatHeader && (
              <Box marginHorizontal="s">
                <UserAvatar />
              </Box>
            )}
            <AppText variant="m">{label}</AppText>
          </Box>
        ) : (
          <AppSearchInput value={value} onChangeText={onChangeText} />
        )}
      </Box>
    </Box>
  );
};

export default AppHeader;
