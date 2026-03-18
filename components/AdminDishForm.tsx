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
    <ScrollView style={styles.container}>
      <TextInput
        label="菜品名称"
        value={name}
        onChangeText={setName}
        mode="outlined"
        error={!!errors.name}
        style={styles.input}
      />
      {errors.name && <HelperText type="error">{errors.name}</HelperText>}

      <TextInput
        label="价格 (¥)"
        value={price}
        onChangeText={setPrice}
        mode="outlined"
        keyboardType="decimal-pad"
        error={!!errors.price}
        style={styles.input}
      />
      {errors.price && <HelperText type="error">{errors.price}</HelperText>}

      <Text style={styles.label}>分类</Text>
      <SegmentedButtons
        value={category}
        onValueChange={(value) => setCategory(value as DishCategory)}
        buttons={categories.map(cat => ({
          value: cat.value,
          label: cat.label,
        }))}
        style={styles.segmentedButtons}
      />

      <TextInput
        label="描述"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={3}
        error={!!errors.description}
        style={styles.input}
      />
      {errors.description && <HelperText type="error">{errors.description}</HelperText>}

      <Text style={styles.label}>菜品图片</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <MaterialCommunityIcons name="camera-plus" size={40} color={Colors.textMuted} />
            <Text style={styles.imagePlaceholderText}>点击选择图片</Text>
          </View>
        )}
      </TouchableOpacity>
      {errors.image && <HelperText type="error">{errors.image}</HelperText>}

      <View style={styles.switchContainer}>
        <Text>上架状态</Text>
        <Switch
          value={isAvailable}
          onValueChange={setIsAvailable}
          color={Colors.primary}
        />
      </View>

      <View style={styles.buttons}>
        <Button
          mode="outlined"
          onPress={onCancel}
          style={styles.button}
          disabled={isLoading}
        >
          取消
        </Button>
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.button}
          loading={isLoading}
          disabled={isLoading}
        >
          {dish ? '保存修改' : '添加菜品'}
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    marginBottom: 4,
  },
  label: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 16,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  imagePicker: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.background,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
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
    marginTop: 8,
    color: Colors.textMuted,
    fontSize: 14,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 4,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 40,
  },
  button: {
    flex: 1,
  },
});
