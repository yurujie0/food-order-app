import React, { useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert, TouchableOpacity } from 'react-native';
import { Searchbar, FAB, Portal, Dialog, Snackbar, Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { IconButton } from 'react-native-paper';
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
    imageFile?: any;
    isAvailable: boolean;
  }) => {
    setIsSubmitting(true);
    try {
      // 如果有本地图片文件，读取为base64
      let imageUrl = data.image;
      if (data.imageFile && data.imageFile.uri) {
        const response = await fetch(data.imageFile.uri);
        const blob = await response.blob();
        const reader = new FileReader();
        imageUrl = await new Promise((resolve) => {
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(blob);
        });
      }

      const dishData = {
        name: data.name,
        price: data.price,
        category: data.category,
        description: data.description,
        image: imageUrl,
        isAvailable: data.isAvailable,
      };

      if (editingDish) {
        await updateDish(editingDish.id, dishData);
        setSnackbarMessage('菜品已更新');
      } else {
        await createDish(dishData);
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
          size={20}
          iconColor="#FFF"
          containerColor={item.isAvailable ? Colors.success : Colors.textMuted}
          onPress={() => toggleAvailability(item.id)}
          style={styles.iconButton}
        />
        <IconButton
          icon="pencil"
          size={20}
          iconColor="#FFF"
          containerColor={Colors.info}
          onPress={() => handleEdit(item)}
          style={styles.iconButton}
        />
        <IconButton
          icon="delete"
          size={20}
          iconColor="#FFF"
          containerColor={Colors.error}
          onPress={() => handleDelete(item)}
          style={styles.iconButton}
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
    marginBottom: 8,
  },
  actions: {
    position: 'absolute',
    bottom: 12,
    right: 20,
    flexDirection: 'row',
    gap: 8,
    zIndex: 100,
    elevation: 10,
  },
  iconButton: {
    margin: 0,
    marginHorizontal: 2,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginHorizontal: 2,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
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
