import { axiosInstance } from 'config';
import { ISubmitVendorApplicationPayload, IVendorApplication } from 'types';

const VendorApplicationApis = {
  submitApplication: (data: ISubmitVendorApplicationPayload) => {
    const formData = new FormData();

    // Append required fields (should always be present due to validation)
    formData.append('business_name', data.business_name || '');
    formData.append('city', data.city || '');
    formData.append('bio', data.bio || '');

    // Handle category - either category_id (number) or custom_category (string)
    // Only append category_id if it's a valid number (not 'others', undefined, or null)
    if (data.category_id !== undefined && data.category_id !== null && typeof data.category_id === 'number') {
      formData.append('category_id', data.category_id.toString());
    }
    
    // Append custom_category if provided (when 'others' is selected)
    if (data.custom_category && data.custom_category.trim()) {
      formData.append('custom_category', data.custom_category.trim());
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

