import { BaseModal } from 'components/modals';
import { AppSpacer, AppSpaceWrapper, AppText } from 'components/atoms';
import { Box, useAppTheme } from 'common';
import { LocationPin } from 'components/icons';
import { forwardRef, useRef } from 'react';
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
  const modalRef = useRef<IModalRef>(null);

  const closeModal = () => {
    if (typeof ref === 'function') {
      // ref is a callback
      return;
    }
    ref?.current?.closeModal?.() || modalRef.current?.closeModal?.();
  };

  const handleSelectMedia = () => {
    closeModal();
    setTimeout(() => onSelectMedia(), 100);
  };

  const handleSelectLocation = () => {
    closeModal();
    setTimeout(() => onSelectLocation(), 100);
  };


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
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleSelectMedia}
            style={styles.actionButton}
          >
            <Box
              width={60}
              height={60}
              borderRadius={30}
              backgroundColor="primary"
              alignItems="center"
              justifyContent="center"
              marginBottom="s"
              style={styles.iconContainer}
            >
              <FontAwesome5 name="images" size={28} color={colors.white} />
            </Box>
            <AppText variant="s2" textAlign="center" color="cutomBlack" fontWeight="500">
              {t('gallery')}
            </AppText>
          </TouchableOpacity>

          {/* Location Option */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleSelectLocation}
            style={styles.actionButton}
          >
            <Box
              width={60}
              height={60}
              borderRadius={30}
              backgroundColor="primary"
              alignItems="center"
              justifyContent="center"
              marginBottom="s"
              style={styles.iconContainer}
            >
              <LocationPin size={28} color={colors.white} />
            </Box>
            <AppText variant="s2" textAlign="center" color="cutomBlack" fontWeight="500">
              {t('location')}
            </AppText>
          </TouchableOpacity>
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

