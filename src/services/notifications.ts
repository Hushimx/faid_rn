import { axiosInstance } from 'config';
import { IGetNotificationsPayload, INotification } from 'types';

const NotificationsApis = {
  getNotifications: ({
    currentPage = 1,
    per_page = 20,
  }: IGetNotificationsPayload = {}) => {
    const params = new URLSearchParams({
      per_page: per_page.toString(),
      page: currentPage.toString(),
    });
    return axiosInstance.get(`notifications?${params.toString()}`);
  },

  markAsRead: (notificationId: string) => {
    return axiosInstance.post(`notifications/${notificationId}/read`);
  },

  markAllAsRead: () => {
    return axiosInstance.post('notifications/read-all');
  },
};

export default NotificationsApis;
