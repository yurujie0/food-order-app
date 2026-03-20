import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { TextInput, Button, SegmentedButtons, Switch, Text, HelperText } from 'react-native-paper';
import { launchImageLibrary, ImagePickerResponse, Asset } from 'react-native-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Dish, DishCategory, CategoryLabels } from '../types';
import { Colors } from '../constants/Colors';

interface AdminDishFormProps {
  dish?: Dish | null;
  onSubmit: (data: {
    name: string;
    price: number;
    category: DishCategory;
    description: string;
    image: string;
    imageFile?: Asset | null;
    isAvailable: boolean;
  }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const categories: { value: DishCategory; label: string }[] = [
  { value: 'hot', label: CategoryLabels.hot },
  { value: 'cold', label: CategoryLabels.cold },
  { value: 'soup', label: CategoryLabels.soup },
  { value: 'staple', label: CategoryLabels.staple },
  { value: 'drink', label: CategoryLabels.drink },
  { value: 'dessert', label: CategoryLabels.dessert },
];

export function AdminDishForm({ dish, onSubmit, onCancel, isLoading = false }: AdminDishFormProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<DishCategory>('hot');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState<Asset | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 编辑模式时填充数据
  useEffect(() => {
    if (dish) {
      setName(dish.name);
      setPrice(dish.price.toString());
      setCategory(dish.category);
      setDescription(dish.description);
      setImage(dish.image);
      setIsAvailable(dish.isAvailable);
    }
  }, [dish]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = '请输入菜品名称';
    }

    if (!price.trim()) {
      newErrors.price = '请输入价格';
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = '请输入有效的价格';
    }

    if (!description.trim()) {
      newErrors.description = '请输入菜品描述';
    }

    if (!image.trim()) {
      newErrors.image = '请选择菜品图片';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const pickImage = async () => {
    const result: ImagePickerResponse = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: false,
      maxWidth: 800,
      maxHeight: 600,
      quality: 0.8,
    });

    if (!result.didCancel && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setImageFile(asset);
      setImage(asset.uri || '');
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit({
      name: name.trim(),
      price: Number(price),
      category,
      description: description.trim(),
      image: image.trim(),
      imageFile: imageFile,
      isAvailable,
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 标题 */}
      <View style={styles.header}>
        <MaterialCommunityIcons 
          name={dish ? 'food' : 'food-plus'} 
          size={24} 
          color={Colors.primary} 
        />
        <Text variant="titleLarge" style={styles.headerTitle}>
          {dish ? '编辑菜品' : '添加新菜品'}
        </Text>
      </View>

      {/* 菜品图片 */}
      <Text style={styles.sectionTitle}>菜品图片</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <MaterialCommunityIcons name="camera-plus" size={48} color={Colors.textMuted} />
            <Text style={styles.imagePlaceholderText}>点击上传菜品图片</Text>
            <Text style={styles.imageHint}>建议尺寸: 800x600</Text>
          </View>
        )}
        <View style={styles.imageOverlay}>
          <MaterialCommunityIcons name="pencil" size={20} color="#FFF" />
        </View>
      </TouchableOpacity>
      {errors.image && <HelperText type="error" style={styles.errorText}>{errors.image}</HelperText>}

      {/* 菜品名称 */}
      <View style={styles.inputGroup}>
        <View style={styles.inputHeader}>
          <MaterialCommunityIcons name="food-variant" size={18} color={Colors.primary} />
          <Text style={styles.inputLabel}>菜品名称</Text>
        </View>
        <TextInput
          placeholder="输入菜品名称"
          value={name}
          onChangeText={setName}
          mode="outlined"
          error={!!errors.name}
          style={styles.input}
          outlineColor={Colors.border}
          activeOutlineColor={Colors.primary}
        />
        {errors.name && <HelperText type="error" style={styles.errorText}>{errors.name}</HelperText>}
      </View>

      {/* 价格 */}
      <View style={styles.inputGroup}>
        <View style={styles.inputHeader}>
          <MaterialCommunityIcons name="currency-cny" size={18} color={Colors.primary} />
          <Text style={styles.inputLabel}>价格</Text>
        </View>
        <TextInput
          placeholder="输入价格"
          value={price}
          onChangeText={setPrice}
          mode="outlined"
          keyboardType="decimal-pad"
          error={!!errors.price}
          style={styles.input}
          outlineColor={Colors.border}
          activeOutlineColor={Colors.primary}
          left={<TextInput.Affix text="¥" />}
        />
        {errors.price && <HelperText type="error" style={styles.errorText}>{errors.price}</HelperText>}
      </View>

      {/* 分类 */}
      <View style={styles.inputGroup}>
        <View style={styles.inputHeader}>
          <MaterialCommunityIcons name="tag" size={18} color={Colors.primary} />
          <Text style={styles.inputLabel}>分类</Text>
        </View>
        <View style={styles.categoryContainer}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.value}
              style={[
                styles.categoryButton,
                category === cat.value && { 
                  backgroundColor: Colors.category[cat.value],
                  borderColor: Colors.category[cat.value],
                },
              ]}
              onPress={() => setCategory(cat.value)}
            >
              <Text
                style={[
                  styles.categoryText,
                  category === cat.value && styles.categoryTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 描述 */}
      <View style={styles.inputGroup}>
        <View style={styles.inputHeader}>
          <MaterialCommunityIcons name="text" size={18} color={Colors.primary} />
          <Text style={styles.inputLabel}>菜品描述</Text>
        </View>
        <TextInput
          placeholder="描述菜品的特色和口味"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={4}
          error={!!errors.description}
          style={styles.input}
          outlineColor={Colors.border}
          activeOutlineColor={Colors.primary}
        />
        {errors.description && <HelperText type="error" style={styles.errorText}>{errors.description}</HelperText>}
      </View>

      {/* 上架状态 */}
      <View style={styles.switchContainer}>
        <View style={styles.switchLeft}>
          <MaterialCommunityIcons 
            name={isAvailable ? 'check-circle' : 'circle-outline'} 
            size={22} 
            color={isAvailable ? Colors.success : Colors.textMuted} 
          />
          <Text style={styles.switchLabel}>上架状态</Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: isAvailable ? Colors.success + '20' : Colors.textMuted + '20' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: isAvailable ? Colors.success : Colors.textMuted }
            ]}>
              {isAvailable ? '已上架' : '已下架'}
            </Text>
          </View>
        </View>
        <Switch
          value={isAvailable}
          onValueChange={setIsAvailable}
          color={Colors.success}
        />
      </View>

      {/* 按钮 */}
      <View style={styles.buttons}>
        <Button
          mode="outlined"
          onPress={onCancel}
          style={styles.cancelButton}
          textColor={Colors.textLight}
          disabled={isLoading}
        >
          取消
        </Button>
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
          buttonColor={Colors.primary}
          loading={isLoading}
          disabled={isLoading}
          icon={dish ? 'check' : 'plus'}
        >
          {dish ? '保存修改' : '添加菜品'}
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  headerTitle: {
    fontWeight: 'bold',
    color: Colors.text,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  imagePicker: {
    width: '100%',
    height: 180,
    backgroundColor: Colors.background,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 12,
    color: Colors.textMuted,
    fontSize: 15,
  },
  imageHint: {
    marginTop: 4,
    color: Colors.textMuted,
    fontSize: 12,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: Colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
  },
  errorText: {
    marginLeft: 4,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  categoryText: {
    fontSize: 14,
    color: Colors.textLight,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: 16,
  },
  switchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  buttons: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 12,
    borderColor: Colors.border,
  },
  submitButton: {
    flex: 1.2,
    borderRadius: 12,
  },
});
