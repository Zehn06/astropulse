import React from 'react';
import { StyleSheet, SafeAreaView, Text, View, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import GameManager from './src/GameManager';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>❌ Something went wrong</Text>
            <ScrollView style={styles.errorScroll}>
              <Text style={styles.errorMessage}>
                {this.state.error && this.state.error.toString()}
              </Text>
              {this.state.errorInfo && (
                <Text style={styles.errorStack}>
                  {this.state.errorInfo.componentStack}
                </Text>
              )}
            </ScrollView>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  React.useEffect(() => {
    console.log('App: Starting AstroPulse...');
  }, []);

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" hidden={false} />
        <GameManager />
      </SafeAreaView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 24,
    color: '#ff0000',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorScroll: {
    maxHeight: 400,
    width: '100%',
    paddingHorizontal: 20,
  },
  errorStack: {
    fontSize: 12,
    color: '#cccccc',
    fontFamily: 'monospace',
    marginTop: 10,
  },
});
