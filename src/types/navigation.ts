import { IVendor } from './apis';
import { IUser } from './auth';

interface IBaseOtpParams {
  email: string;
  isForResetPassword?: boolean;
  isForRegister?: boolean;
  userData?: {
    token: string;
    user: IUser;
  };
}

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgetPassword?: {
    isForVerification?: boolean;
  };
  EnterOtp: IBaseOtpParams;
  ResetPassword: {
    email: string;
    otp: string;
  };
  Home: undefined;
  ServiceDetails: {
    serviceId: number;
  };
  ShowAllForCategory: {
    categoryId: number;
    categoryName?: string;
  };
  VendorServices: undefined;
  ServiceDetailsForm: undefined;
  EditService: {
    serviceId: number;
  };
  UpdateProfile: undefined;
  Chat: {
    vendor: IVendor;
    chatId: number;
  };
  FullScreenMapView: {
    latitude: number;
    longitude: number;
  };
  ServiceConditions: undefined;
  Settings: undefined;
  UserPolicies: undefined;
  ShowAllServices: undefined;
  Notifications: undefined;
  ChatsList: undefined;
  VendorApplication: undefined;
  VendorStore: {
    vendorId: number;
  };
  Tickets: undefined;
  Favorites: undefined;
  TicketDetail: {
    ticketId: number;
  };
  CreateTicket: undefined;
};

// Augment React Navigation's global types so hooks like `useNavigation()` and
// `useRoute()` are automatically typed with `RootStackParamList` without
// having to pass generics everywhere.
//
// Usage after this change:
//   const navigation = useNavigation(); // navigation is typed for RootStackParamList
//   const route = useRoute(); // route.params is typed per the current route in RootStackParamList
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
