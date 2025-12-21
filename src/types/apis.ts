import { OTP_TYPE_ENUM } from './auth';
import { PRICE_TYPE_ENUM } from './general';

export interface ISignUpPayload {
  email: string;
  phone: string;
  password: string;
  first_name: string;
  last_name: string;
  password_confirmation: string;
  fcm_token: fcmToken;
}

type fcmToken = string;

export interface ILoginPayload {
  email: string;
  password: string;
  fcm_token: fcmToken;
}
export interface ISendOtpPayload {
  phone: string;
}
export interface IVerifyOtpPayload {
  phone: string;
  otp: string;
  type: OTP_TYPE_ENUM;
}

export interface IVerifyOtpResponse {
  otp: string | null;
}

export interface IResetPasswordPayload {
  password: string;
  password_confirmation: string;
  phone: string;
  otp: string;
}
export interface ILogoutPayload {
  fcm_token: fcmToken;
}
export type IUpdateProfilePayload = Pick<ISignUpPayload, 'first_name'> &
  Pick<ISignUpPayload, 'last_name'>;

export enum QUERIES_KEY_ENUM {
  categories = 'categories',
  services = 'services',
  service_details = 'service_details',
  show_all_service_list = 'show_all_service_list',
  vendor_services = 'vendor_services',
  send_otp = 'send_otp',
  get_service_reviews = 'get_service_reviews',
  cities = 'cities',
  offers = 'offers',
  notifications = 'notifications',
}

export interface ICityResponse {
  id: number;
  name: string;
}

export interface IGetCategoriesPayload {
  currentPage?: number;
  search?: string;
  cityId?: number;
}

export interface IGetServicesForCategoryPayload {
  categoryId: number;
  currentPage?: number;
  search?: string;
  cityId?: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface IGetVendorServicesPayload {
  vendorId: number;
  currentPage?: number;
  search?: string;
}

export interface IGetServicePayload {
  serviceId: number;
}

export interface IVendor {
  id: number;
  name: string;
  profile_picture: string;
}

export interface IServiceMedia {
  url: string;
  is_primary: boolean;
  type: 'image' | 'video';
}
export interface IOffers {
  image: string;
}

export interface IServiceReviewsPayload {
  serviceId: number;
  page?: number;
  per_page?: number;
}
export interface IAddServiceReviewPayload {
  serviceId: number;
  rating: number;
  comment: string;
}

export interface IServiceFaq {
  question: string;
  answer: string;
}
export interface IServiceResponse {
  title: string;
  description: string;
  price: number;
  price_type: PRICE_TYPE_ENUM;
  id: number;
  vendor: IVendor;
  rating: number;
  reviews_count: number;
  reviews: any[];
  images: IServiceMedia[];
  videos: IServiceMedia[];
  primary_image: {
    id: number;
    url: string;
  };
  address: string;
  lat: number;
  lng: number;
  city: string;
  faqs: IServiceFaq[];
}

export interface IServiceReviewResponse {
  id: number;
  rating: number;
  comment: string;
  user: IVendor;
  created_at: string;
}

export interface IStartChatPayload {
  service_id: number;
  vendor_id: number;
}

export interface IStartChatResponse {
  id: number;
  user_id: number;
  vendor_id: number;
  service_id: number;
  created_at: string;
  updated_at: string;
}

export interface IMessageResponse {
  id: number;
  chat_id: number;
  sender_id: number;
  message_type: string;
  message: string;
  file_path: string | null;
  file_type: string | null;
  created_at: string;
  updated_at: string;
}
export interface ISendMessagePayload {
  message?: string;
  file?: any;
}

export interface IAddServicePayload {
  category_id: number;
  title: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  price_type: string;
  price: number;
  media: {
    file: any;
    is_primary: boolean;
  }[];
  lat: number;
  lng: number;
}

export interface INotification {
  id: string;
  title: string;
  message: string;
  type: string;
  read_at: string | null;
  created_at: string;
  data?: any;
}

export interface IGetNotificationsPayload {
  currentPage?: number;
  per_page?: number;
}

export interface IMarkNotificationAsReadPayload {
  notificationId: number;
}
