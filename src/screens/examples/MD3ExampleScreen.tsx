import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Chip, Surface, useTheme } from 'react-native-paper';

/**
 * Pantalla de ejemplo que demuestra el uso del sistema Material Design 3
 * Esta pantalla muestra todos los componentes y escalas tipográficas disponibles
 */
export default function MD3ExampleScreen() {
  const theme = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Tipografía Display */}
      <Surface style={styles.section} elevation={0}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Display (Textos destacados)
        </Text>
        <Text variant="displayLarge">Display Large</Text>
        <Text variant="displayMedium">Display Medium</Text>
        <Text variant="displaySmall">Display Small</Text>
      </Surface>

      {/* Tipografía Headline */}
      <Surface style={styles.section} elevation={0}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Headline (Encabezados)
        </Text>
        <Text variant="headlineLarge">Headline Large</Text>
        <Text variant="headlineMedium">Headline Medium</Text>
        <Text variant="headlineSmall">Headline Small</Text>
      </Surface>

      {/* Tipografía Title */}
      <Surface style={styles.section} elevation={0}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Title (Títulos de secciones)
        </Text>
        <Text variant="titleLarge">Title Large</Text>
        <Text variant="titleMedium">Title Medium</Text>
        <Text variant="titleSmall">Title Small</Text>
      </Surface>

      {/* Tipografía Body */}
      <Surface style={styles.section} elevation={0}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Body (Texto principal)
        </Text>
        <Text variant="bodyLarge">
          Body Large: Este es el texto principal que usarías para párrafos importantes.
        </Text>
        <Text variant="bodyMedium">
          Body Medium: Ideal para texto secundario o descripciones.
        </Text>
        <Text variant="bodySmall">
          Body Small: Para notas al pie o texto auxiliar.
        </Text>
      </Surface>

      {/* Tipografía Label */}
      <Surface style={styles.section} elevation={0}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Label (Etiquetas y botones)
        </Text>
        <Text variant="labelLarge">Label Large</Text>
        <Text variant="labelMedium">Label Medium</Text>
        <Text variant="labelSmall">Label Small</Text>
      </Surface>

      {/* Botones */}
      <Surface style={styles.section} elevation={0}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Botones
        </Text>
        <View style={styles.buttonRow}>
          <Button mode="contained" icon="check">
            Contained
          </Button>
          <Button mode="outlined" icon="pencil">
            Outlined
          </Button>
          <Button mode="text" icon="delete">
            Text
          </Button>
        </View>
        <View style={styles.buttonRow}>
          <Button mode="elevated" icon="star">
            Elevated
          </Button>
          <Button mode="contained-tonal" icon="heart">
            Tonal
          </Button>
        </View>
      </Surface>

      {/* Cards */}
      <Surface style={styles.section} elevation={0}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Cards
        </Text>
        
        <Card mode="elevated" style={styles.card}>
          <Card.Title
            title="Card Elevated"
            subtitle="Con elevación"
            left={(props) => <Card.Title {...props} title="" />}
          />
          <Card.Content>
            <Text variant="bodyMedium">
              Esta es una card con elevación (sombra).
            </Text>
          </Card.Content>
        </Card>

        <Card mode="outlined" style={styles.card}>
          <Card.Title
            title="Card Outlined"
            subtitle="Con borde"
          />
          <Card.Content>
            <Text variant="bodyMedium">
              Esta es una card con borde outline.
            </Text>
          </Card.Content>
        </Card>

        <Card mode="contained" style={styles.card}>
          <Card.Title
            title="Card Contained"
            subtitle="Con fondo de color"
          />
          <Card.Content>
            <Text variant="bodyMedium">
              Esta es una card con fondo de color container.
            </Text>
          </Card.Content>
        </Card>
      </Surface>

      {/* Chips */}
      <Surface style={styles.section} elevation={0}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Chips
        </Text>
        <View style={styles.chipRow}>
          <Chip icon="paw">Perro</Chip>
          <Chip icon="cat" mode="outlined">Gato</Chip>
          <Chip selected icon="check">Seleccionado</Chip>
        </View>
      </Surface>

      {/* Colores Primarios */}
      <Surface style={styles.section} elevation={0}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Colores Primarios
        </Text>
        <View style={[styles.colorBox, { backgroundColor: theme.colors.primary }]}>
          <Text style={{ color: theme.colors.onPrimary }} variant="labelLarge">
            primary
          </Text>
        </View>
        <View style={[styles.colorBox, { backgroundColor: theme.colors.primaryContainer }]}>
          <Text style={{ color: theme.colors.onPrimaryContainer }} variant="labelLarge">
            primaryContainer
          </Text>
        </View>
      </Surface>

      {/* Colores Secundarios */}
      <Surface style={styles.section} elevation={0}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Colores Secundarios
        </Text>
        <View style={[styles.colorBox, { backgroundColor: theme.colors.secondary }]}>
          <Text style={{ color: theme.colors.onSecondary }} variant="labelLarge">
            secondary
          </Text>
        </View>
        <View style={[styles.colorBox, { backgroundColor: theme.colors.secondaryContainer }]}>
          <Text style={{ color: theme.colors.onSecondaryContainer }} variant="labelLarge">
            secondaryContainer
          </Text>
        </View>
      </Surface>

      {/* Colores de Error */}
      <Surface style={styles.section} elevation={0}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Colores de Error
        </Text>
        <View style={[styles.colorBox, { backgroundColor: theme.colors.error }]}>
          <Text style={{ color: theme.colors.onError }} variant="labelLarge">
            error
          </Text>
        </View>
        <View style={[styles.colorBox, { backgroundColor: theme.colors.errorContainer }]}>
          <Text style={{ color: theme.colors.onErrorContainer }} variant="labelLarge">
            errorContainer
          </Text>
        </View>
      </Surface>

      {/* Superficies */}
      <Surface style={styles.section} elevation={0}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Superficies
        </Text>
        <Surface elevation={0} style={styles.surfaceExample}>
          <Text variant="bodyMedium">Elevation 0</Text>
        </Surface>
        <Surface elevation={1} style={styles.surfaceExample}>
          <Text variant="bodyMedium">Elevation 1</Text>
        </Surface>
        <Surface elevation={2} style={styles.surfaceExample}>
          <Text variant="bodyMedium">Elevation 2</Text>
        </Surface>
        <Surface elevation={3} style={styles.surfaceExample}>
          <Text variant="bodyMedium">Elevation 3</Text>
        </Surface>
        <Surface elevation={4} style={styles.surfaceExample}>
          <Text variant="bodyMedium">Elevation 4</Text>
        </Surface>
        <Surface elevation={5} style={styles.surfaceExample}>
          <Text variant="bodyMedium">Elevation 5</Text>
        </Surface>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 8,
    flexWrap: 'wrap',
  },
  card: {
    marginVertical: 8,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  colorBox: {
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  surfaceExample: {
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
});
