import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, IconButton, Surface } from 'react-native-paper';
import { CartItem as CartItemType } from '../types';
import { Colors } from '../constants/Colors';

interface CartItemProps {
  item: CartItemType;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export function CartItem({ item, onIncrease, onDecrease, onRemove }: CartItemProps) {
  const { dish, quantity } = item;
  const subtotal = dish.price * quantity;

  return (
    <Surface style={styles.container} elevation={1}>
      <Image source={{ uri: dish.image }} style={styles.image} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text variant="titleMedium" style={styles.name}>{dish.name}</Text>
          <IconButton
            icon="delete-outline"
            size={20}
            onPress={onRemove}
            iconColor={Colors.error}
          />
        </View>
        
        <Text variant="bodySmall" style={styles.price}>
          ¥{dish.price}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.quantityControl}>
            <IconButton
              icon="minus"
              size={16}
              onPress={onDecrease}
              style={styles.quantityButton}
            />
            <Text variant="titleMedium" style={styles.quantity}>
              {quantity}
            </Text>
            <IconButton
              icon="plus"
              size={16}
              onPress={onIncrease}
              style={styles.quantityButton}
            />
          </View>
          
          <Text variant="titleMedium" style={styles.subtotal}>
            ¥{subtotal}
          </Text>
        </View>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.card,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    flex: 1,
    fontWeight: '600',
  },
  price: {
    color: Colors.textLight,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 8,
  },
  quantityButton: {
    margin: 0,
  },
  quantity: {
    minWidth: 32,
    textAlign: 'center',
    fontWeight: '600',
  },
  subtotal: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
});
