import * as Yup from 'yup';
import { array, number, object, string, ValidationError } from 'yup';

export const loginScheme = (t: any) =>
  Yup.object().shape({
    email: Yup.string()
      .email(t('errors.emailError'))
      .required(t('errors.fieldRequired')),
    password: Yup.string()
      .min(8, t('errors.passwordAtLeast8'))
      .matches(/[a-z]/, t('errors.passwordMustContainLowcase'))
      .matches(/[A-Z]/, t('errors.passwordMustContainUppercase'))
      .matches(/[0-9]/, t('errors.passwordMustContainNumber'))
      .matches(
        /[@$!%*?&#^()\-_=+{};:,<.>]/,
        t('errors.passwordMustContainSymbol'),
      )
      .required(t('errors.fieldRequired')),
  });

export const signUpScheme = (t: any) =>
  Yup.object().shape({
    email: Yup.string()
      .email(t('errors.emailError'))
      .required(t('errors.fieldRequired')),
    phone: Yup.string().required(t('errors.fieldRequired')),
    firstName: Yup.string().required(t('errors.fieldRequired')),
    lastName: Yup.string().required(t('errors.fieldRequired')),
    password: Yup.string()
      .min(8, t('errors.passwordAtLeast8'))
      .matches(/[a-z]/, t('errors.passwordMustContainLowcase'))
      .matches(/[A-Z]/, t('errors.passwordMustContainUppercase'))
      .matches(/[0-9]/, t('errors.passwordMustContainNumber'))
      .matches(
        /[@$!%*?&#^()\-_=+{};:,<.>]/,
        t('errors.passwordMustContainSymbol'),
      )
      .required(t('errors.fieldRequired')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), undefined], t('errors.passwordsMustMatch'))
      .required(t('errors.fieldRequired')),
  });

export const resetPasswordScheme = (t: any) =>
  Yup.object().shape({
    password: Yup.string()
      .min(8, t('errors.passwordAtLeast8'))
      .matches(/[a-z]/, t('errors.passwordMustContainLowcase'))
      .matches(/[A-Z]/, t('errors.passwordMustContainUppercase'))
      .matches(/[0-9]/, t('errors.passwordMustContainNumber'))
      .matches(
        /[@$!%*?&#^()\-_=+{};:,<.>]/,
        t('errors.passwordMustContainSymbol'),
      )
      .required(t('errors.fieldRequired')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), undefined], t('errors.passwordsMustMatch'))
      .required(t('errors.fieldRequired')),
  });

export const UpdateProfileScheme = (t: any) =>
  Yup.object().shape({
    firstName: Yup.string().required(t('errors.fieldRequired')),
    lastName: Yup.string().required(t('errors.fieldRequired')),
  });

export const createServiceScheme = (t: any) =>
  object().shape({
    // fullName: string().required(t('errors.fieldRequired')),
    // brief: string().required(t('errors.fieldRequired')),
    city: string().required(t('errors.fieldRequired')),
    serviceTitleEn: string()
      .optional()
      .matches(/^[a-zA-Z0-9\s.,!?'-]*$/, t('errors.onlyEnglishAllowed')),
    serviceTitleAr: string()
      .required(t('errors.fieldRequired'))
      .matches(/^[\u0600-\u06FF\s.,!?'-]+$/, t('errors.onlyArabicAllowed')),
    serviceDescriptionEn: string()
      .optional()
      .matches(/^[a-zA-Z0-9\s.,!?'-]*$/, t('errors.onlyEnglishAllowed')),
    serviceDescriptionAr: string()
      .required(t('errors.fieldRequired'))
      .matches(/^[\u0600-\u06FF\s.,!?'-]+$/, t('errors.onlyArabicAllowed')),
    serviceType: string().required(t('errors.fieldRequired')),
    serviceCost: number().required(t('errors.fieldRequired')),
    // servicePeriod: string().required(t('errors.fieldRequired')),
    fullLocation: string().required(t('errors.fieldRequired')),
    locationLink: string().optional(),
    profilePicture: object()
      .shape({
        uri: string().required(t('errors.fieldRequired')),
        type: string().required(t('errors.fieldRequired')),
        fileName: string().required(t('errors.fieldRequired')),
      })
      .required(t('errors.fieldRequired')),
    serviceMedia: array()
      .min(1, t('errors.fieldRequired'))
      .of(
        object().shape({
          uri: string().required(t('errors.fieldRequired')),
          type: string().required(t('errors.fieldRequired')),
          fileName: string().required(t('errors.fieldRequired')),
        }),
      )

      .required(t('errors.fieldRequired')),
    lat: number().required(t('errors.fieldRequired')),
    lng: number().required(t('errors.fieldRequired')),
    category_id: number().required(t('errors.fieldRequired')),
    // status: string().required(t('errors.fieldRequired')),
    faqs: array()
      .of(
        object()
          .shape({
            questionEn: string().matches(/^[a-zA-Z0-9\s.,!?'-]*$/, {
              message: t('errors.onlyEnglishAllowed'),
              excludeEmptyString: true,
            }),
            questionAr: string().matches(/^[\u0600-\u06FF\s.,!?'-]*$/, {
              message: t('errors.onlyArabicAllowed'),
              excludeEmptyString: true,
            }),
            answerEn: string().matches(/^[a-zA-Z0-9\s.,!?'-]*$/, {
              message: t('errors.onlyEnglishAllowed'),
              excludeEmptyString: true,
            }),
            answerAr: string().matches(/^[\u0600-\u06FF\s.,!?'-]*$/, {
              message: t('errors.onlyArabicAllowed'),
              excludeEmptyString: true,
            }),
          })
          .test('faq-complete', t('errors.fieldRequired'), (value, context) => {
            const { questionEn, questionAr, answerEn, answerAr } = value || {};
            // Check if any field is filled
            const hasAnyContent =
              !!questionEn || !!questionAr || !!answerEn || !!answerAr;

            // If no content, it's valid (optional row)
            if (!hasAnyContent) return true;

            // If there is content, ARABIC fields are strictly required
            const isArComplete = !!questionAr && !!answerAr;

            if (isArComplete) return true;

            const errors: ValidationError[] = [];
            // We only enforce errors on Arabic fields if they are missing when other content exists
            if (!questionAr)
              errors.push(
                new ValidationError(
                  t('errors.fieldRequired'),
                  value,
                  `${context.path}.questionAr`,
                ),
              );

            if (!answerAr)
              errors.push(
                new ValidationError(
                  t('errors.fieldRequired'),
                  value,
                  `${context.path}.answerAr`,
                ),
              );

            return new ValidationError(errors);
          }),
      )
      .optional(),
  });
