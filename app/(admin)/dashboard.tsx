import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Button, List, Avatar } from 'react-native-paper';

import { useAuth } from '../../contexts/AuthContext';
import { useOrders } from '../../hooks/useOrders';
import { useDishes } from '../../hooks/useDishes';
import { Colors } from '../../constants/Colors';

interface OrderStats {
  total: number;
  pending: number;
  preparing: number;
  completed: number;
  cancelled: number;
  todayRevenue: number;
}

export default function AdminDashboardScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const { orders, getOrderStats } = useOrders();
  const { dishes } = useDishes();
  
  const [stats, setStats] = useState<OrderStats>({
    total: 0,
    pending: 0,
    preparing: 0,
    completed: 0,
    cancelled: 0,
    todayRevenue: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      const s = await getOrderStats();
      setStats(s);
    };
    loadStats();
  }, [orders]);

  const handleLogout = async () => {
    await logout();
    navigation.replace('Login');
  };

  const statCards = [
    { title: '今日收入', value: `¥${stats.todayRevenue.toFixed(2)}`, icon: 'cash', color: Colors.success },
    { title: '待处理订单', value: stats.pending.toString(), icon: 'clock-alert', color: Colors.warning },
    { title: '制作中', value: stats.preparing.toString(), icon: 'fire', color: Colors.info },
    { title: '总订单', value: stats.total.toString(), icon: 'clipboard-list', color: Colors.primary },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* 欢迎区域 */}
      <Card style={styles.welcomeCard}>
        <Card.Content style={styles.welcomeContent}>
          <Avatar.Text
            size={60}
            label="管"
            style={styles.avatar}
          />
          <View style={styles.welcomeText}>
            <Text variant="titleLarge" style={styles.welcomeTitle}>
              欢迎回来，{user?.name}
            </Text>
            <Text variant="bodyMedium" style={styles.welcomeSubtitle}>
              管理员控制台
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* 统计卡片 */}
      <View style={styles.statsContainer}>
        {statCards.map((stat, index) => (
          <Card key={index} style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Avatar.Icon
                size={40}
                icon={stat.icon}
                style={{ backgroundColor: stat.color + '20' }}
                color={stat.color}
              />
              <Text variant="titleLarge" style={styles.statValue}>
                {stat.value}
              </Text>
              <Text variant="bodySmall" style={styles.statTitle}>
                {stat.title}
              </Text>
            </Card.Content>
          </Card>
        ))}
      </View>

      {/* 快捷操作 */}
      <Card style={styles.menuCard}>
        <Card.Title title="快捷操作" />
        <Card.Content>
          <List.Item
            title="管理菜谱"
            description={`当前共有 ${dishes.length} 道菜品`}
            left={props => <List.Icon {...props} icon="food-variant" color={Colors.primary} />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('AdminDishesTab')}
          />
          <List.Item
            title="管理订单"
            description={`${stats.pending} 个待处理订单`}
            left={props => <List.Icon {...props} icon="clipboard-list" color={Colors.primary} />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('AdminOrdersTab')}
          />
        </Card.Content>
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
  welcomeCard: {
    margin: 16,
    marginBottom: 8,
    borderRadius: 16,
    backgroundColor: Colors.primary,
  },
  welcomeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  avatar: {
    backgroundColor: Colors.card,
  },
  welcomeText: {
    marginLeft: 16,
  },
  welcomeTitle: {
    color: Colors.card,
    fontWeight: 'bold',
  },
  welcomeSubtitle: {
    color: Colors.card + 'CC',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  statCard: {
    width: '50%',
    padding: 8,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  statValue: {
    marginTop: 8,
    fontWeight: 'bold',
    color: Colors.text,
  },
  statTitle: {
    color: Colors.textLight,
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
