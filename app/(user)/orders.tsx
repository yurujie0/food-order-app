import React from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, SegmentedButtons } from 'react-native-paper';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useOrders } from '../../hooks/useOrders';
import { OrderCard } from '../../components/OrderCard';
import { Order, OrderStatus } from '../../types';
import { Colors } from '../../constants/Colors';

type FilterType = 'all' | OrderStatus;

const filters: { value: FilterType; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待处理' },
  { value: 'preparing', label: '制作中' },
  { value: 'ready', label: '待取餐' },
  { value: 'completed', label: '已完成' },
];

export default function OrdersScreen() {
  const { user } = useAuth();
  const { orders, isLoading, refreshOrders, cancelOrder } = useOrders(user?.id);
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const handleCancelOrder = async (orderId: string) => {
    await cancelOrder(orderId);
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <OrderCard
      order={item}
      onCancel={() => handleCancelOrder(item.id)}
    />
  );

  return (
    <View style={styles.container}>
      {/* 筛选 */}
      <View style={styles.filterContainer}>
        <SegmentedButtons
          value={filter}
          onValueChange={(value) => setFilter(value as FilterType)}
          buttons={filters}
          style={styles.filterButtons}
        />
      </View>

      {/* 订单列表 */}
      <FlatList
        data={filteredOrders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refreshOrders} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge" style={styles.emptyText}>
              暂无订单
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  filterContainer: {
    padding: 16,
    backgroundColor: Colors.card,
  },
  filterButtons: {
    flexWrap: 'wrap',
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    color: Colors.textLight,
  },
});
