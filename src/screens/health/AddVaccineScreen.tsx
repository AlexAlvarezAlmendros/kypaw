import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { TextInput, Button, Switch, useTheme, Icon } from 'react-native-paper';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Timestamp } from 'firebase/firestore';
import { spacing } from '../../constants/theme';
import { Loading } from '../../components/ui';
import { useAuthStore } from '../../store/authStore';
import { createVaccine } from '../../services/vaccineService';
import { PetsStackParamList } from '../../types';

type AddVaccineRouteProp = RouteProp<PetsStackParamList, 'AddVaccine'>;
type AddVaccineNavigationProp = NativeStackNavigationProp<PetsStackParamList, 'AddVaccine'>;

const vaccineSchema = z.object({
  name: z.string().min(1, 'El nombre de la vacuna es requerido'),
  administeredDate: z.date({
    required_error: 'La fecha es requerida',
  }),
  hasNextDose: z.boolean(),
  nextDoseDate: z.date().optional(),
}).refine((data) => {
  // Si tiene próxima dosis, debe especificar la fecha
  if (data.hasNextDose && !data.nextDoseDate) {
    return false;
  }
  // La próxima dosis debe ser después de la fecha de administración
  if (data.hasNextDose && data.nextDoseDate) {
    return data.nextDoseDate > data.administeredDate;
  }
  return true;
}, {
  message: 'La próxima dosis debe ser posterior a la fecha de administración',
  path: ['nextDoseDate'],
});

type VaccineFormData = z.infer<typeof vaccineSchema>;

const AddVaccineScreen = () => {
  const theme = useTheme();
  const route = useRoute<AddVaccineRouteProp>();
  const navigation = useNavigation<AddVaccineNavigationProp>();
  const { user } = useAuthStore();
  const { petId } = route.params;

  const [loading, setLoading] = useState(false);
  const [showAdministeredPicker, setShowAdministeredPicker] = useState(false);
  const [showNextDosePicker, setShowNextDosePicker] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<VaccineFormData>({
    resolver: zodResolver(vaccineSchema),
    defaultValues: {
      name: '',
      administeredDate: new Date(),
      hasNextDose: true,
      nextDoseDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // +1 año
    },
  });

  const administeredDate = watch('administeredDate');
  const hasNextDose = watch('hasNextDose');
  const nextDoseDate = watch('nextDoseDate');

  const onSubmit = async (data: VaccineFormData) => {
    if (!user) return;

    setLoading(true);
    try {
      // Preparar datos - solo incluir campos con valor
      const vaccineData: any = {
        name: data.name,
        administeredDate: Timestamp.fromDate(data.administeredDate),
      };

      // Añadir nextDoseDate solo si hasNextDose es true y tiene fecha
      if (data.hasNextDose && data.nextDoseDate) {
        vaccineData.nextDoseDate = Timestamp.fromDate(data.nextDoseDate);
      }

      await createVaccine(user.uid, petId, vaccineData);
      
      Alert.alert('¡Vacuna guardada!', 'La vacuna se ha registrado correctamente', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Error al guardar vacuna:', error);
      Alert.alert('Error', 'No se pudo guardar la vacuna. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen message="Guardando vacuna..." />;
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Información de la Vacuna</Text>

      {/* Nombre de la vacuna */}
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Nombre de la vacuna *"
            mode="outlined"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={!!errors.name}
            style={[styles.input, { backgroundColor: theme.colors.surface }]}
            placeholder="ej. Rabia, Parvovirus, Leucemia felina..."
          />
        )}
      />
      {errors.name && (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.name.message}</Text>
      )}

      {/* Fecha de administración */}
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: theme.colors.onSurface }]}>Fecha de administración *</Text>
        <TouchableOpacity
          style={[styles.dateButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }]}
          onPress={() => setShowAdministeredPicker(true)}
        >
          <Icon source="calendar" size={20} color={theme.colors.primary} />
          <Text style={[styles.dateText, { color: theme.colors.onSurface }]}>
            {administeredDate.toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </Text>
        </TouchableOpacity>
        {showAdministeredPicker && (
          <DateTimePicker
            value={administeredDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowAdministeredPicker(Platform.OS === 'ios');
              if (date) {
                setValue('administeredDate', date);
              }
            }}
          />
        )}
        {errors.administeredDate && (
          <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.administeredDate.message}</Text>
        )}
      </View>

      {/* Switch para próxima dosis */}
      <View style={[styles.switchContainer, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.switchLabel}>
          <Icon
            source="calendar-clock"
            size={20}
            color={theme.colors.onSurface}
          />
          <Text style={[styles.label, { color: theme.colors.onSurface }]}>¿Requiere próxima dosis?</Text>
        </View>
        <Controller
          control={control}
          name="hasNextDose"
          render={({ field: { onChange, value } }) => (
            <Switch
              value={value}
              onValueChange={onChange}
            />
          )}
        />
      </View>

      {/* Fecha de próxima dosis (condicional) */}
      {hasNextDose && (
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.colors.onSurface }]}>Fecha de próxima dosis</Text>
          <TouchableOpacity
            style={[styles.dateButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }]}
            onPress={() => setShowNextDosePicker(true)}
          >
            <Icon source="calendar-clock" size={20} color={theme.colors.primary} />
            <Text style={[styles.dateText, { color: theme.colors.onSurface }]}>
              {nextDoseDate?.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </Text>
          </TouchableOpacity>
          {showNextDosePicker && nextDoseDate && (
            <DateTimePicker
              value={nextDoseDate}
              mode="date"
              display="default"
              minimumDate={administeredDate}
              onChange={(event, date) => {
                setShowNextDosePicker(Platform.OS === 'ios');
                if (date) {
                  setValue('nextDoseDate', date);
                }
              }}
            />
          )}
          {errors.nextDoseDate && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.nextDoseDate.message}</Text>
          )}
        </View>
      )}

      {/* Información adicional */}
      <View style={[styles.infoBox, { backgroundColor: theme.colors.primaryContainer }]}>
        <Icon
          source="information"
          size={20}
          color={theme.colors.primary}
        />
        <Text style={[styles.infoText, { color: theme.colors.onPrimaryContainer }]}>
          Las vacunas con próxima dosis te avisarán cuando se acerque la fecha de revacunación.
        </Text>
      </View>

      {/* Botón Guardar */}
      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        style={styles.submitButton}
        contentStyle={styles.submitButtonContent}
        labelStyle={styles.submitButtonLabel}
        disabled={loading}
      >
        Guardar Vacuna
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  input: {
    marginBottom: spacing.md,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: spacing.md,
  },
  dateText: {
    fontSize: 16,
    marginLeft: spacing.sm,
    flex: 1,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  switchLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  errorText: {
    fontSize: 12,
    marginTop: spacing.xs,
    marginLeft: spacing.sm,
  },
  infoBox: {
    flexDirection: 'row',
    padding: spacing.md,
    borderRadius: 8,
    marginVertical: spacing.lg,
    gap: spacing.sm,
  },
  infoText: {
    fontSize: 12,
    flex: 1,
  },
  submitButton: {
    marginTop: spacing.lg,
    borderRadius: 12,
  },
  submitButtonContent: {
    paddingVertical: spacing.sm,
  },
  submitButtonLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AddVaccineScreen;
