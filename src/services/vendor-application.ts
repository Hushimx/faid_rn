import { axiosInstance } from 'config';
import { ISubmitVendorApplicationPayload, IVendorApplication } from 'types';

const VendorApplicationApis = {
  submitApplication: (data: ISubmitVendorApplicationPayload) => {
    const formData = new FormData();

    if (data.country_id) {
      formData.append('country_id', data.country_id.toString());
    }
    if (data.city_id) {
      formData.append('city_id', data.city_id.toString());
    }
    if (data.lat !== undefined) {
      formData.append('lat', data.lat.toString());
    }
    if (data.lng !== undefined) {
      formData.append('lng', data.lng.toString());
    }
    if (data.banner) {
      formData.append('banner', {
        uri: data.banner.uri,
        type: data.banner.type || 'image/jpeg',
        name: data.banner.fileName || 'banner.jpg',
      });
    }
    if (data.bio) {
      formData.append('bio', data.bio);
    }
    if (data.category_id !== undefined && data.category_id !== null) {
      formData.append('category_id', data.category_id.toString());
    }
    if (data.custom_category) {
      formData.append('custom_category', data.custom_category);
    }
    if (data.meta) {
      formData.append('meta', JSON.stringify(data.meta));
    }

    return axiosInstance.post<{ data: IVendorApplication }>(
      'vendor-applications',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  },
  getMyApplication: () =>
    axiosInstance.get<{ data: IVendorApplication }>(
      'vendor-applications/my-application',
    ),
};

export default VendorApplicationApis;

