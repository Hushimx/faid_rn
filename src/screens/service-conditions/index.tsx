import { Box } from 'common';
import { AppHeader, AppSpaceWrapper, AppText } from 'components';
import { useTranslation } from 'react-i18next';
import { I18nManager, ScrollView } from 'react-native';

const TXT_ar = `
مرحبًا بك في تطبيقنا! باستخدامك للتطبيق أو أي من الخدمات المقدمة من خلاله، فإنك توافق على الالتزام بهذه الشروط والأحكام. يرجى قراءة هذه الشروط بعناية قبل استخدام التطبيق أو إنشاء حساب.
يُقصد بالمصطلحات التالية ما يلي:  "التطبيق" هو المنصة الإلكترونية التي تتيح للمستخدمين طلب خدمات مختلفة من مقدمي الخدمات المسجلين.  "المستخدم" هو أي شخص يقوم بتحميل التطبيق أو تصفحه أو طلب خدمة من خلاله.  "مقدم الخدمة" هو الشخص أو الجهة التي تقدم خدمة معينة عبر التطبيق.  "الخدمة" هي أي عملية يقدمها مقدم الخدمة للمستخدم (مثل تنظيف المكاتب أو المنازل).
يجب أن يكون عمر المستخدم 18 عامًا أو أكثر لاستخدام التطبيق أو التسجيل فيه، ويلتزم بتقديم معلومات صحيحة ودقيقة عند إنشاء الحساب أو طلب الخدمة. يُمنع استخدام التطبيق لأي أغراض غير قانونية أو مخالفة للآداب العامة، ويحتفظ التطبيق بحق تعليق أو إلغاء أي حساب يخالف الشروط دون إشعار مسبق.
يتم تأكيد الحجز بعد موافقة مقدم الخدمة واستلام إشعار التأكيد، وقد تختلف الأسعار بناءً على نوع الخدمة أو الموقع أو مدة التنفيذ. يحق للمستخدم إلغاء الحجز أو تعديله وفق سياسة الإلغاء المحددة من مقدم الخدمة.
يمكن الدفع عبر الوسائل المتاحة في التطبيق سواء إلكترونيًا أو نقدًا عند الاستلام، وجميع الأسعار شاملة للضرائب ما لم يُذكر خلاف ذلك. في حال الدفع الإلكتروني، يتم التعامل مع بوابات دفع آمنة ومعتمدة.
يحق للمستخدم إلغاء الحجز قبل 24 ساعة من الموعد دون رسوم، أما الإلغاء خلال أقل من 24 ساعة فقد يخضع لرسوم جزئية يحددها مقدم الخدمة. في حال عدم حضور مقدم الخدمة دون إشعار مسبق، يحق للمستخدم استرداد المبلغ كاملًا.
التطبيق هو منصة وسيطة فقط ولا يتحمل مسؤولية مباشرة عن جودة أو تنفيذ الخدمات من قبل مقدميها. مقدم الخدمة هو المسؤول الوحيد عن جودة الخدمة المقدمة وسلامة العاملين، كما أن التطبيق غير مسؤول عن أي أضرار مادية أو شخصية ناتجة عن تنفيذ الخدمة.
يتم جمع البيانات الشخصية للمستخدمين فقط لأغراض تشغيل الخدمة وتحسينها، ولا تتم مشاركة البيانات مع أي طرف ثالث دون موافقة المستخدم، إلا في الحالات القانونية. يمكن للمستخدم مراجعة سياسة الخصوصية لمعرفة المزيد عن كيفية استخدام البيانات.
يمكن للمستخدمين تقييم مقدمي الخدمات بعد إتمام الخدمة، ويحق للتطبيق حذف أي تقييم يحتوي على إساءة أو لغة غير لائقة أو معلومات مضللة.
يحتفظ التطبيق بالحق في تعديل هذه الشروط في أي وقت، وسيتم إخطار المستخدمين بالتغييرات عبر التطبيق أو البريد الإلكتروني، ويعد استمرار استخدام التطبيق بعد التعديلات موافقة ضمنية على الشروط الجديدة.
لأي استفسارات أو شكاوى، يمكن التواصل مع فريق الدعم الفني عبر البريد الإلكتروني: faid.app0@gmail.com أو من خلال رقم الدعم: +966 54 110 3452.
`;
const TXT_en = `
Welcome to our application! By using the app or any of the services provided through it, you agree to be bound by these terms and conditions. Please read these terms carefully before using the app or creating an account.

The following terms mean the following:
"Application" refers to the digital platform that enables users to request various services from registered service providers.
"User" refers to any person who downloads, browses, or requests a service through the application.
"Service Provider" refers to the person or entity that offers a specific service through the application.
"Service" means any task provided by the service provider to the user (such as office or home cleaning).

Users must be 18 years old or above to use or register in the application, and must provide accurate and correct information when creating an account or requesting a service. It is prohibited to use the app for any illegal purposes or actions that violate public morals. The application reserves the right to suspend or cancel any account that violates the terms without prior notice.

A booking is confirmed after the service provider approves it and a confirmation notification is received. Prices may vary depending on the type of service, location, or service duration. The user has the right to cancel or modify the booking according to the service provider’s cancellation policy.

Payment can be made through the available methods in the application, whether electronically or in cash upon delivery. All prices include taxes unless otherwise stated. For electronic payments, secure and certified payment gateways are used.

The user has the right to cancel a booking at least 24 hours before the scheduled time without any fees. Cancellation within less than 24 hours may be subject to partial fees determined by the service provider. If the service provider fails to attend without prior notice, the user is entitled to a full refund.

The application is only an intermediary platform and does not bear direct responsibility for the quality or execution of services by the providers. The service provider is solely responsible for the quality of the service provided and the safety of workers. The application is not responsible for any material or personal damages resulting from the execution of the service.

User personal data is collected only for the purpose of operating and improving the service and is not shared with any third party without the user’s consent, except in legal cases. Users can review the privacy policy to learn more about how their data is used.

Users can rate service providers after completing the service, and the application reserves the right to delete any rating that contains abuse, inappropriate language, or misleading information.

The application reserves the right to modify these terms at any time. Users will be notified of changes through the app or via email, and continued use of the app after modifications constitutes implicit acceptance of the new terms.

For any inquiries or complaints, you can contact the technical support team via email at: faid.app0@gmail.com or through the support number: +966 54 110 3452.
`;

const ServiceConditions = () => {
  const { t } = useTranslation();
  return (
    <Box flex={1} backgroundColor="pageBackground">
      <AppHeader label={t('serviceConditions')} />
      <AppSpaceWrapper>
        <ScrollView>
          <AppText color="customGray" textAlign="justify">
            {I18nManager.isRTL ? TXT_ar : TXT_en}
          </AppText>
        </ScrollView>
      </AppSpaceWrapper>
    </Box>
  );
};
export default ServiceConditions;
