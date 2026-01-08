export interface IUser {
  id: number;
  name: string;
  email: string;
  type: string;
  status: string | null;
  phone: string | null;
  address: string | null;
  profile_picture: null | string;
  email_verified_at: null;
  created_at: string | null;
  updated_at: string | null;
  first_name: string | null;
  last_name: string | null;
}

export enum OTP_TYPE_ENUM {
  verification = 'verification',
  password_reset = 'password_reset',
}

export enum USER_TYPE_ENUM {
  user = 'user',
  vendor = 'vendor',
}

export interface IAuthStore {
  user: IUser | null;
  setUser: (value: IUser) => unknown;
  access_token: string | null;
  setAccessToken: (access_token: string | null) => unknown;
  isOnBoarded: boolean;
  setIsOnBoarded: (value: boolean) => unknown;
  isStoreReady: boolean;
  setIsStoreReady: (value: boolean) => unknown;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  logout: () => void;
  deleteAccount: () => Promise<void>;
}
