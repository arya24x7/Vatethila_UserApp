// In App.js in a new project

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/Home';
import Login from './src/Login';
import SignUp from './src/SignUp';
import MainView from './src/mainView.js';
import SelectFood from './src/SelectFood';
import Cart from './src/Cart';
import Checkout from './src/Checkout';
import BfCart from './src/BfCart';
import LunchCart from './src/LunchCart';
import DinnerCart from './src/DinnerCart';
import SnacksCart from './src/SnacksCart';


const Stack = createNativeStackNavigator();

function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="MainView" component={MainView} />
        <Stack.Screen name="SelectFood" component={SelectFood} />
        <Stack.Screen name="Cart" component={Cart} />
        <Stack.Screen name="BfCart" component={BfCart} />
        <Stack.Screen name="Checkout" component={Checkout} />
        <Stack.Screen name="LunchCart" component={LunchCart} />
        <Stack.Screen name="DinnerCart" component={DinnerCart} />
        <Stack.Screen name="SnacksCart" component={SnacksCart} />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 

export default App;