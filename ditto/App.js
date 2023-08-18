import React from 'react';

import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './screens/HomeScreen';
import Settings from './screens/Settings';


const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerTitleAlign: 'center', headerTintColor: 'white', headerTitleStyle: { fontSize: 28 } }} >
                <Stack.Screen name='Ditto Dashboard' component={HomeScreen} options={{ cardStyle: { backgroundColor: '#282c34' }, headerStyle: { backgroundColor: '#282c34' }, headerShadowVisible: false }} />
                <Stack.Screen name='Settings' component={Settings} options={{ cardStyle: { backgroundColor: '#282c34' }, headerStyle: { backgroundColor: '#282c34' }, headerShadowVisible: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;