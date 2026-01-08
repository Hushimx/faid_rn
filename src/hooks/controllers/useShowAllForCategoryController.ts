import { RouteProp, useRoute } from '@react-navigation/native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useDebounce, useMemoizedData } from 'hooks';
import { useMemo, useRef, useState } from 'react';
import { ServicesApis } from 'services';
import {
  ICategory,
  ICityResponse,
  IModalRef,
  IServiceResponse,
  QUERIES_KEY_ENUM,
  RootStackParamList,
} from 'types';
import { SortOption } from 'components';
import { dataExtractor, metaExtractor } from 'utils';

type ShowAllForCategoryRouteProp = RouteProp<
  RootStackParamList,
  'ShowAllForCategory'
>;

export const useShowAllForCategoryController = () => {
  const route = useRoute<ShowAllForCategoryRouteProp>();
  const { categoryId, categoryName } = route.params || {};

  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState<ICityResponse | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null,
  );
  const [priceRange, setPriceRange] = useState<{
    min: number;
    max: number;
  } | null>(null);
  const [selectedSort, setSelectedSort] = useState<SortOption | null>('latest');

  const categoriesModalRef = useRef<IModalRef>(null);
  const priceFilterModalRef = useRef<IModalRef>(null);
  const citiesModalRef = useRef<IModalRef>(null);
  const sortModalRef = useRef<IModalRef>(null);

  const debounceValue = useDebounce(search);

  const activeCategoryId = selectedCategory?.id || categoryId;

  const {
    data,
    isError,
    refetch,
    error,
    isPending,
    isRefetching,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryFn: ({ pageParam = 1 }) =>
      ServicesApis.getServices({
        categoryId: activeCategoryId,
        currentPage: pageParam,
        search: debounceValue,
        cityId: selectedCity?.id,
        minPrice: priceRange?.min && priceRange.min > 0 ? priceRange.min : undefined,
        maxPrice: priceRange?.max && priceRange.max > 0 ? priceRange.max : undefined,
        sort: selectedSort || 'latest',
      }),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      const meta = metaExtractor(lastPage);
      return meta?.has_more ? (meta?.current_page || 0) + 1 : undefined;
    },
    queryKey: [
      QUERIES_KEY_ENUM.show_all_service_list,
      activeCategoryId,
      debounceValue,
      selectedCity?.id,
      priceRange,
      selectedSort,
    ],
  });

  const allData = useMemoizedData<IServiceResponse[]>(data);

  const onSelectCategory = (category: ICategory | null) => {
    setSelectedCategory(category);
  };

  const onApplyPriceRange = (min: number, max: number) => {
    // Check if both values are valid numbers and not both 0 (which means reset)
    if (min === 0 && max === 0) {
      setPriceRange(null);
    } else if (!isNaN(min) && !isNaN(max) && min >= 0 && max >= 0 && max >= min) {
      setPriceRange({ min, max });
    }
  };

  const openCategoriesModal = () => {
    categoriesModalRef.current?.openModal();
  };

  const openPriceFilterModal = () => {
    priceFilterModalRef.current?.openModal();
  };

  const openCitiesModal = () => {
    citiesModalRef.current?.openModal();
  };

  const openSortModal = () => {
    sortModalRef.current?.openModal();
  };

  const onCategorySelect = (category: ICategory | null) => {
    setSelectedCategory(category);
    categoriesModalRef.current?.closeModal();
  };

  return {
    search,
    setSearch,
    selectedCity,
    setSelectedCity,
    selectedCategory,
    setSelectedCategory: onSelectCategory,
    priceRange,
    setPriceRange, // Exposed if needed, but onApplyPriceRange is better
    onApplyPriceRange,
    selectedSort,
    setSelectedSort,
    categoriesModalRef,
    priceFilterModalRef,
    citiesModalRef,
    sortModalRef,
    openCategoriesModal,
    openPriceFilterModal,
    openCitiesModal,
    openSortModal,
    allData,
    isError,
    error,
    isLoading: isPending,
    isRefetching,
    isFetching,
    isFetchingNextPage,
    refetch,
    fetchNextPage,
    hasNextPage,
    categoryName,
    onCategorySelect,
  };
};
