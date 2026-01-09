import { Box } from 'common';
import { AppErrorMessage, AppShadowContainer, AppSpacer, AppText } from 'components';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { UplaodBox } from 'components';
import ServiceImagesList from './service-images-list';

interface Step1MediaProps {
  serviceMedia: any[];
  onUploadServiceMedia: () => void;
  onDeleteServiceImage: (index: number) => void;
  errors: any;
  touched: any;
}

const Step1Media = ({
  serviceMedia,
  onUploadServiceMedia,
  onDeleteServiceImage,
  errors,
  touched,
}: Step1MediaProps) => {
  const { t } = useTranslation();

  return (
    <Box flex={1}>
      <AppShadowContainer
        backgroundColor="white"
        borderRadius={16}
        style={{ padding: 16 }}
      >
        <AppText variant="h5" fontWeight={'700'} marginBottom="s">
          {t('serviceMedia')}
        </AppText>

        <AppText variant="s2" color="grayDark" marginBottom="m">
          {t('uploadServiceMediaDescription')}
        </AppText>

        {!serviceMedia?.length && (
          <Fragment>
            <UplaodBox
              title={t('uploadCleanImages')}
              subTitle={t('maxUploadSizeForImage')}
              onPress={onUploadServiceMedia}
              isError={!!errors.serviceMedia && !!touched?.serviceMedia}
            />
            <AppSpacer variant="s" />
            <AppErrorMessage
              isError={!!errors.serviceMedia && !!touched?.serviceMedia}
              text={
                typeof errors.serviceMedia === 'string'
                  ? errors.serviceMedia
                  : t('errors.fieldRequired')
              }
            />
          </Fragment>
        )}

        {!!serviceMedia?.length && (
          <ServiceImagesList
            serviceMedia={serviceMedia}
            onDeleteServiceImage={onDeleteServiceImage}
            onUploadServiceImages={onUploadServiceMedia}
          />
        )}
      </AppShadowContainer>
    </Box>
  );
};

export default Step1Media;

