import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen       from './screens/LoginScreen';
import RegisterScreen    from './screens/RegisterScreen';
import MainScreen        from './screens/MainScreen';
import ProgramDetailScreen from './screens/ProgramDetailScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login"         component={LoginScreen} />
          <Stack.Screen name="Register"      component={RegisterScreen} />
          <Stack.Screen name="Main"          component={MainScreen} />
          <Stack.Screen name="ProgramDetail" component={ProgramDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
