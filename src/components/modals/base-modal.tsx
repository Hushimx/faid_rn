import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { BottomSheetFlatListProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetScrollable/types';
import { useBottomSheetBackHandler } from '@hooks';
import { Box, FONT_FAMILY, SPACING, useAppTheme } from 'common';
import { AppErrorMessage, AppSpacer, AppText } from 'components/atoms';
import {
  forwardRef,
  Fragment,
  ReactNode,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  I18nManager,
  KeyboardTypeOptions,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { IModalRef } from 'types';
import KeyboardRestoreHandler from './keyboard-restore-handler';
const { height } = Dimensions.get('screen');
interface IProps extends BottomSheetModalProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  isNotClosable?: boolean;
  onDismiss?: () => void;
  enableContentPanningGesture?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

interface InputProps {
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  label?: string;
  error?: string;
  touched?: boolean;
  keyboardType?: KeyboardTypeOptions;
  accessoryLeft?: ReactNode;
  isSearch?: boolean;
}

interface BaseModalComponent
  extends React.ForwardRefExoticComponent<
    IProps & React.RefAttributes<IModalRef>
  > {
  AppListContainer: typeof AppListContainer;
  FlatList: typeof BottomSheetFlatList;
  Input: typeof Input;
  KeyboardRestoreHandler: typeof KeyboardRestoreHandler;
}

const maxHeight = height * 0.95; // Set max height to 95% of screen height

const BaseModalInner = (props: IProps, ref: any) => {
  const {
    children,
    isNotClosable,
    enableContentPanningGesture,
    containerStyle,
    ...otherProps
  } = props;

  const { colors } = useAppTheme();
  const { bottom } = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const { handleSheetPositionChange } =
    useBottomSheetBackHandler(bottomSheetRef);

  useImperativeHandle(ref, () => ({
    openModal() {
      bottomSheetRef?.current?.present();
    },
    closeModal() {
      closeCurrentModal();
    },
    reset() {
      bottomSheetRef?.current?.snapToIndex(0);
    },
    snapToIndexZero() {
      bottomSheetRef?.current?.snapToIndex(0);
    },
  }));

  const closeCurrentModal = () => {
    // if (isNotClosable) return;
    bottomSheetRef?.current?.dismiss();
  };

  const renderBackDrop = useCallback((props: any) => {
    return (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        onPress={isNotClosable ? null : props?.onPress}
        pressBehavior={isNotClosable ? 'collapse' : 'close'}
        {...props}
      />
    );
  }, []);
  return (
    <BottomSheetModal
      enableDynamicSizing
      enablePanDownToClose={true}
      ref={bottomSheetRef}
      onChange={handleSheetPositionChange}
      index={0}
      handleIndicatorStyle={{
        backgroundColor: colors.grayLight,
        width: 100,
      }}
      backdropComponent={renderBackDrop}
      enableDismissOnClose
      maxDynamicContentSize={maxHeight}
      enableContentPanningGesture={enableContentPanningGesture}
      {...otherProps}
    >
      <BottomSheetView
        style={[
          {
            flex: 1,
            paddingBottom: bottom + 8,
            maxHeight,
          },
          containerStyle,
        ]}
      >
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const AppListContainer = ({ children }: any) => (
  <Box height={height}>{children}</Box>
);

const AppFlatList = ({ children, ...props }: BottomSheetFlatListProps<any>) => {
  const { t } = useTranslation();
  return (
    <BottomSheetFlatList
      ListEmptyComponent={
        <Box flex={1} alignItems="center" justifyContent="center">
          <AppText variant="s1">{t('noData')}</AppText>
        </Box>
      }
      contentContainerStyle={{
        paddingBottom: SPACING.xxl * 3,
      }}
      {...props}
      ListFooterComponent={<AppSpacer variant="xl" />}
    />
  );
};

const Input = ({
  placeholder,
  value,
  onChangeText,
  label,
  error,
  touched,
  keyboardType,
  accessoryLeft,
  isSearch = false,
}: InputProps) => {
  const { colors } = useAppTheme();
  const isError = !!touched && !!error;

  return (
    <Box>
      {label && (
        <Fragment>
          <AppText variant="s1" color="grayDark">
            {label}
          </AppText>
          <AppSpacer variant="s" />
        </Fragment>
      )}
      <Box
        style={[
          isSearch ? styles.searchInputContainer : styles.inputContainer,
          {
            borderColor: isError ? colors.red : colors.grayLight,
            backgroundColor: colors.white,
          },
        ]}
      >
        {(accessoryLeft || isSearch) && (
          <Box marginRight="s">
            {accessoryLeft || (
              <EvilIcons name="search" size={30} color={colors.grayDark} />
            )}
          </Box>
        )}
        <BottomSheetTextInput
          style={styles.input}
          placeholderTextColor={'gray'}
          spellCheck={false}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
        />
      </Box>
      <AppErrorMessage text={error ?? ''} isError={isError} />
    </Box>
  );
};

const BaseModal = forwardRef(BaseModalInner) as BaseModalComponent;
BaseModal.Input = Input;
BaseModal.AppListContainer = AppListContainer;
BaseModal.FlatList = AppFlatList;
BaseModal.KeyboardRestoreHandler = KeyboardRestoreHandler;

export default BaseModal;

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    alignSelf: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInputContainer: {
    width: '100%',
    alignSelf: 'center',
    borderRadius: 200,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: '100%',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    fontFamily: FONT_FAMILY,
    color: 'black',
  },
});
