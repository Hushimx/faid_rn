import { FC } from 'react';
import { FlatList, FlatListProps } from 'react-native';
import { CategoryItem } from 'components';
import { SPACING } from 'common';

interface IProps<ItemT = any> extends FlatListProps<ItemT> {}

const AppList: FC<IProps<any>> = ({ data, renderItem, ...props }) => {
  return (
    <FlatList
      data={data ?? [1, 2, 3, 4]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap: SPACING.gap }}
      renderItem={renderItem ?? (() => <CategoryItem />)}
      {...props}
    />
  );
};

export default AppList;
