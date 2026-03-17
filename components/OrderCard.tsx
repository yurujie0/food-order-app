import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Chip, Button, Divider } from 'react-native-paper';
import { Order, OrderStatus, OrderStatusLabels } from '../types';
import { Colors } from '../constants/Colors';

interface OrderCardProps {
  order: Order;
  isAdmin?: boolean;
  onPress?: () => void;
  onUpdateStatus?: (status: OrderStatus) => void;
  onCancel?: () => void;
}

export function OrderCard({ 
  order, 
  isAdmin = false, 
  onPress, 
  onUpdateStatus,
  onCancel 
}: OrderCardProps) {
  const getStatusColor = (status: OrderStatus) => {
    return Colors.orderStatus[status];
  };

  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    const flow: OrderStatus[] = ['pending', 'preparing', 'ready', 'completed'];
    const index = flow.indexOf(current);
    if (index >= 0 && index < flow.length - 1) {
      return flow[index + 1];
    }
    return null;
  };

  const nextStatus = getNextStatus(order.status);

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        {/* 订单头部 */}
        <View style={styles.header}>
          <View>
            <Text variant="titleMedium" style={styles.orderId}>
              订单 #{order.id.slice(-8).toUpperCase()}
            </Text>
            <Text variant="bodySmall" style={styles.date}>
              {new Date(order.createdAt).toLocaleString('zh-CN')}
            </Text>
          </View>
          <Chip 
            style={[styles.statusChip, { backgroundColor: getStatusColor(order.status) + '20' }]}
            textStyle={{ color: getStatusColor(order.status) }}
          >
            {OrderStatusLabels[order.status]}
          </Chip>
        </View>

        <Divider style={styles.divider} />

        {/* 订单项 */}
        <View style={styles.items}>
          {order.items.map((item, index) => (
            <View key={index} style={styles.item}>
              <Text variant="bodyMedium" style={styles.itemName}>
                {item.dishName}
              </Text>
              <Text variant="bodyMedium" style={styles.itemQuantity}>
                x{item.quantity}
              </Text>
              <Text variant="bodyMedium" style={styles.itemPrice}>
                ¥{item.price * item.quantity}
              </Text>
            </View>
          ))}
        </View>

        {/* 备注 */}
        {order.note && (
          <View style={styles.noteContainer}>
            <Text variant="bodySmall" style={styles.noteLabel}>备注:</Text>
            <Text variant="bodySmall" style={styles.note}>{order.note}</Text>
          </View>
        )}

        <Divider style={styles.divider} />

        {/* 订单底部 */}
        <View style={styles.footer}>
          <Text variant="bodyMedium">共 {order.items.reduce((sum, i) => sum + i.quantity, 0)} 件商品</Text>
          <View style={styles.total}>
            <Text variant="bodyMedium">合计:</Text>
            <Text variant="titleLarge" style={styles.totalPrice}>
              ¥{order.totalAmount}
            </Text>
          </View>
        </View>

        {/* 操作按钮 */}
        <View style={styles.actions}>
          {isAdmin && nextStatus && (
            <Button
              mode="contained"
              onPress={() => onUpdateStatus?.(nextStatus)}
              style={styles.actionButton}
            >
              更新为: {OrderStatusLabels[nextStatus]}
            </Button>
          )}
          
          {!isAdmin && order.status === 'pending' && (
            <Button
              mode="outlined"
              onPress={onCancel}
              style={styles.actionButton}
              textColor={Colors.error}
            >
              取消订单
            </Button>
          )}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderId: {
    fontWeight: '600',
  },
  date: {
    color: Colors.textLight,
    marginTop: 2,
  },
  statusChip: {
    height: 28,
  },
  divider: {
    marginVertical: 12,
  },
  items: {
    gap: 8,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    flex: 1,
  },
  itemQuantity: {
    width: 50,
    textAlign: 'center',
    color: Colors.textLight,
  },
  itemPrice: {
    width: 80,
    textAlign: 'right',
  },
  noteContainer: {
    flexDirection: 'row',
    marginTop: 12,
    backgroundColor: Colors.background,
    padding: 8,
    borderRadius: 8,
  },
  noteLabel: {
    color: Colors.textLight,
    marginRight: 8,
  },
  note: {
    flex: 1,
    color: Colors.text,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  total: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  totalPrice: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    borderRadius: 8,
  },
});
