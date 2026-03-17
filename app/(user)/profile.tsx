import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, List, Button, Avatar, Divider } from 'react-native-paper';

import { useAuth } from '../../contexts/AuthContext';
import { Colors } from '../../constants/Colors';

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigation.replace('Login');
  };

  if (!user) return null;

  return (
    <ScrollView style={styles.container}>
      {/* 用户信息卡片 */}
      <Card style={styles.userCard}>
        <Card.Content style={styles.userContent}>
          <Avatar.Text
            size={80}
            label={user.name.charAt(0).toUpperCase()}
            style={styles.avatar}
          />
          <Text variant="headlineSmall" style={styles.userName}>
            {user.name}
          </Text>
          <Text variant="bodyMedium" style={styles.userEmail}>
            {user.email}
          </Text>
          {user.phone && (
            <Text variant="bodyMedium" style={styles.userPhone}>
              {user.phone}
            </Text>
          )}
        </Card.Content>
      </Card>

      {/* 菜单列表 */}
      <Card style={styles.menuCard}>
        <List.Section>
          <List.Item
            title="我的订单"
            description="查看所有订单记录"
            left={props => <List.Icon {...props} icon="clipboard-list" color={Colors.primary} />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('OrdersTab')}
          />
          <Divider />
          <List.Item
            title="购物车"
            description="查看购物车商品"
            left={props => <List.Icon {...props} icon="cart" color={Colors.primary} />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('CartTab')}
          />
          <Divider />
          <List.Item
            title="去点餐"
            description="浏览美味菜品"
            left={props => <List.Icon {...props} icon="food" color={Colors.primary} />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('HomeTab')}
          />
        </List.Section>
      </Card>

      {/* 关于 */}
      <Card style={styles.menuCard}>
        <List.Section>
          <List.Item
            title="关于应用"
            left={props => <List.Icon {...props} icon="information" color={Colors.info} />}
          />
          <Divider />
          <List.Item
            title="版本"
            description="v1.0.0"
            left={props => <List.Icon {...props} icon="tag" color={Colors.info} />}
          />
        </List.Section>
      </Card>

      {/* 退出登录 */}
      <Button
        mode="outlined"
        onPress={handleLogout}
        style={styles.logoutButton}
        textColor={Colors.error}
      >
        退出登录
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  userCard: {
    margin: 16,
    marginBottom: 8,
    borderRadius: 16,
  },
  userContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatar: {
    backgroundColor: Colors.primary,
    marginBottom: 16,
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    color: Colors.textLight,
  },
  userPhone: {
    color: Colors.textMuted,
    marginTop: 4,
  },
  menuCard: {
    margin: 16,
    marginTop: 8,
    borderRadius: 16,
  },
  logoutButton: {
    margin: 16,
    marginTop: 8,
    borderColor: Colors.error,
    borderRadius: 8,
  },
});
