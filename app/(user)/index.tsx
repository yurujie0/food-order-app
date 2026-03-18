import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { Searchbar, Chip, Text, FAB, Snackbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDishes } from '../../hooks/useDishes';
import { useCart } from '../../hooks/useCart';
import { DishCard } from '../../components/DishCard';
import { Dish, CategoryLabels, DishCategory } from '../../types';
import { Colors } from '../../constants/Colors';

const categories: { key: DishCategory | 'all'; label: string; icon: string }[] = [
  { key: 'all', label: '全部', icon: 'food-variant' },
  { key: 'hot', label: CategoryLabels.hot, icon: 'fire' },
  { key: 'cold', label: CategoryLabels.cold, icon: 'snowflake' },
  { key: 'soup', label: CategoryLabels.soup, icon: 'bowl-mix' },
  { key: 'staple', label: CategoryLabels.staple, icon: 'rice' },
  { key: 'drink', label: CategoryLabels.drink, icon: 'glass-cocktail' },
  { key: 'dessert', label: CategoryLabels.dessert, icon: 'cake' },
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
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="搜索美味..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          iconColor={Colors.primary}
          placeholderTextColor={Colors.textMuted}
        />
      </View>

      {/* 分类筛选 */}
      <View style={styles.categoryWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContent}
        >
          {categories.map((cat) => (
            <Chip
              key={cat.key}
              selected={selectedCategory === cat.key}
              onPress={() => setSelectedCategory(cat.key)}
              style={[
                styles.categoryChip,
                selectedCategory === cat.key && styles.categoryChipSelected,
              ]}
              textStyle={[
                styles.categoryChipText,
                selectedCategory === cat.key && styles.categoryChipTextSelected,
              ]}
              icon={() => (
                <MaterialCommunityIcons
                  name={cat.icon as any}
                  size={16}
                  color={selectedCategory === cat.key ? '#FFF' : Colors.textLight}
                />
              )}
            >
              {cat.label}
            </Chip>
          ))}
        </ScrollView>
      </View>

      {/* 菜品列表 */}
      <FlatList
        data={filteredDishes}
        renderItem={renderDish}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshDishes}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
            progressBackgroundColor={Colors.card}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="food-off"
              size={80}
              color={Colors.textMuted}
            />
            <Text variant="bodyLarge" style={styles.emptyText}>
              暂无菜品
            </Text>
            <Text variant="bodySmall" style={styles.emptySubtext}>
              换个分类试试看
            </Text>
          </View>
        }
      />

      {/* 购物车 FAB */}
      {totalCount > 0 && (
        <FAB
          icon="cart"
          label={`${totalCount}`}
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
        <View style={styles.snackbarContent}>
          <MaterialCommunityIcons name="check-circle" size={20} color="#FFF" />
          <Text style={styles.snackbarText}>已添加 {addedDish}</Text>
        </View>
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  searchBar: {
    borderRadius: 16,
    backgroundColor: Colors.card,
    elevation: 2,
    shadowColor: Colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  searchInput: {
    fontSize: 15,
    color: Colors.text,
  },
  categoryWrapper: {
    marginBottom: 8,
  },
  categoryContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 10,
  },
  categoryChip: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    paddingHorizontal: 4,
    elevation: 1,
    shadowColor: Colors.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryChipSelected: {
    backgroundColor: Colors.primary,
    elevation: 3,
    shadowColor: Colors.shadow.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  categoryChipText: {
    color: Colors.textLight,
    fontSize: 13,
    fontWeight: '500',
  },
  categoryChipTextSelected: {
    color: '#FFF',
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 100,
    paddingTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 120,
  },
  emptyText: {
    color: Colors.textLight,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    color: Colors.textMuted,
    fontSize: 14,
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: Colors.primary,
    borderRadius: 28,
    elevation: 6,
    shadowColor: Colors.shadow.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  snackbar: {
    backgroundColor: Colors.success,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  snackbarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  snackbarText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
});
