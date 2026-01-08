import { Box } from 'common';
import {
  AppHeader,
  AppPresseble,
  AppSpaceWrapper,
  AppSpacer,
  AppText,
  AppTextArea,
  AppInput,
} from 'components';
import { useCreateTicketController } from 'hooks';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { TicketPriority } from 'types';

const CreateTicket = () => {
  const { t } = useTranslation();
  const {
    subject,
    setSubject,
    description,
    setDescription,
    priority,
    setPriority,
    errors,
    handleSubmit,
    isSubmitting,
  } = useCreateTicketController();

  const priorities: TicketPriority[] = ['low', 'medium', 'high'];

  return (
    <Box flex={1} backgroundColor="pageBackground">
      <AppHeader label={t('createTicket')} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <AppSpaceWrapper>
          <AppSpacer variant="sm" />

          {/* Subject Input */}
          <Box marginBottom="m">
            <AppInput
              label={t('subject')}
              placeholder={t('enterTicketSubject')}
              value={subject}
              onChangeText={setSubject}
              maxLength={255}
              touched={!!errors.subject}
              caption={errors.subject}
            />
            <AppText variant="s3" color="customGray" marginTop="ss">
              {subject.length}/255 {t('characters')}
            </AppText>
          </Box>

          {/* Description Input */}
          <Box marginBottom="m">
            <AppTextArea
              label={t('description')}
              placeholder={t('enterTicketDescription')}
              value={description}
              onChangeText={setDescription}
              maxLength={5000}
              touched={!!errors.description}
              caption={errors.description}
              style={styles.textArea}
            />
            <AppText variant="s3" color="customGray" marginTop="ss">
              {description.length}/5000 {t('characters')}
            </AppText>
          </Box>

          {/* Priority Selection */}
          <Box marginBottom="m">
            <AppText variant="s1" color="grayDark" marginBottom="s">
              {t('priority')}
            </AppText>
            <Box flexDirection="row" flexWrap="wrap">
              {priorities.map(p => (
                <TouchableOpacity
                  key={p}
                  onPress={() => setPriority(p)}
                  style={[
                    styles.priorityButton,
                    priority === p && styles.priorityButtonActive,
                  ]}
                >
                  <AppText
                    color={priority === p ? 'white' : 'cutomBlack'}
                    variant="s2"
                    fontWeight={priority === p ? '700' : '400'}
                  >
                    {t(p)}
                  </AppText>
                </TouchableOpacity>
              ))}
            </Box>
          </Box>

          {/* Submit Button */}
          <AppPresseble
            onPress={handleSubmit}
            isLoading={isSubmitting}
            disabled={isSubmitting}
            style={styles.submitButton}
          >
            <AppText color="white" variant="s1" fontWeight="700">
              {t('createTicket')}
            </AppText>
          </AppPresseble>

          <AppSpacer variant="m" />
        </AppSpaceWrapper>
      </ScrollView>
    </Box>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  textArea: {
    minHeight: 150,
  },
  priorityButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 12,
    marginBottom: 12,
  },
  priorityButtonActive: {
    backgroundColor: '#007AFF',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
});

export default CreateTicket;

