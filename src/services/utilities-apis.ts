import { axiosInstance } from 'config';

const UtilitiesApis = {
  getCities: (search: string = '') =>
    axiosInstance.get(`cities${search ? `?search=${search}` : ''}`),
};

export default UtilitiesApis;
