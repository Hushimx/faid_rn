import { StyleProp, ViewStyle } from 'react-native';

export interface IServiceItem {
  name: string;
  imageUrl: string | null;
  categoryId: number;
  categoryName: string;
}

export interface ICategoryItem {
  showComments?: boolean;
  serviceId: number;
  title: string;
  userName: string;
  price: number;
  index: number;
  vendorId: number;
  imageUrl: string;
  reviewCount: number;
  rating: number;
  vendorImageUrl: string;
  style?: StyleProp<ViewStyle>;
  city: string;
}

export interface ICommentItem {
  userName: string;
  userImage: string;
  comment: string;
  createdAt: string;
  rating: number;
}
