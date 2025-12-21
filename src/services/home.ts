import { axiosInstance } from 'config';
import { IGetCategoriesPayload } from 'types';

const HomeApis = {
  getCategories: ({
    currentPage = 1,
    search = '',
    cityId,
  }: IGetCategoriesPayload = {}) => {
    const params = new URLSearchParams({
      per_page: '10',
      page: currentPage.toString(),
      search,
    });
    if (cityId) {
      params.append('city_id', cityId.toString());
    }
    return axiosInstance.get(`categories?${params.toString()}`);
  },
  getOffers: () => {
    return axiosInstance.get('offers');
  },
};
export default HomeApis;
