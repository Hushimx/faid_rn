import { Box } from 'common';
import {
  AppInput,
  AppShadowContainer,
  AppSpacer,
  AppText,
  AppTextArea,
} from 'components';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash } from 'components/icons';
import { AppPresseble } from 'components/atoms';
import { useState } from 'react';
import AppDropdown from './app-dropdown';

interface Step2DetailsProps {
  values: any;
  errors: any;
  touched: any;
  categories: any[];
  onCategorySelect: (value: string | number) => void;
  onTitleChange: (value: string) => void;
  onTitleEnChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onDescriptionEnChange: (value: string) => void;
}

const Step2Details = ({
  values,
  errors,
  touched,
  categories,
  onCategorySelect,
  onTitleChange,
  onTitleEnChange,
  onDescriptionChange,
  onDescriptionEnChange,
}: Step2DetailsProps) => {
  const { t } = useTranslation();
  const [showTitleEn, setShowTitleEn] = useState(!!values.serviceTitleEn);
  const [showDescriptionEn, setShowDescriptionEn] = useState(!!values.serviceDescriptionEn);

  return (
    <Box flex={1}>
      <AppShadowContainer
        backgroundColor="white"
        borderRadius={16}
        style={{ padding: 16 }}
      >
        <AppText variant="h5" fontWeight={'700'} marginBottom="m">
          {t('serviceDetails')}
        </AppText>

        <AppText variant="s2" color="grayDark" marginBottom="l">
          {t('enterServiceBasicDetails')}
        </AppText>

        {/* Arabic Title */}
        <AppInput
          label={t('serviceTitleAr')}
          placeholder={t('enterServiceTitle')}
          value={values.serviceTitleAr}
          onChangeText={onTitleChange}
          touched={touched.serviceTitleAr}
          caption={errors.serviceTitleAr}
        />

        <AppSpacer variant="m" />

        {/* English Title (Optional) */}
        {showTitleEn ? (
          <Box>
            <Box
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              marginBottom="ss"
            >
              <AppText color="grayDark" variant="s2">
                {t('serviceTitleEn')}
              </AppText>
              <AppPresseble
                onPress={() => {
                  setShowTitleEn(false);
                  onTitleEnChange('');
                }}
              >
                <Trash size={18} />
              </AppPresseble>
            </Box>
            <AppInput
              placeholder={t('enterServiceTitle')}
              value={values.serviceTitleEn}
              onChangeText={onTitleEnChange}
              touched={touched.serviceTitleEn}
              caption={errors.serviceTitleEn}
            />
          </Box>
        ) : (
          <AppPresseble onPress={() => setShowTitleEn(true)}>
            <AppText color="primary" variant="s1">
              + {t('addEnglishTitle')}
            </AppText>
          </AppPresseble>
        )}

        <AppSpacer variant="m" />

        {/* Category */}
        <AppDropdown
          data={categories?.map(item => ({
            label: item?.name,
            value: item?.id,
          }))}
          onSelect={onCategorySelect}
          value={values.category_id}
          placeholder={t('selectCategory')}
          label={t('category')}
          error={errors?.category_id}
          touched={touched?.category_id}
        />

        <AppSpacer variant="m" />

        {/* Arabic Description */}
        <AppTextArea
          label={t('serviceDescriptionAr')}
          placeholder={t('enterServiceDescription')}
          value={values.serviceDescriptionAr}
          onChangeText={onDescriptionChange}
          touched={touched.serviceDescriptionAr}
          caption={errors.serviceDescriptionAr}
        />

        <AppSpacer variant="m" />

        {/* English Description (Optional) */}
        {showDescriptionEn ? (
          <Box>
            <Box
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              marginBottom="ss"
            >
              <AppText color="grayDark" variant="s2">
                {t('serviceDescriptionEn')}
              </AppText>
              <AppPresseble
                onPress={() => {
                  setShowDescriptionEn(false);
                  onDescriptionEnChange('');
                }}
              >
                <Trash size={18} />
              </AppPresseble>
            </Box>
            <AppTextArea
              placeholder={t('enterServiceDescription')}
              value={values.serviceDescriptionEn}
              onChangeText={onDescriptionEnChange}
              touched={touched.serviceDescriptionEn}
              caption={errors.serviceDescriptionEn}
            />
          </Box>
        ) : (
          <AppPresseble onPress={() => setShowDescriptionEn(true)}>
            <AppText color="primary" variant="s1">
              + {t('addEnglishDescription')}
            </AppText>
          </AppPresseble>
        )}
      </AppShadowContainer>
    </Box>
  );
};

export default Step2Details;

