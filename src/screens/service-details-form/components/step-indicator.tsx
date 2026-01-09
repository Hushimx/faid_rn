import { Box, useAppTheme } from 'common';
import { AppText } from 'components/atoms';
import { useTranslation } from 'react-i18next';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

const StepIndicator = ({ currentStep, totalSteps, steps }: StepIndicatorProps) => {
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  return (
    <Box paddingHorizontal="m" paddingVertical="s">
      <AppText variant="s2" color="grayDark" textAlign="center" marginBottom="s">
        {t('step')} {currentStep} {t('of')} {totalSteps}
      </AppText>

      <Box flexDirection="row" alignItems="center" justifyContent="space-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <Box key={index} flex={1} alignItems="center">
              <Box
                width={32}
                height={32}
                borderRadius={16}
                backgroundColor={
                  isCompleted ? 'success' :
                  isActive ? 'primary' :
                  'grayLight'
                }
                alignItems="center"
                justifyContent="center"
                marginBottom="ss"
              >
                <AppText
                  variant="s3"
                  color={isCompleted || isActive ? 'white' : 'grayDark'}
                  fontWeight="700"
                >
                  {stepNumber}
                </AppText>
              </Box>

              <AppText
                variant="s3"
                color={
                  isCompleted ? 'success' :
                  isActive ? 'primary' :
                  'grayDark'
                }
                textAlign="center"
                numberOfLines={2}
              >
                {step}
              </AppText>

              {index < steps.length - 1 && (
                <Box
                  position="absolute"
                  top={16}
                  right={-16}
                  width={32}
                  height={2}
                  backgroundColor={isCompleted ? 'success' : 'grayLight'}
                />
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default StepIndicator;

