import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
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
  // 动画值
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const opacityAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Animated.View style={[styles.animatedContainer, { transform: [{ scale: scaleAnim }] }]}>
      <Card
        style={styles.card}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.container}>
          {/* 图片区域 - 带渐变遮罩 */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: dish.image }} style={styles.image} />
            <View style={styles.imageOverlay}>
              <Text style={styles.priceOverlay}>¥{dish.price}</Text>
            </View>
            {/* 分类标签 */}
            <View style={[styles.categoryBadge, { backgroundColor: Colors.category[dish.category] }]}>
              <Text style={styles.categoryBadgeText}>
                {CategoryLabels[dish.category]}
              </Text>
            </View>
          </View>

          {/* 内容区域 */}
          <View style={styles.content}>
            <View style={styles.header}>
              <Text variant="titleMedium" style={styles.name}>{dish.name}</Text>
            </View>

            <Text variant="bodySmall" style={styles.description} numberOfLines={2}>
              {dish.description}
            </Text>

            <View style={styles.footer}>
              <View style={styles.priceContainer}>
                <Text variant="titleLarge" style={styles.price}>
                  ¥{dish.price}
                </Text>
                {dish.originalPrice && dish.originalPrice > dish.price && (
                  <Text style={styles.originalPrice}>¥{dish.originalPrice}</Text>
                )}
              </View>

              {showActions && (
                <TouchableOpacity
                  style={[
                    styles.addButton,
                    !dish.isAvailable && styles.addButtonDisabled,
                  ]}
                  onPress={onAddToCart}
                  disabled={!dish.isAvailable}
                  activeOpacity={0.8}
                >
                  <Text style={styles.addButtonText}>
                    {dish.isAvailable ? '+' : '售罄'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  animatedContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  card: {
    borderRadius: 20,
    backgroundColor: Colors.card,
    elevation: 0,
    shadowColor: Colors.shadow.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    overflow: 'hidden',
  },
  container: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
  imageContainer: {
    width: 140,
    height: 140,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceOverlay: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.primary,
  },
  categoryBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: 6,
  },
  name: {
    fontWeight: '700',
    fontSize: 17,
    color: Colors.text,
    lineHeight: 22,
  },
  description: {
    color: Colors.textLight,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  price: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 20,
  },
  originalPrice: {
    color: Colors.textMuted,
    fontSize: 14,
    textDecorationLine: 'line-through',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.shadow.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  addButtonDisabled: {
    backgroundColor: Colors.textMuted,
    shadowOpacity: 0,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 28,
  },
});
