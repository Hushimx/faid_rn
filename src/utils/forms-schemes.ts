import * as Yup from 'yup';
import { array, number, object, string } from 'yup';

export const loginScheme = (t: any) =>
  Yup.object().shape({
    email: Yup.string()
      .email(t('errors.emailError'))
      .required(t('errors.fieldRequired')),
    password: Yup.string()
      .min(8, t('errors.passwordAtLeast8'))
      .matches(/^[a-zA-Z0-9]+$/, t('errors.passwordOnlyLettersNumbers'))
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
      .matches(/^[a-zA-Z0-9]+$/, t('errors.passwordOnlyLettersNumbers'))
      .required(t('errors.fieldRequired')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), undefined], t('errors.passwordsMustMatch'))
      .required(t('errors.fieldRequired')),
  });

export const resetPasswordScheme = (t: any) =>
  Yup.object().shape({
    password: Yup.string()
      .min(8, t('errors.passwordAtLeast8'))
      .matches(/^[a-zA-Z0-9]+$/, t('errors.passwordOnlyLettersNumbers'))
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
    cityAr: string().required(t('errors.fieldRequired')),
    cityEn: string().optional(),
    serviceTitleEn: string().optional(),
    serviceTitleAr: string().required(t('errors.fieldRequired')),
    serviceDescriptionEn: string().optional(),
    serviceDescriptionAr: string().required(t('errors.fieldRequired')),
    serviceType: string().required(t('errors.fieldRequired')),
    serviceCost: number().when('serviceType', {
      is: (val: string) => val !== 'unspecified',
      then: (schema) => schema.required(t('errors.fieldRequired')),
      otherwise: (schema) => schema.optional(),
    }),
    // servicePeriod: string().required(t('errors.fieldRequired')),
    fullLocation: string().required(t('errors.fieldRequired')),
    fullLocationAr: string().required(t('errors.fieldRequired')),
    fullLocationEn: string().optional(),
    locationLink: string().optional(),
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
            id: number().optional(),
            questionEn: string().matches(/^[a-zA-Z0-9\s.,!?'-]*$/, {
              message: t('errors.onlyEnglishAllowed'),
              excludeEmptyString: true,
            }).optional(),
            questionAr: string().matches(/^[\u0600-\u06FF\s.,!?'-]*$/, {
              message: t('errors.onlyArabicAllowed'),
              excludeEmptyString: true,
            }).optional(),
            answerEn: string().matches(/^[a-zA-Z0-9\s.,!?'-]*$/, {
              message: t('errors.onlyEnglishAllowed'),
              excludeEmptyString: true,
            }).optional(),
            answerAr: string().matches(/^[\u0600-\u06FF\s.,!?'-]*$/, {
              message: t('errors.onlyArabicAllowed'),
              excludeEmptyString: true,
            }).optional(),
          })
          .test('faq-complete', t('errors.fieldRequired'), (value) => {
            const { questionEn, questionAr, answerEn, answerAr, id } = value || {};
            // Check if any field is filled
            const hasAnyContent =
              !!questionEn || !!questionAr || !!answerEn || !!answerAr;

            // If no content, it's valid (optional row)
            if (!hasAnyContent) return true;

            // For existing FAQs (with id), allow any combination
            // For new FAQs, require at least Arabic question and answer
            if (id) {
              // Existing FAQ - just need at least one question and one answer
              const hasQuestion = !!(questionEn || questionAr);
              const hasAnswer = !!(answerEn || answerAr);
              return hasQuestion && hasAnswer;
            } else {
              // New FAQ - require Arabic fields
              return !!(questionAr && answerAr);
            }
          }),
      )
      .optional(),
  });
