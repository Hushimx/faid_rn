import { axiosInstance } from 'config';
import {
  IAddServiceReviewPayload,
  IGetRelatedServicesPayload,
  IGetServicePayload,
  IGetServicesForCategoryPayload,
  IGetVendorServicesPayload,
  IServiceReviewsPayload,
} from 'types';

const ServicesApis = {
  getServices: ({
    categoryId,
    currentPage = 1,
    search = '',
    cityId,
    minPrice,
    maxPrice,
    sort = 'latest',
  }: IGetServicesForCategoryPayload) => {
    const params = new URLSearchParams({
      per_page: '20',
      page: currentPage.toString(),
      include_media: 'true',
      sort: sort,
    });
    if (categoryId) params.append('category_id', categoryId.toString());

    if (cityId) params.append('city_id', cityId.toString());

    if (search) params.append('search', search);

    if (minPrice) params.append('price_min', minPrice.toString());

    if (maxPrice) params.append('price_max', maxPrice.toString());

    return axiosInstance.get(`services?${params.toString()}`);
  },
  getVendorServices: ({
    vendorId,
    currentPage = 1,
    search = '',
  }: IGetVendorServicesPayload) =>
    axiosInstance.get(
      `services?vendor_id=${vendorId}&per_page=10&page=${currentPage}&search=${search}&include_media=true`,
    ),
  getService: ({ serviceId }: IGetServicePayload) =>
    axiosInstance.get(`services/${serviceId}?include_media=true&include_faqs=true`),
  getRelatedServices: ({ serviceId }: IGetRelatedServicesPayload) =>
    axiosInstance.get(`services/${serviceId}/related`),
  getReviews: ({
    serviceId,
    page = 1,
    per_page = 10,
  }: IServiceReviewsPayload) =>
    axiosInstance.get(
      `services/${serviceId}/reviews?page=${page}&per_page=${per_page}`,
    ),
  addReview: ({ serviceId, rating, comment }: IAddServiceReviewPayload) =>
    axiosInstance.post(`services/${serviceId}/reviews`, { rating, comment }),
  addService: (formData: FormData) => {
    return axiosInstance.post('services', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  updateService: (serviceId: number, formData: FormData) => {
    return axiosInstance.post(`services/${serviceId}/update`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteService: (serviceId: number) => {
    return axiosInstance.delete(`services/${serviceId}`);
  },
};

export default ServicesApis;
