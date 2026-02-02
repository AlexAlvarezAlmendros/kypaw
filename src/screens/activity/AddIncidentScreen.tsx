import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { Text, useTheme, SegmentedButtons, Chip, IconButton } from 'react-native-paper';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Timestamp } from 'firebase/firestore';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { spacing } from '../../constants/theme';
import { Button, Card, Loading, Input } from '../../components/ui';
import { TypeSelector, DatePickerField } from '../../components/forms';
import { useAuthStore } from '../../store/authStore';
import { usePetStore } from '../../store/petStore';
import { useDialog } from '../../contexts/DialogContext';
import { useImagePicker } from '../../hooks/useImagePicker';
import { PetsStackParamList, IncidentCategory, IncidentSeverity } from '../../types';
import {
  createIncident,
  updateIncident,
  getIncident,
} from '../../services/incidentService';
import { uploadImageToImgbb, generateImageName } from '../../services/imgbbService';

type AddIncidentRouteProp = RouteProp<PetsStackParamList, 'AddIncident'>;
type AddIncidentNavigationProp = NativeStackNavigationProp<PetsStackParamList, 'AddIncident'>;

const schema = z.object({
  date: z.date(),
  category: z.enum(['DIGESTIVE', 'MOBILITY', 'SKIN', 'RESPIRATORY', 'BEHAVIOR', 'INJURY', 'OTHER']),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  title: z.string().min(1, 'El título es obligatorio'),
  description: z.string().optional(),
  symptoms: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof schema>;

const CATEGORY_OPTIONS = [
  { value: 'DIGESTIVE' as const, label: 'Digestivo', icon: 'stomach' },
  { value: 'MOBILITY' as const, label: 'Movilidad', icon: 'walk' },
  { value: 'SKIN' as const, label: 'Piel', icon: 'hand-back-left' },
  { value: 'RESPIRATORY' as const, label: 'Respiratorio', icon: 'lungs' },
  { value: 'BEHAVIOR' as const, label: 'Comportamiento', icon: 'head-question' },
  { value: 'INJURY' as const, label: 'Lesión', icon: 'bandage' },
  { value: 'OTHER' as const, label: 'Otro', icon: 'help-circle' },
];

const SEVERITY_BUTTONS = [
  { value: 'LOW', label: 'Leve' },
  { value: 'MEDIUM', label: 'Moderado' },
  { value: 'HIGH', label: 'Grave' },
];

const AddIncidentScreen = () => {
  const theme = useTheme();
  const route = useRoute<AddIncidentRouteProp>();
  const navigation = useNavigation<AddIncidentNavigationProp>();
  const { user } = useAuthStore();
  const { pets } = usePetStore();
  const { showSuccess, showError } = useDialog();
  const { imageUri: pickedImageUri, pickImage, takePhoto, clearImage } = useImagePicker();

  const { petId, incidentId } = route.params;
  const pet = pets.find((p) => p.id === petId);
  const isEditing = !!incidentId;

  console.log('[AddIncident] 🎬 Componente inicializado');
  console.log('[AddIncident] PetId:', petId);
  console.log('[AddIncident] Pet encontrada:', pet?.name);
  console.log('[AddIncident] IncidentId:', incidentId);
  console.log('[AddIncident] IsEditing:', isEditing);
  console.log('[AddIncident] User:', user?.uid);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [existingPhotoUrl, setExistingPhotoUrl] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date(),
      category: 'DIGESTIVE',
      severity: 'LOW',
      title: '',
      description: '',
      symptoms: [],
    },
  });

  useEffect(() => {
    if (isEditing && user) {
      console.log('[AddIncident] 🔵 Iniciando carga de incidente para editar');
      console.log('[AddIncident] IncidentId:', incidentId);
      loadIncident();
    } else {
      console.log('[AddIncident] ➕ Modo creación (no carga incidente)');
    }
  }, [isEditing, user]);

  const loadIncident = async () => {
    console.log('[AddIncident] 📥 Cargando incidente...');
    if (!user || !incidentId) {
      console.error('[AddIncident] ❌ No hay user o incidentId');
      return;
    }
    
    try {
      const incident = await getIncident(user.uid, petId, incidentId);
      console.log('[AddIncident] Incidente cargado:', incident);
      
      if (incident) {
        setValue('date', incident.date.toDate());
        setValue('category', incident.category);
        setValue('severity', incident.severity);
        setValue('title', incident.title);
        setValue('description', incident.description || '');
        if (incident.photoUrl) {
          setExistingPhotoUrl(incident.photoUrl);
        }
        console.log('[AddIncident] ✅ Valores del formulario establecidos');
      } else {
        console.error('[AddIncident] ❌ No se encontró el incidente');
      }
    } catch (error: any) {
      console.error('[AddIncident] ❌ Error cargando incidente:', error);
      console.error('[AddIncident] Error stack:', error?.stack);
      showError('Error', 'No se pudo cargar el incidente');
      navigation.goBack();
    } finally {
      setInitialLoading(false);
      console.log('[AddIncident] 🏁 Finalizada carga de incidente');
    }
  };

  useEffect(() => {
    if (pickedImageUri) {
      setPhotoUri(pickedImageUri);
      setExistingPhotoUrl(null);
    }
  }, [pickedImageUri]);

  const handlePickImage = async () => {
    await pickImage();
  };

  const handleTakePhoto = async () => {
    await takePhoto();
  };

  const onSubmit = async (data: FormData) => {
    console.log('[AddIncident] 🔵 Iniciando onSubmit');
    console.log('[AddIncident] Data recibida:', data);
    console.log('[AddIncident] User:', user?.uid);
    console.log('[AddIncident] PetId:', petId);
    console.log('[AddIncident] IsEditing:', isEditing);
    console.log('[AddIncident] IncidentId:', incidentId);
    
    if (!user) {
      console.error('[AddIncident] ❌ No hay usuario autenticado');
      return;
    }

    setLoading(true);
    try {
      let photoUrl = existingPhotoUrl || undefined;
      console.log('[AddIncident] PhotoUri:', photoUri);
      console.log('[AddIncident] ExistingPhotoUrl:', existingPhotoUrl);

      // Subir foto a imgbb si hay una nueva
      if (photoUri) {
        console.log('[AddIncident] 📷 Subiendo foto...');
        try {
          photoUrl = await uploadImageToImgbb(photoUri, generateImageName('incident'));
          console.log('[AddIncident] ✅ Foto subida:', photoUrl);
        } catch (uploadError) {
          console.error('[AddIncident] ❌ Error subiendo imagen:', uploadError);
          // Continuar sin foto si falla la subida
        }
      }

      const incidentData = {
        date: Timestamp.fromDate(data.date),
        category: data.category as IncidentCategory,
        severity: data.severity as IncidentSeverity,
        title: data.title,
        description: data.description,
        resolved: false,
        photoUrl,
      };
      
      console.log('[AddIncident] 📝 Datos del incidente a guardar:', incidentData);

      if (isEditing && incidentId) {
        console.log('[AddIncident] 🔄 Actualizando incidente existente...');
        await updateIncident(user.uid, petId, incidentId, incidentData);
        console.log('[AddIncident] ✅ Incidente actualizado correctamente');
        showSuccess('Actualizado', 'El incidente se ha actualizado correctamente');
      } else {
        console.log('[AddIncident] ➕ Creando nuevo incidente...');
        const newIncident = await createIncident(user.uid, petId, incidentData);
        console.log('[AddIncident] ✅ Incidente creado con ID:', newIncident.id);
        showSuccess('Registrado', 'El incidente se ha registrado. ¡Esperamos que se mejore pronto!');
      }
      
      console.log('[AddIncident] 🔙 Navegando hacia atrás...');
      navigation.goBack();
    } catch (error: any) {
      console.error('[AddIncident] ❌ Error en onSubmit:', error);
      console.error('[AddIncident] Error stack:', error?.stack);
      console.error('[AddIncident] Error message:', error?.message);
      showError('Error', isEditing ? 'No se pudo actualizar' : 'No se pudo registrar');
    } finally {
      console.log('[AddIncident] 🏁 Finalizando onSubmit');
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <Loading fullScreen />;
  }

  const currentPhotoUri = photoUri || existingPhotoUrl;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <ScrollView
        style={[styles.scrollView, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Fecha */}
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            ¿Cuándo ocurrió?
          </Text>
          <Controller
            control={control}
            name="date"
            render={({ field: { value, onChange } }) => (
              <View>
                <DatePickerField
                  label="Fecha"
                  value={value}
                  onChange={onChange}
                  mode="date"
                />
                <View style={{ height: 8 }} />
                <DatePickerField
                  label="Hora"
                  value={value}
                  onChange={onChange}
                  mode="time"
                />
              </View>
            )}
          />
        </Card>

        {/* Categoría */}
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            ¿Qué tipo de problema?
          </Text>
          <Controller
            control={control}
            name="category"
            render={({ field: { value, onChange } }) => (
              <TypeSelector
                items={CATEGORY_OPTIONS}
                value={value}
                onValueChange={onChange}
                columns={2}
              />
            )}
          />
        </Card>

        {/* Severidad */}
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            ¿Qué tan grave es?
          </Text>
          <Controller
            control={control}
            name="severity"
            render={({ field: { value, onChange } }) => (
              <SegmentedButtons
                value={value}
                onValueChange={onChange}
                buttons={SEVERITY_BUTTONS}
                style={styles.segmentedButtons}
              />
            )}
          />
        </Card>

        {/* Título */}
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Describe brevemente
          </Text>
          <Controller
            control={control}
            name="title"
            render={({ field: { value, onChange } }) => (
              <Input
                label="Título"
                value={value}
                onChangeText={onChange}
                placeholder="Ej: Hoy ha vomitado"
                error={errors.title?.message}
              />
            )}
          />
        </Card>

        {/* Descripción */}
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Detalles adicionales (opcional)
          </Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { value, onChange } }) => (
              <Input
                label="Descripción"
                value={value || ''}
                onChangeText={onChange}
                placeholder="¿Algo más que quieras anotar?"
                multiline
                numberOfLines={4}
              />
            )}
          />
        </Card>

        {/* Foto */}
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Foto (opcional)
          </Text>
          <Text style={[styles.photoHint, { color: theme.colors.onSurfaceVariant }]}>
            Una foto puede ayudar a tu veterinario
          </Text>
          
          {currentPhotoUri ? (
            <View style={styles.photoContainer}>
              <Image source={{ uri: currentPhotoUri }} style={styles.photo} />
              <IconButton
                icon="close"
                mode="contained"
                size={20}
                style={styles.removePhotoButton}
                onPress={() => {
                  setPhotoUri(null);
                  setExistingPhotoUrl(null);
                }}
              />
            </View>
          ) : (
            <View style={styles.photoButtons}>
              <Button
                mode="outlined"
                icon="camera"
                onPress={handleTakePhoto}
                style={styles.photoButton}
              >
                Cámara
              </Button>
              <Button
                mode="outlined"
                icon="image"
                onPress={handlePickImage}
                style={styles.photoButton}
              >
                Galería
              </Button>
            </View>
          )}
        </Card>

        {/* Botón guardar */}
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          disabled={loading}
          style={styles.submitButton}
        >
          {isEditing ? 'Actualizar' : 'Registrar incidente'}
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl * 2,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  segmentedButtons: {
    marginTop: spacing.xs,
  },
  suggestionsLabel: {
    fontSize: 12,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  suggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  suggestionChip: {
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  symptomChip: {
    marginBottom: spacing.xs,
  },
  photoHint: {
    fontSize: 13,
    marginBottom: spacing.sm,
  },
  photoContainer: {
    position: 'relative',
    alignSelf: 'center',
  },
  photo: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  photoButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  photoButton: {
    flex: 1,
  },
  submitButton: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
});

export default AddIncidentScreen;
