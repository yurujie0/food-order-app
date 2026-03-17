import React, { useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, ScrollView } from 'react-native';
import { Searchbar, Chip, Text, FAB, Portal, Snackbar } from 'react-native-paper';
import { useDishes } from '../../hooks/useDishes';
import { useCart } from '../../hooks/useCart';
import { DishCard } from '../../components/DishCard';
import { Dish, CategoryLabels, DishCategory } from '../../types';
import { Colors } from '../../constants/Colors';

const categories: { key: DishCategory | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'hot', label: CategoryLabels.hot },
  { key: 'cold', label: CategoryLabels.cold },
  { key: 'soup', label: CategoryLabels.soup },
  { key: 'staple', label: CategoryLabels.staple },
  { key: 'drink', label: CategoryLabels.drink },
  { key: 'dessert', label: CategoryLabels.dessert },
];

export default function HomeScreen() {
  const {
    filteredDishes,
    isLoading,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    refreshDishes,
  } = useDishes();

  const { addToCart, totalCount } = useCart();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [addedDish, setAddedDish] = useState('');

  const handleAddToCart = async (dish: Dish) => {
    await addToCart(dish, 1);
    setAddedDish(dish.name);
    setSnackbarVisible(true);
  };

  const renderDish = ({ item }: { item: Dish }) => (
    <DishCard
      dish={item}
      onAddToCart={() => handleAddToCart(item)}
    />
  );

  return (
    <View style={styles.container}>
      {/* 搜索栏 */}
      <Searchbar
        placeholder="搜索菜品..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      {/* 分类筛选 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map((cat) => (
          <Chip
            key={cat.key}
            selected={selectedCategory === cat.key}
            onPress={() => setSelectedCategory(cat.key)}
            style={styles.categoryChip}
            selectedColor={Colors.primary}
          >
            {cat.label}
          </Chip>
        ))}
      </ScrollView>

      {/* 菜品列表 */}
      <FlatList
        data={filteredDishes}
        renderItem={renderDish}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refreshDishes} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge" style={styles.emptyText}>
              暂无菜品
            </Text>
          </View>
        }
      />

      {/* 购物车 FAB */}
      {totalCount > 0 && (
        <FAB
          icon="cart"
          label={`购物车 (${totalCount})`}
          onPress={() => {}}
          style={styles.fab}
          color={Colors.card}
        />
      )}

      {/* 提示 */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
        style={styles.snackbar}
      >
        已添加 {addedDish} 到购物车
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchBar: {
    margin: 16,
    marginBottom: 8,
    elevation: 2,
  },
  categoryContainer: {
    maxHeight: 60,
    marginBottom: 8,
  },
  categoryContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    marginRight: 8,
  },
  listContent: {
    paddingBottom: 80,
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primary,
  },
  snackbar: {
    backgroundColor: Colors.success,
  },
});
