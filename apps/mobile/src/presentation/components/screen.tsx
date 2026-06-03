import React, { type PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenProps extends PropsWithChildren {
  scroll?: boolean;
}

export const Screen: React.FC<ScreenProps> = ({ children, scroll = true }) => {
  const Container = scroll ? ScrollView : View;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Container
        style={scroll ? styles.scrollView : styles.view}
        contentContainerStyle={scroll ? styles.content : undefined}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </Container>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f7f1',
  },
  scrollView: {
    flex: 1,
  },
  view: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 16,
  },
});
