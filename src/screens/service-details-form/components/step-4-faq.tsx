import { Box } from 'common';
import {
  AppButton,
  AppShadowContainer,
  AppSpacer,
  AppText,
} from 'components';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import FaqItem from './faq-item';

interface Step4FaqProps {
  faqs: any[];
  onAddFaq: () => void;
  onDeleteFaq: (index: number) => void;
  onUpdateFaqQuestion: (index: number, value: string, language: 'ar' | 'en') => void;
  onUpdateFaqAnswer: (index: number, value: string, language: 'ar' | 'en') => void;
  errors: any;
  touched: any;
}

const Step4Faq = ({
  faqs,
  onAddFaq,
  onDeleteFaq,
  onUpdateFaqQuestion,
  onUpdateFaqAnswer,
  errors,
  touched,
}: Step4FaqProps) => {
  const { t } = useTranslation();

  return (
    <Box flex={1}>
      <AppShadowContainer
        backgroundColor="white"
        borderRadius={16}
        style={{ padding: 16 }}
      >
        <AppText variant="h5" fontWeight={'700'} marginBottom="m">
          {t('optionalFaq')}
        </AppText>

        <AppText variant="s2" color="grayDark" marginBottom="l">
          {t('addFrequentlyAskedQuestions')}
        </AppText>

        {faqs.map((faq, index) => (
          <Fragment key={index}>
            <FaqItem
              index={index}
              faq={faq}
              errors={errors?.faqs?.[index]}
              touched={touched?.faqs?.[index]}
              onDelete={onDeleteFaq}
              onUpdateQuestion={onUpdateFaqQuestion}
              onUpdateAnswer={onUpdateFaqAnswer}
            />
            {index < faqs.length - 1 && <AppSpacer variant="m" />}
          </Fragment>
        ))}

        <AppSpacer variant="m" />
        <AppButton
          isFullWidth
          isOutLined
          label={t('addNewQuestions')}
          onPress={onAddFaq}
        />
      </AppShadowContainer>

      <AppSpacer variant="m" />

      {/* Completion Message */}
      <AppShadowContainer
        backgroundColor="success"
        borderRadius={16}
        style={{ padding: 16 }}
      >
        <AppText variant="s1" color="white" textAlign="center">
          {t('readyToPublishService')}
        </AppText>
        <AppSpacer variant="s" />
        <AppText variant="s3" color="white" textAlign="center">
          {t('reviewAndPublishMessage')}
        </AppText>
      </AppShadowContainer>
    </Box>
  );
};

export default Step4Faq;

