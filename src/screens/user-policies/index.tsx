import { Box } from 'common';
import { AppHeader, AppSpaceWrapper, AppText } from 'components';
import { useTranslation } from 'react-i18next';
import { I18nManager, ScrollView } from 'react-native';

const UserPolicies = () => {
  const { t } = useTranslation();

  const TXT_ar = `
  توضح سياسة المستخدم هذه القواعد والشروط التي يجب على جميع مستخدمي التطبيق الالتزام بها لضمان تجربة آمنة وعادلة لكل من العملاء ومقدمي الخدمات. باستخدامك للتطبيق، فإنك توافق على الالتزام بما يلي:
إنشاء الحساب:
يجب على المستخدم إدخال بيانات صحيحة وكاملة عند التسجيل.
يُمنع إنشاء أكثر من حساب واحد لنفس المستخدم أو استخدام بيانات مزيفة.
يتحمل المستخدم كامل المسؤولية عن الحفاظ على سرية بيانات الدخول الخاصة به.
استخدام التطبيق:
يلتزم المستخدم باستخدام التطبيق للأغراض المخصصة له فقط (مثل طلب أو تقديم الخدمات).
يُحظر استخدام التطبيق لأي نشاط غير قانوني أو احتيالي أو يتعارض مع القوانين المحلية.
لا يجوز للمستخدم نشر أي محتوى مسيء أو غير لائق أو ينتهك حقوق الآخرين.
الطلبات والحجوزات:
يجب على المستخدم التأكد من صحة تفاصيل الحجز والموقع قبل تأكيد الطلب.
في حال الرغبة في الإلغاء أو التعديل، يجب اتباع سياسة الإلغاء المحددة لكل خدمة.
يحق للتطبيق أو مقدم الخدمة رفض أو إلغاء أي طلب إذا تم الاشتباه في استخدام غير سليم أو مخالف للشروط.
الدفع والمعاملات:
يمكن للمستخدم اختيار وسيلة الدفع المناسبة (نقدًا عند الاستلام أو إلكترونيًا داخل التطبيق).
في حال الدفع الإلكتروني، تتم المعاملة عبر بوابات دفع آمنة ومعتمدة.
يحتفظ التطبيق بحق تعليق المعاملة أو التحقيق فيها في حال وجود شبهة احتيال.
المراجعات والتقييمات:
يحق للمستخدم كتابة تقييم صادق بعد إتمام الخدمة.
يُمنع استخدام التقييم للإساءة أو التشهير بمقدم الخدمة.
يحتفظ التطبيق بالحق في حذف أو تعديل أي تقييم مخالف للسياسات.
الخصوصية وحماية البيانات:
يلتزم التطبيق بحماية خصوصية المستخدمين وعدم مشاركة بياناتهم مع أي طرف ثالث إلا في الحالات القانونية.
يحق للمستخدم مراجعة أو تعديل بياناته في أي وقت من خلال إعدادات الحساب.
المخالفات والعقوبات:
في حال مخالفة المستخدم لأي من هذه الشروط، يحق للتطبيق اتخاذ الإجراءات المناسبة، بما في ذلك:
تنبيه المستخدم.
تعليق الحساب مؤقتًا.
حذف الحساب نهائيًا في حال التكرار أو المخالفة الجسيمة.
المسؤولية:
المستخدم مسؤول عن جميع الأنشطة التي تتم من خلال حسابه.
التطبيق غير مسؤول عن أي تعاملات خارج المنصة أو اتفاقات تتم دون استخدام نظام الحجز الرسمي.
التعديلات على السياسة:
يحتفظ التطبيق بالحق في تعديل سياسة المستخدم في أي وقت.
سيتم إشعار المستخدمين بالتغييرات عبر التطبيق أو البريد الإلكتروني.
استمرار استخدام التطبيق بعد التحديثات يعني الموافقة على الشروط الجديدة.
الدعم والتواصل:  لأي استفسارات أو شكاوى، يمكن التواصل مع فريق الدعم عبر:  📧 البريد الإلكتروني: support@yourapp.com  📞 رقم الهاتف: +966 5X XXX XXXX
  `;

  const TXT_en = `
This User Policy outlines the rules and conditions that all users of the application must follow to ensure a safe and fair experience for both customers and service providers. By using the application, you agree to comply with the following:

Account Creation:
- Users must enter accurate and complete information when registering.
- Creating more than one account for the same user or using fake information is prohibited.
- Users are fully responsible for maintaining the confidentiality of their login credentials.

Using the Application:
- Users must use the application only for its intended purposes (such as requesting or providing services).
- It is prohibited to use the application for any illegal, fraudulent, or locally prohibited activities.
- Users may not publish any offensive, inappropriate, or rights-violating content.

Requests and Bookings:
- Users must verify the accuracy of booking details and location before confirming the request.
- If the user wishes to cancel or modify a booking, they must follow the cancellation policy specified for each service.
- The application or the service provider has the right to reject or cancel any request if misuse or violation of the terms is suspected.

Payments and Transactions:
- Users may choose their preferred payment method (cash on delivery or electronic payment within the app).
- For electronic payments, transactions are processed through secure and certified payment gateways.
- The application reserves the right to suspend or investigate any transaction suspected of fraud.

Reviews and Ratings:
- Users have the right to write an honest review after completing a service.
- It is prohibited to use reviews for insulting or defaming the service provider.
- The application reserves the right to remove or edit any review that violates the policies.

Privacy and Data Protection:
- The application is committed to protecting users’ privacy and not sharing their data with any third party except in legal cases.
- Users have the right to review or edit their information at any time through account settings.

Violations and Penalties:
If a user violates any of these terms, the application has the right to take appropriate action, including:
- Warning the user.
- Temporarily suspending the account.
- Permanently deleting the account in case of repeated or severe violations.

Responsibility:
- The user is responsible for all activities that occur through their account.
- The application is not responsible for any transactions conducted outside the platform or agreements made without using the official booking system.

Policy Modifications:
- The application reserves the right to modify the User Policy at any time.
- Users will be notified of updates through the app or via email.
- Continued use of the application after the updates means acceptance of the new terms.

Support and Contact:
For any inquiries or complaints, you can contact the support team via:
📧 Email: support@yourapp.com
📞 Phone: +966 5X XXX XXXX
  `;
  return (
    <Box flex={1} backgroundColor="pageBackground">
      <AppHeader label={t('userPolicy')} />
      <AppSpaceWrapper>
        <ScrollView>
          <AppText color="customGray">
            {I18nManager.isRTL ? TXT_ar : TXT_en}
          </AppText>
        </ScrollView>
      </AppSpaceWrapper>
    </Box>
  );
};
export default UserPolicies;
