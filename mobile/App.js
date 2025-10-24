import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import CameraScreen from './src/screens/CameraScreen';
import ResultScreen from './src/screens/ResultScreen';
import InsectListScreen from './src/screens/InsectListScreen';
import AboutScreen from './src/screens/AboutScreen';

// Theme
import { theme } from './src/theme/theme';

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#667eea',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ title: 'Nhận Diện Sâu Bệnh' }}
          />
          <Stack.Screen 
            name="Camera" 
            component={CameraScreen}
            options={{ title: 'Chụp Ảnh' }}
          />
          <Stack.Screen 
            name="Result" 
            component={ResultScreen}
            options={{ title: 'Kết Quả' }}
          />
          <Stack.Screen 
            name="InsectList" 
            component={InsectListScreen}
            options={{ title: 'Danh Sách Côn Trùng' }}
          />
          <Stack.Screen 
            name="About" 
            component={AboutScreen}
            options={{ title: 'Giới Thiệu' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
