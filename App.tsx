import React, { useEffect, useState } from 'react';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Colors } from './constants/Colors';
import { useVersionCheck } from './hooks/useVersionCheck';
import { UpdateDialog } from './components/UpdateDialog';

// Auth Screens
import LoginScreen from './app/(auth)/login';
import RegisterScreen from './app/(auth)/register';

// User Screens
import HomeScreen from './app/(user)/index';
import CartScreen from './app/(user)/cart';
import OrdersScreen from './app/(user)/orders';
import ProfileScreen from './app/(user)/profile';

// Admin Screens
import AdminDashboardScreen from './app/(admin)/dashboard';
import AdminDishesScreen from './app/(admin)/dishes';
import AdminOrdersScreen from './app/(admin)/orders';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 自定义主题 - 温暖美食风格
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: Colors.primary,
    primaryContainer: Colors.primaryLight,
    secondary: Colors.secondary,
    secondaryContainer: Colors.secondaryLight,
    background: Colors.background,
    surface: Colors.surface,
    surfaceVariant: Colors.card,
    error: Colors.error,
    onPrimary: '#FFFFFF',
    onSurface: Colors.text,
    onSurfaceVariant: Colors.textLight,
    outline: Colors.border,
    outlineVariant: Colors.divider,
  },
  roundness: 4,
};

// 自定义 Tab Bar 样式
const tabBarOptions = {
  tabBarActiveTintColor: Colors.primary,
  tabBarInactiveTintColor: Colors.textLight,
  tabBarStyle: {
    backgroundColor: Colors.card,
    borderTopWidth: 0,
    elevation: 8,
    shadowColor: Colors.shadow.medium,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    height: 70,
    paddingBottom: 10,
    paddingTop: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  tabBarLabelStyle: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  headerShown: false,
};

// 用户底部导航
function UserTabs() {
  return (
    <Tab.Navigator screenOptions={tabBarOptions}>
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: '点餐',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused ? styles.activeTabIcon : null}>
              <MaterialCommunityIcons
                name={focused ? 'food' : 'food-outline'}
                size={size}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{
          title: '购物车',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused ? styles.activeTabIcon : null}>
              <MaterialCommunityIcons
                name={focused ? 'cart' : 'cart-outline'}
                size={size}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrdersScreen}
        options={{
          title: '订单',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused ? styles.activeTabIcon : null}>
              <MaterialCommunityIcons
                name={focused ? 'clipboard-list' : 'clipboard-list-outline'}
                size={size}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: '我的',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused ? styles.activeTabIcon : null}>
              <MaterialCommunityIcons
                name={focused ? 'account' : 'account-outline'}
                size={size}
                color={color}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// 管理员底部导航
function AdminTabs() {
  return (
    <Tab.Navigator screenOptions={tabBarOptions}>
      <Tab.Screen
        name="AdminDashboardTab"
        component={AdminDashboardScreen}
        options={{
          title: '仪表盘',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused ? styles.activeTabIcon : null}>
              <MaterialIcons
                name="dashboard"
                size={size}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="AdminDishesTab"
        component={AdminDishesScreen}
        options={{
          title: '菜谱',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused ? styles.activeTabIcon : null}>
              <MaterialCommunityIcons
                name={focused ? 'food' : 'food-outline'}
                size={size}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="AdminOrdersTab"
        component={AdminOrdersScreen}
        options={{
          title: '订单',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused ? styles.activeTabIcon : null}>
              <MaterialCommunityIcons
                name={focused ? 'clipboard-list' : 'clipboard-list-outline'}
                size={size}
                color={color}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function Navigation() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {!user ? (
          // Auth Stack
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : user.role === 'admin' ? (
          // Admin Stack
          <Stack.Screen name="Admin" component={AdminTabs} />
        ) : (
          // User Stack
          <Stack.Screen name="User" component={UserTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// 版本检测组件
function VersionChecker() {
  const { updateInfo, hasUpdate, dismissUpdate } = useVersionCheck();
  
  return (
    <UpdateDialog
      visible={hasUpdate}
      updateInfo={updateInfo}
      onDismiss={dismissUpdate}
    />
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <VersionChecker />
          <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
            <Navigation />
            <StatusBar style="dark" backgroundColor={Colors.background} />
          </SafeAreaView>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  activeTabIcon: {
    transform: [{ scale: 1.1 }],
  },
});
