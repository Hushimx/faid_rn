import { Box } from 'common';
import { AppPresseble, AppSpacer, AppText, Chevron } from 'components';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutAnimation, Platform, UIManager } from 'react-native';
import { IServiceFaq } from 'types';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface IProps {
  data: IServiceFaq[];
}

const FaqItem = ({ question, answer }: IServiceFaq) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const onFaqPress = () => {
    setIsExpanded(!isExpanded);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };
  return (
    <Box>
      <AppPresseble onPress={onFaqPress}>
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <AppText color="customGray">{question}</AppText>

          <Chevron
            size={15}
            styles={{ transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] }}
          />
        </Box>
      </AppPresseble>
      {isExpanded && <AppText marginTop="ss">{answer}</AppText>}
    </Box>
  );
};

const Faqs: FC<IProps> = ({ data }) => {
  const { t } = useTranslation();
  return (
    <Box>
      <AppText fontWeight={'700'}>{t('aboutFaq')}</AppText>
      <AppSpacer variant="sss" />
      {data?.map((item, index) => (
        <FaqItem key={index} question={item?.question} answer={item?.answer} />
      ))}
    </Box>
  );
};

export default Faqs;
