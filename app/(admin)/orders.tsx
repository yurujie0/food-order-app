import React, { useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, SegmentedButtons } from 'react-native-paper';
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
  { value: 'cancelled', label: '已取消' },
];

export default function AdminOrdersScreen() {
  const { orders, isLoading, refreshOrders, updateOrderStatus } = useOrders();
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    await updateOrderStatus(orderId, status);
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <OrderCard
      order={item}
      isAdmin={true}
      onUpdateStatus={(status) => handleUpdateStatus(item.id, status)}
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

      {/* 统计信息 */}
      <View style={styles.statsBar}>
        <Text variant="bodySmall" style={styles.statsText}>
          共 {filteredOrders.length} 个订单
        </Text>
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
  statsBar: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statsText: {
    color: Colors.textLight,
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
