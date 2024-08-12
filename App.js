import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import StackNavigetor from './StackNavigetor';
import { UserContext } from './UserContext';

export default function App() {
  return (
    <>
    <UserContext>
    <StackNavigetor/>
    </UserContext>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
