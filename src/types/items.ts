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
  title: string | { ar: string; en: string };
  userName: string;
  price: number | null;
  index: number;
  vendorId: number;
  imageUrl: string | undefined;
  reviewCount: number;
  rating: number;
  vendorImageUrl: string | undefined;
  style?: StyleProp<ViewStyle>;
  city: string | { ar: string; en: string } | null;
  onDelete?: (serviceId: number) => void;
}

export interface ICommentItem {
  userName: string;
  userImage: string;
  comment: string;
  createdAt: string;
  rating: number;
}
