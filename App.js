import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import RootComponent from './components/screens/Views/RootComponent';
import { UserProvider } from './components/context/UserContext';

export default function App() {


  return (
    <UserProvider>
        <RootComponent/>
    </UserProvider>
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
