import React from 'react';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';

interface LoadingProps {
  size?: 'small' | 'large' | number;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ size = 'large', fullScreen = false }) => {
  const theme = useTheme();
  
  if (fullScreen) {
    return (
      <View style={[styles.fullScreen, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size={size} color={theme.colors.primary} />
      </View>
    );
  }

  return <ActivityIndicator size={size} color={theme.colors.primary} />;
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loading;
