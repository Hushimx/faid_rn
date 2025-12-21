import { Box, useAppTheme } from 'common';
import {
  AppButton,
  AppInput,
  AppPresseble,
  AppSpacer,
  AppText,
  Trash,
} from 'components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface IProps {
  index: number;
  faq: {
    questionEn: string;
    questionAr: string;
    answerEn: string;
    answerAr: string;
  };
  errors?: any;
  touched?: any;
  onDelete: (index: number) => void;
  onUpdateQuestion: (index: number, value: string, lang: 'en' | 'ar') => void;
  onUpdateAnswer: (index: number, value: string, lang: 'en' | 'ar') => void;
}

const FaqItem = ({
  index,
  faq,
  errors,
  touched,
  onDelete,
  onUpdateQuestion,
  onUpdateAnswer,
}: IProps) => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();

  // Show English fields if they have content initially, otherwise hide
  const [showEnglish, setShowEnglish] = useState(
    !!faq.questionEn || !!faq.answerEn,
  );

  return (
    <Box>
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <AppText color="grayDark">
          {t('question')} {index + 1}
        </AppText>
        <Box flexDirection="row" alignItems="center" gap="s">
          {!showEnglish && (
            <AppPresseble onPress={() => setShowEnglish(true)}>
              <AppText variant="s3" color="primary">
                + {t('addEnglish')}
              </AppText>
            </AppPresseble>
          )}
          {index != 0 && (
            <AppPresseble onPress={() => onDelete(index)}>
              <Trash />
            </AppPresseble>
          )}
        </Box>
      </Box>
      <AppSpacer variant="ss" />
      {showEnglish && (
        <>
          <AppInput
            placeholder={t('enterQuestionEn')}
            value={faq.questionEn}
            onChangeText={value => onUpdateQuestion(index, value, 'en')}
            touched={touched?.questionEn}
            caption={errors?.questionEn}
          />
          <AppSpacer variant="ss" />
        </>
      )}
      <AppInput
        placeholder={t('enterQuestionAr')}
        value={faq.questionAr}
        onChangeText={value => onUpdateQuestion(index, value, 'ar')}
        touched={touched?.questionAr}
        caption={errors?.questionAr}
      />
      <AppSpacer variant="ss" />
      {showEnglish && (
        <>
          <AppInput
            placeholder={t('enterAnswerEn')}
            value={faq.answerEn}
            onChangeText={value => onUpdateAnswer(index, value, 'en')}
            touched={touched?.answerEn}
            caption={errors?.answerEn}
          />
          <AppSpacer variant="ss" />
        </>
      )}
      <AppInput
        placeholder={t('enterAnswerAr')}
        value={faq.answerAr}
        onChangeText={value => onUpdateAnswer(index, value, 'ar')}
        touched={touched?.answerAr}
        caption={errors?.answerAr}
      />
      <AppSpacer variant="s" />
    </Box>
  );
};

export default FaqItem;
