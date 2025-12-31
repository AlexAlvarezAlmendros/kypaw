import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Button, Input } from '../../components/ui';
import { spacing } from '../../constants/theme';
import { registerSchema } from '../../utils/validation';
import { getErrorMessage } from '../../utils/firebaseErrors';
import { useAuth } from '../../hooks/useAuth';
import { AuthStackParamList } from '../../types';

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Register'
>;

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setErrorMessage(null);
      await register(data.email, data.password);
    } catch (error: any) {
      setErrorMessage(getErrorMessage(error));
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>Crear Cuenta 🐾</Text>
          <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            Regístrate para comenzar a gestionar a tus mascotas
          </Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Email"
                value={value}
                onChangeText={onChange}
                placeholder="tu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email?.message}
                left={<TextInput.Icon icon="email" />}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Contraseña"
                value={value}
                onChangeText={onChange}
                placeholder="Mínimo 6 caracteres"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                error={errors.password?.message}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Confirmar Contraseña"
                value={value}
                onChangeText={onChange}
                placeholder="Repite tu contraseña"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                error={errors.confirmPassword?.message}
                left={<TextInput.Icon icon="lock-check" />}
                right={
                  <TextInput.Icon
                    icon={showConfirmPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
              />
            )}
          />

          {errorMessage && (
            <View style={[styles.errorContainer, { backgroundColor: theme.colors.errorContainer }]}>
              <Text style={[styles.errorText, { color: theme.colors.error }]}>{errorMessage}</Text>
            </View>
          )}

          <Button
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            disabled={loading}
            style={styles.registerButton}
          >
            Crear Cuenta
          </Button>

          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: theme.colors.onSurfaceVariant }]}>¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.loginLink, { color: theme.colors.primary }]}>Inicia Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    marginTop: spacing.md,
  },
  registerButton: {
    marginTop: spacing.md,
  },
  errorContainer: {
    padding: spacing.md,
    borderRadius: 8,
    marginVertical: spacing.sm,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  loginText: {
    fontSize: 16,
  },
  loginLink: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RegisterScreen;
