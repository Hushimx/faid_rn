import { axiosInstance } from 'config';
import {
  ILoginPayload,
  ILogoutPayload,
  IResetPasswordPayload,
  ISendOtpPayload,
  ISignUpPayload,
  IVerifyOtpPayload,
} from 'types';

export const AuthApis = {
  signup: async (data: ISignUpPayload) =>
    await axiosInstance.post('register', data),
  login: async (data: ILoginPayload) => await axiosInstance.post('login', data),
  sendOtp: async (data: ISendOtpPayload) =>
    await axiosInstance.post('send-otp', data),
  verifyOtp: (data: IVerifyOtpPayload) =>
    axiosInstance.post('verify-otp', data),
  resetPassword: (data: IResetPasswordPayload) =>
    axiosInstance.post('reset-password', data),
  logout: (data: ILogoutPayload) => axiosInstance.post('logout', data),
};
