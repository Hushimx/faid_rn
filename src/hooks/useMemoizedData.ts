import { InfiniteData } from '@tanstack/react-query';
import { useMemo } from 'react';
import { dataExtractor } from 'utils';

const useMemoizedData = <T>(
  data: InfiniteData<any> | undefined,
  callback?: (page: any) => T,
): T[] => {
  return useMemo(
    () =>
      data?.pages.flatMap(page =>
        callback ? callback(page) || [] : dataExtractor<T[]>(page) || [],
      ) || [],
    [data],
  );
};

export default useMemoizedData;
