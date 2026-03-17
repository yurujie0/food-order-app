import { Tabs, Redirect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { Colors } from '../../constants/Colors';

export default function AdminLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  // 非管理员跳转到用户端
  if (user.role !== 'admin') {
    return <Redirect href="/(user)/" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarStyle: {
          backgroundColor: Colors.card,
          borderTopColor: Colors.border,
        },
        headerStyle: {
          backgroundColor: Colors.card,
        },
        headerTintColor: Colors.text,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: '仪表盘',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" size={size} color={color} />
          ),
          headerTitle: '管理仪表盘',
        }}
      />
      <Tabs.Screen
        name="dishes"
        options={{
          title: '菜谱管理',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="food-variant" size={size} color={color} />
          ),
          headerTitle: '菜谱管理',
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: '订单管理',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="clipboard-list" size={size} color={color} />
          ),
          headerTitle: '订单管理',
        }}
      />
    </Tabs>
  );
}
