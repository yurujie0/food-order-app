import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { TextInput, Button, Text, Snackbar, Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { Colors } from '../../constants/Colors';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('请输入邮箱和密码');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await login(email.trim(), password);
      // 登录成功，跳转到首页
      navigation.replace('Home');
    } catch (err: any) {
      setError(err.message || '登录失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo 区域 */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>🍜</Text>
          </View>
          <Text style={styles.appName}>美食点餐</Text>
          <Text style={styles.appSlogan}>美味，触手可及</Text>
        </View>

        <Surface style={styles.card} elevation={2}>
          <Text variant="headlineMedium" style={styles.title}>
            欢迎回来
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            登录您的账号开始点餐
          </Text>

          <TextInput
            label="邮箱"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            outlineStyle={styles.inputOutline}
            left={<TextInput.Icon icon="email" color={Colors.primary} />}
            theme={{ colors: { primary: Colors.primary } }}
          />

          <TextInput
            label="密码"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry={!showPassword}
            style={styles.input}
            outlineStyle={styles.inputOutline}
            left={<TextInput.Icon icon="lock" color={Colors.primary} />}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
                color={Colors.textLight}
              />
            }
            theme={{ colors: { primary: Colors.primary } }}
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
            style={styles.loginButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            登 录
          </Button>

          <View style={styles.registerContainer}>
            <Text variant="bodyMedium" style={styles.registerText}>还没有账号？</Text>
            <Button 
              mode="text" 
              compact 
              onPress={() => navigation.navigate('Register')}
              labelStyle={styles.registerButtonLabel}
            >
              立即注册
            </Button>
          </View>
        </Surface>
      </ScrollView>

      <Snackbar
        visible={!!error}
        onDismiss={() => setError('')}
        duration={3000}
        style={styles.snackbar}
      >
        {error}
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logoText: {
    fontSize: 48,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  appSlogan: {
    fontSize: 14,
    color: Colors.textLight,
    letterSpacing: 2,
  },
  card: {
    padding: 28,
    borderRadius: 20,
    backgroundColor: Colors.card,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
    color: Colors.text,
    fontSize: 24,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    color: Colors.textLight,
    fontSize: 14,
  },
  input: {
    marginBottom: 16,
    backgroundColor: Colors.card,
  },
  inputOutline: {
    borderRadius: 12,
    borderWidth: 1.5,
  },
  loginButton: {
    marginTop: 16,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: Colors.primary,
  },
  buttonContent: {
    height: 52,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 2,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  registerText: {
    color: Colors.textLight,
    fontSize: 14,
  },
  registerButtonLabel: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  snackbar: {
    backgroundColor: Colors.error,
  },
});
