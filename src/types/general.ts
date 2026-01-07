import { IVendor } from './apis';

export interface IService {
  categories: ICategory[];
  isLoading: boolean;
  errorMessage?: string;
  refetch: () => void;
  displayIsShowAll: boolean;
}

export interface ICategory {
  id: number;
  name: string;
  description: string;
  image_url: string | null;
}

export interface IResponseMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
  has_more: boolean;
  prev_page_url: null;
  next_page_url: null;
}

export enum PRICE_TYPE_ENUM {
  fixed = 'fixed',
  negotiable = 'negotiable',
  unspecified = 'unspecified',
}

export interface IServiceProviderInfo {
  serviceProviderName: string;
  serviceProviderImage: string;
}

export enum LANGUAGES_ENUM {
  ar = 'ar',
  en = 'en',
}

export interface IContactOptions {
  vendor: IVendor;
  serviceId: number;
}

export enum SERVICE_STATUS_ENUM {
  active = 'active',
  draft = 'draft',
  pending = 'pending',
}
