import React, { useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, ScrollView } from 'react-native';
import { Text, Chip } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { useOrders } from '../../hooks/useOrders';
import { OrderCard } from '../../components/OrderCard';
import { Order, OrderStatus } from '../../types';
import { Colors } from '../../constants/Colors';

type FilterType = 'all' | OrderStatus;

const filters: { value: FilterType; label: string; color: string }[] = [
  { value: 'all', label: '全部', color: Colors.primary },
  { value: 'pending', label: '待处理', color: Colors.orderStatus.pending },
  { value: 'preparing', label: '制作中', color: Colors.orderStatus.preparing },
  { value: 'ready', label: '待取餐', color: Colors.orderStatus.ready },
  { value: 'completed', label: '已完成', color: Colors.orderStatus.completed },
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
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {filters.map((f) => (
            <Chip
              key={f.value}
              selected={filter === f.value}
              onPress={() => setFilter(f.value)}
              style={[
                styles.filterChip,
                filter === f.value && { backgroundColor: f.color },
              ]}
              textStyle={[
                styles.filterChipText,
                filter === f.value && styles.filterChipTextSelected,
              ]}
            >
              {f.label}
            </Chip>
          ))}
        </ScrollView>
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
    paddingVertical: 12,
    backgroundColor: Colors.card,
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  filterChip: {
    backgroundColor: Colors.background,
    borderRadius: 20,
  },
  filterChipText: {
    color: Colors.text,
    fontSize: 13,
  },
  filterChipTextSelected: {
    color: '#FFF',
    fontWeight: '600',
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
