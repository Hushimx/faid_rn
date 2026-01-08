import { BaseModal } from 'components/modals';
import { AppPresseble, AppSpacer, AppSpaceWrapper, AppText } from 'components/atoms';
import { Box, useAppTheme } from 'common';
import { LocationPin } from 'components/icons';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { IModalRef } from 'types';
import { StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

interface IChatActionsModalProps {
  onSelectMedia: () => void;
  onSelectLocation: () => void;
}

const ChatActionsModal = (
  props: IChatActionsModalProps,
  ref: React.Ref<IModalRef>,
) => {
  const { onSelectMedia, onSelectLocation } = props;
  const { t } = useTranslation();
  const { colors } = useAppTheme();

  const closeModal = () => {
    ref?.current?.closeModal();
  };

  const handleSelectMedia = () => {
    closeModal();
    setTimeout(() => onSelectMedia(), 100);
  };

  const handleSelectLocation = () => {
    closeModal();
    setTimeout(() => onSelectLocation(), 100);
  };


  const ActionButton = ({
    icon,
    label,
    onPress,
    iconColor = 'primary',
  }: {
    icon: React.ReactNode;
    label: string;
    onPress: () => void;
    iconColor?: keyof typeof colors;
  }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.actionButton}
    >
      <Box
        width={60}
        height={60}
        borderRadius={30}
        backgroundColor={iconColor}
        alignItems="center"
        justifyContent="center"
        marginBottom="s"
        style={styles.iconContainer}
      >
        {icon}
      </Box>
      <AppText variant="s2" textAlign="center" color="cutomBlack" fontWeight="500">
        {label}
      </AppText>
    </TouchableOpacity>
  );

  return (
    <BaseModal ref={ref}>
      <AppSpaceWrapper>
        <AppSpacer variant="m" />
        <Box
          flexDirection="row"
          justifyContent="space-around"
          alignItems="center"
          paddingHorizontal="m"
          paddingBottom="xl"
        >
          {/* Gallery Option */}
          <ActionButton
            icon={
              <FontAwesome5 name="images" size={28} color={colors.white} />
            }
            label={t('gallery')}
            onPress={handleSelectMedia}
          />

          {/* Location Option */}
          <ActionButton
            icon={<LocationPin size={28} color={colors.white} />}
            label={t('location')}
            onPress={handleSelectLocation}
          />
        </Box>
      </AppSpaceWrapper>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  iconContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default forwardRef(ChatActionsModal);

