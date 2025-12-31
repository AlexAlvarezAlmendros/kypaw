import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { FAB, Searchbar, Chip, useTheme, Icon } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { spacing } from '../../constants/theme';
import { Card, Loading } from '../../components/ui';
import { useAuthStore } from '../../store/authStore';
import { usePetStore } from '../../store/petStore';
import { Pet, PetsStackParamList } from '../../types';
import { calculateAge } from '../../utils/dateUtils';

type PetsListNavigationProp = NativeStackNavigationProp<PetsStackParamList, 'PetsList'>;

const PetsListScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<PetsListNavigationProp>();
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { pets, loading, fetchPets } = usePetStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Cargar mascotas solo cuando la pantalla está enfocada y es la primera vez
  useFocusEffect(
    useCallback(() => {
      if (user && isInitialLoad && pets.length === 0) {
        fetchPets(user.uid).finally(() => setIsInitialLoad(false));
      }
    }, [user, isInitialLoad, pets.length])
  );

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPets(pets);
    } else {
      const filtered = pets.filter((pet) =>
        pet.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPets(filtered);
    }
  }, [searchQuery, pets]);

  const getSpeciesIcon = (species: string) => {
    switch (species) {
      case 'Perro':
        return 'dog';
      case 'Gato':
        return 'cat';
      default:
        return 'paw';
    }
  };

  const renderPetCard = ({ item }: { item: Pet }) => {
    const age = item.birthDate ? calculateAge(item.birthDate.toDate()) : null;

    return (
      <Card
        style={styles.petCard}
        onPress={() => navigation.navigate('PetDetail', { petId: item.id })}
      >
        <View style={styles.cardContent}>
          {/* Avatar / Foto */}
          <View style={styles.avatarContainer}>
            {item.photoUrl ? (
              <Image source={{ uri: item.photoUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder, { backgroundColor: theme.colors.primaryContainer }]}>
                <Icon
                  source={getSpeciesIcon(item.species)}
                  size={40}
                  color={theme.colors.primary}
                />
              </View>
            )}
          </View>

          {/* Información */}
          <View style={styles.infoContainer}>
            <Text style={[styles.petName, { color: theme.colors.onSurface }]}>{item.name}</Text>
            <View style={styles.detailsRow}>
              <Chip
                icon={getSpeciesIcon(item.species)}
                mode="flat"
                style={[styles.chip, { backgroundColor: theme.colors.primaryContainer }]}
                textStyle={[styles.chipText, { color: theme.colors.onPrimaryContainer }]}
                compact
              >
                {item.species}
              </Chip>
              {age && (
                <Text style={[styles.ageText, { color: theme.colors.onSurfaceVariant }]}>{age}</Text>
              )}
            </View>
            {item.breed && (
              <Text style={[styles.breedText, { color: theme.colors.onSurfaceVariant }]}>{item.breed}</Text>
            )}
          </View>

          {/* Icono de navegación */}
          <Icon
            source="chevron-right"
            size={24}
            color={theme.colors.onSurfaceVariant}
          />
        </View>
      </Card>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon
        source="paw-off"
        size={80}
        color={theme.colors.onSurfaceVariant}
      />
      <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>No tienes mascotas aún</Text>
      <Text style={[styles.emptySubtitle, { color: theme.colors.onSurfaceVariant }]}>
        Pulsa el botón + para añadir tu primera mascota
      </Text>
    </View>
  );

  const renderSearchEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon
        source="magnify"
        size={80}
        color={theme.colors.onSurfaceVariant}
      />
      <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>No se encontraron mascotas</Text>
      <Text style={[styles.emptySubtitle, { color: theme.colors.onSurfaceVariant }]}>
        Intenta con otro nombre
      </Text>
    </View>
  );

  if (loading && pets.length === 0) {
    return <Loading fullScreen />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.md, backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>Mis Mascotas 🐾</Text>
        <Text style={[styles.headerSubtitle, { color: theme.colors.onSurfaceVariant }]}>
          {pets.length} {pets.length === 1 ? 'mascota' : 'mascotas'}
        </Text>
      </View>

      {/* Buscador */}
      {pets.length > 0 && (
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Buscar mascota..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={[styles.searchbar, { backgroundColor: theme.colors.surfaceVariant }]}
            iconColor={theme.colors.primary}
          />
        </View>
      )}

      {/* Lista de mascotas */}
      <FlatList
        data={filteredPets}
        renderItem={renderPetCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          searchQuery ? renderSearchEmptyState() : renderEmptyState()
        }
        refreshing={loading || false}
        onRefresh={() => user && fetchPets(user.uid)}
      />

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('AddPet')}
        color={theme.colors.onPrimary}
        label="Añadir"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 16,
    marginTop: spacing.xs,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  searchbar: {
    elevation: 2,
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  petCard: {
    marginBottom: spacing.md,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  petName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  chip: {
    marginRight: spacing.sm,
  },
  chipText: {
    fontSize: 12,
    marginVertical: 0,
    paddingVertical: 0,
  },
  ageText: {
    fontSize: 13,
  },
  breedText: {
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
    paddingHorizontal: spacing.lg,
  },
  emptyIcon: {
    marginBottom: spacing.md,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
  },
});

export default PetsListScreen;
