import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { TextInput, HelperText, useTheme } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatDate } from '../../utils/dateUtils';

interface DatePickerFieldProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  error?: string;
  mode?: 'date' | 'time' | 'datetime';
}

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  value,
  onChange,
  minimumDate,
  maximumDate,
  error,
  mode = 'date',
}) => {
  const theme = useTheme();
  const [show, setShow] = useState(false);
  const isProcessingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup: cerrar el picker y limpiar timeouts al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setShow(false);
      isProcessingRef.current = false;
    };
  }, []);

  const handleChange = (event: any, selectedDate?: Date) => {
    // Prevenir múltiples llamadas mientras se procesa
    if (isProcessingRef.current) {
      console.log('[DatePickerField] Already processing, ignoring');
      return;
    }
    
    isProcessingRef.current = true;
    
    // Limpiar timeout previo si existe
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // En Android, cerrar inmediatamente primero
    if (Platform.OS === 'android') {
      // Forzar cierre inmediato del estado
      setShow(false);
      
      // Luego procesar el resultado en el siguiente tick
      timeoutRef.current = setTimeout(() => {
        isProcessingRef.current = false;
        
        // Solo actualizar si el usuario seleccionó una fecha (no canceló)
        if (event.type === 'set' && selectedDate) {
          onChange(selectedDate);
        }
        timeoutRef.current = null;
      }, 150);
      return;
    }
    
    // En iOS, manejar normalmente
    setShow(false);
    timeoutRef.current = setTimeout(() => {
      isProcessingRef.current = false;
      
      if (selectedDate && event.type !== 'dismissed') {
        onChange(selectedDate);
      }
      timeoutRef.current = null;
    }, 100);
  };

  const showPicker = () => {
    if (!isProcessingRef.current && !show) {
      setShow(true);
    }
  };

  const displayValue = mode === 'date' 
    ? formatDate(value)
    : mode === 'time'
    ? value.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    : `${formatDate(value)} ${value.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={showPicker} activeOpacity={0.7}>
        <View pointerEvents="none">
          <TextInput
            label={label}
            value={displayValue}
            mode="outlined"
            editable={false}
            error={!!error}
            right={<TextInput.Icon icon="calendar" />}
            style={[styles.input, { backgroundColor: theme.colors.surface }]}
          />
        </View>
      </TouchableOpacity>
      
      {error && (
        <HelperText type="error" visible={!!error}>
          {error}
        </HelperText>
      )}

      {/* Forzar desmontaje completo cuando no se muestra */}
      {show && Platform.OS === 'android' ? (
        <DateTimePicker
          key={`picker-${Date.now()}`}
          value={value}
          mode={mode === 'datetime' ? 'date' : mode}
          display="default"
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      ) : show ? (
        <DateTimePicker
          value={value}
          mode={mode}
          display="spinner"
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  input: {},
});
