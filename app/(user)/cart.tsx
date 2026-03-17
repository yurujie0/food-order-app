import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Button, Divider, Snackbar, Portal } from 'react-native-paper';

import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../contexts/AuthContext';
import { useOrders } from '../../hooks/useOrders';
import { CartItem } from '../../components/CartItem';
import { CartItem as CartItemType } from '../../types';
import { Colors } from '../../constants/Colors';

export default function CartScreen({ navigation }: any) {
  const { cart, isLoading, totalAmount, totalCount, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrders(user?.id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleIncrease = async (dishId: string) => {
    const item = cart.find(i => i.dish.id === dishId);
    if (item) {
      await updateQuantity(dishId, item.quantity + 1);
    }
  };

  const handleDecrease = async (dishId: string) => {
    const item = cart.find(i => i.dish.id === dishId);
    if (item && item.quantity > 1) {
      await updateQuantity(dishId, item.quantity - 1);
    } else {
      handleRemove(dishId);
    }
  };

  const handleRemove = async (dishId: string) => {
    Alert.alert(
      '确认移除',
      '确定要从购物车移除该商品吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '移除',
          style: 'destructive',
          onPress: async () => {
            await removeFromCart(dishId);
            setSnackbarMessage('已移除商品');
            setSnackbarVisible(true);
          },
        },
      ]
    );
  };

  const handleCheckout = async () => {
    if (!user) return;

    Alert.alert(
      '确认下单',
      `共 ${totalCount} 件商品，总计 ¥${totalAmount.toFixed(2)}`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确认下单',
          onPress: async () => {
            setIsSubmitting(true);
            try {
              await createOrder({
                items: cart.map(item => ({
                  dishId: item.dish.id,
                  quantity: item.quantity,
                })),
              });
              
              await clearCart();
              setSnackbarMessage('下单成功！');
              setSnackbarVisible(true);
              
              // 2秒后跳转到订单页面
              setTimeout(() => {
                navigation.navigate('User', { screen: 'OrdersTab' });
              }, 1500);
            } catch (error: any) {
              setSnackbarMessage(error.message || '下单失败');
              setSnackbarVisible(true);
            } finally {
              setIsSubmitting(false);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: CartItemType }) => (
    <CartItem
      item={item}
      onIncrease={() => handleIncrease(item.dish.id)}
      onDecrease={() => handleDecrease(item.dish.id)}
      onRemove={() => handleRemove(item.dish.id)}
    />
  );

  if (cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="headlineMedium" style={styles.emptyTitle}>
          购物车是空的
        </Text>
        <Text variant="bodyMedium" style={styles.emptyText}>
          快去选购美味吧！
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('User', { screen: 'HomeTab' })}
          style={styles.emptyButton}
        >
          去点餐
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        renderItem={renderItem}
        keyExtractor={(item) => item.dish.id}
        contentContainerStyle={styles.listContent}
      />

      {/* 底部结算栏 */}
      <View style={styles.footer}>
        <Divider />
        <View style={styles.footerContent}>
          <View style={styles.totalSection}>
            <Text variant="bodyMedium">
              共 {totalCount} 件
            </Text>
            <View style={styles.totalRow}>
              <Text variant="bodyLarge">合计:</Text>
              <Text variant="headlineSmall" style={styles.totalPrice}>
                ¥{totalAmount.toFixed(2)}
              </Text>
            </View>
          </View>
          <Button
            mode="contained"
            onPress={handleCheckout}
            loading={isSubmitting}
            disabled={isSubmitting || cart.length === 0}
            style={styles.checkoutButton}
            contentStyle={styles.checkoutButtonContent}
          >
            去结算
          </Button>
        </View>
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingBottom: 120,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    marginBottom: 8,
    color: Colors.textLight,
  },
  emptyText: {
    color: Colors.textMuted,
    marginBottom: 24,
  },
  emptyButton: {
    borderRadius: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.card,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 32,
  },
  totalSection: {
    flex: 1,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  totalPrice: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  checkoutButton: {
    borderRadius: 8,
    marginLeft: 16,
  },
  checkoutButtonContent: {
    height: 48,
    paddingHorizontal: 24,
  },
  snackbar: {
    backgroundColor: Colors.success,
  },
});
