import { Input } from '@ui-kitten/components';
import { I18nManager, StyleSheet } from 'react-native';
import { FONT_FAMILY, useAppTheme } from 'common';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { useTranslation } from 'react-i18next';
const AppSearchInput = (props: any) => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  return (
    <Input
      style={[
        styles.container,
        {
          borderColor: colors.grayLight,
        },
      ]}
      {...props}
      placeholder={t('whatDoYouSearchFor')}
      placeholderTextColor={'gray'}
      textStyle={[
        {
          textAlign: I18nManager.isRTL ? 'right' : 'left',
          height: 30,
          fontFamily: FONT_FAMILY,
          color: 'black',
        },
      ]}
      status="control"
      accessoryLeft={() => (
        <EvilIcons name="search" size={30} color={colors.grayDark} />
      )}
    />
  );
};

export default AppSearchInput;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center',
    borderRadius: 200,
    backgroundColor: 'white',
  },
});
