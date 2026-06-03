import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton, Card, Screen } from '@/presentation/components';

interface PlaceholderScreenProps {
  title: string;
  description: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

export const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({ title, description, actionLabel, onActionPress }) => {
  return (
    <Screen>
      <View style={styles.container}>
        <Card>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          {actionLabel && onActionPress ? <AppButton title={actionLabel} onPress={onActionPress} /> : null}
        </Card>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#14532d',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 10,
  },
  description: {
    color: '#64748b',
    lineHeight: 21,
    marginBottom: 14,
  },
});
