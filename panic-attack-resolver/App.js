import { StyleSheet, Text, View } from 'react-native';
import Panic_Attack_Resolver from './src';

export default function App() {
  return (
    <View style={styles.container}>
      <Panic_Attack_Resolver />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
