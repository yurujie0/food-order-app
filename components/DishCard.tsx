import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Card, Text, Button, Chip } from 'react-native-paper';
import { Dish, CategoryLabels } from '../types';
import { Colors } from '../constants/Colors';

interface DishCardProps {
  dish: Dish;
  onPress?: () => void;
  onAddToCart?: () => void;
  showActions?: boolean;
}

export function DishCard({ dish, onPress, onAddToCart, showActions = true }: DishCardProps) {
  return (
    <Card style={styles.card} onPress={onPress}>
      <View style={styles.container}>
        <Image source={{ uri: dish.image }} style={styles.image} />
        <View style={styles.content}>
          <View style={styles.header}>
            <Text variant="titleMedium" style={styles.name}>{dish.name}</Text>
            <Chip style={[styles.categoryChip, { backgroundColor: Colors.category[dish.category] + '20' }]}>
              <Text style={{ color: Colors.category[dish.category], fontSize: 12 }}>
                {CategoryLabels[dish.category]}
              </Text>
            </Chip>
          </View>
          
          <Text variant="bodySmall" style={styles.description} numberOfLines={2}>
            {dish.description}
          </Text>
          
          <View style={styles.footer}>
            <Text variant="titleLarge" style={styles.price}>
              ¥{dish.price}
            </Text>
            
            {showActions && (
              <Button
                mode="contained"
                onPress={onAddToCart}
                disabled={!dish.isAvailable}
                style={styles.addButton}
                compact
              >
                {dish.isAvailable ? '加入购物车' : '已售罄'}
              </Button>
            )}
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
  },
  container: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
  image: {
    width: 120,
    height: 120,
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
    marginBottom: 4,
  },
  name: {
    flex: 1,
    fontWeight: 'bold',
  },
  categoryChip: {
    height: 24,
  },
  description: {
    color: Colors.textLight,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  addButton: {
    borderRadius: 8,
  },
});
