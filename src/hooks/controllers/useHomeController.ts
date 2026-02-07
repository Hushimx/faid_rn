import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { HomeApis } from 'services';
import { IBanner, ICategory, ICityResponse, QUERIES_KEY_ENUM } from 'types';
import { dataExtractor, metaExtractor } from 'utils';

const useHomeController = () => {
  const [selectedCity, setSelectedCity] = useState<ICityResponse | null>(null);

  const {
    data: categories,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryFn: () => HomeApis.getCategories({ cityId: selectedCity?.id }),
    queryKey: [QUERIES_KEY_ENUM.categories, selectedCity?.id],
  });

  const { data: bannersData, isLoading: bannersLoading } = useQuery({
    queryFn: () => HomeApis.getBanners(),
    queryKey: [QUERIES_KEY_ENUM.banners],
  });

  return {
    categories: dataExtractor(categories) as ICategory[],
    isLoading: isPending,
    errorMessage: error?.message,
    refetch: refetch,
    total: metaExtractor(categories)?.total,
    selectedCity,
    setSelectedCity,
    banners: (dataExtractor(bannersData) as IBanner[]) || [],
    bannersLoading,
  };
};

export default useHomeController;
