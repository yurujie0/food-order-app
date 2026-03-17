import React, { useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { Searchbar, FAB, Portal, Dialog, Snackbar, IconButton } from 'react-native-paper';
import { useDishes } from '../../hooks/useDishes';
import { DishCard } from '../../components/DishCard';
import { AdminDishForm } from '../../components/AdminDishForm';
import { Dish } from '../../types';
import { Colors } from '../../constants/Colors';

export default function AdminDishesScreen() {
  const {
    dishes,
    filteredDishes,
    isLoading,
    searchQuery,
    setSearchQuery,
    refreshDishes,
    createDish,
    updateDish,
    deleteDish,
    toggleAvailability,
  } = useDishes();

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleAdd = () => {
    setEditingDish(null);
    setIsFormVisible(true);
  };

  const handleEdit = (dish: Dish) => {
    setEditingDish(dish);
    setIsFormVisible(true);
  };

  const handleDelete = (dish: Dish) => {
    Alert.alert(
      '确认删除',
      `确定要删除菜品 "${dish.name}" 吗？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDish(dish.id);
              setSnackbarMessage('菜品已删除');
              setSnackbarVisible(true);
            } catch (error: any) {
              setSnackbarMessage(error.message || '删除失败');
              setSnackbarVisible(true);
            }
          },
        },
      ]
    );
  };

  const handleSubmit = async (data: {
    name: string;
    price: number;
    category: any;
    description: string;
    image: string;
    isAvailable: boolean;
  }) => {
    setIsSubmitting(true);
    try {
      if (editingDish) {
        await updateDish(editingDish.id, data);
        setSnackbarMessage('菜品已更新');
      } else {
        await createDish(data);
        setSnackbarMessage('菜品已添加');
      }
      setIsFormVisible(false);
      setSnackbarVisible(true);
    } catch (error: any) {
      setSnackbarMessage(error.message || '操作失败');
      setSnackbarVisible(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderDish = ({ item }: { item: Dish }) => (
    <View style={styles.dishContainer}>
      <DishCard
        dish={item}
        showActions={false}
      />
      <View style={styles.actions}>
        <IconButton
          icon={item.isAvailable ? 'eye' : 'eye-off'}
          onPress={() => toggleAvailability(item.id)}
          iconColor={item.isAvailable ? Colors.success : Colors.textMuted}
        />
        <IconButton
          icon="pencil"
          onPress={() => handleEdit(item)}
          iconColor={Colors.info}
        />
        <IconButton
          icon="delete"
          onPress={() => handleDelete(item)}
          iconColor={Colors.error}
        />
      </View>
    </View>
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

      {/* 菜品列表 */}
      <FlatList
        data={filteredDishes}
        renderItem={renderDish}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refreshDishes} />
        }
      />

      {/* 添加按钮 */}
      <FAB
        icon="plus"
        onPress={handleAdd}
        style={styles.fab}
        color={Colors.card}
      />

      {/* 表单对话框 */}
      <Portal>
        <Dialog
          visible={isFormVisible}
          onDismiss={() => setIsFormVisible(false)}
          style={styles.dialog}
        >
          <Dialog.Title>
            {editingDish ? '编辑菜品' : '添加菜品'}
          </Dialog.Title>
          <Dialog.ScrollArea style={styles.dialogScroll}>
            <AdminDishForm
              dish={editingDish}
              onSubmit={handleSubmit}
              onCancel={() => setIsFormVisible(false)}
              isLoading={isSubmitting}
            />
          </Dialog.ScrollArea>
        </Dialog>
      </Portal>

      {/* 提示 */}
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
  searchBar: {
    margin: 16,
    marginBottom: 8,
    elevation: 2,
  },
  listContent: {
    paddingBottom: 80,
  },
  dishContainer: {
    position: 'relative',
  },
  actions: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 8,
    elevation: 2,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primary,
  },
  dialog: {
    maxHeight: '80%',
  },
  dialogScroll: {
    paddingHorizontal: 0,
  },
  snackbar: {
    backgroundColor: Colors.success,
  },
});
