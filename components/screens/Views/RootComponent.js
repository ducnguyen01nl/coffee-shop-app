

import React from 'react'
import { View,Image,Text } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';import Home from '../Home/Home';
import Cart from '../Cart/Cart';
import User from '../User/User';
import SignIn from '../SignIn/SignIn';
import Favourite from '../Favourite/Favourite';
import InfoUser from '../../screenComponents/InfoUser';
import ListAddress from '../../screenComponents/ListAddress';
import ItemAddress from '../../screenComponents/ItemAddress';
import ChooseAddress from '../../screenComponents/ChooseAddress';
import DescriptionItem from '../../screenComponents/DescriptionItem';
import Note from '../../screenComponents/Note';
import CartOrder from '../../screenComponents/CartOrder';



const Tab = createBottomTabNavigator();

export default function RootComponent() {

    const Stack = createNativeStackNavigator();

  function MyTabs(){
    return(
      <Tab.Navigator initialRouteName='Home' 
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#C67C4E',
        tabBarIcon: ({ focused }) => {
          let iconSource;

          if (route.name === 'Home') {
            iconSource = focused
              ? require('../../../assets/iconHomeActive.png') // Icon khi tab được chọn
              : require('../../../assets/iconHome.png'); // Icon khi tab không được chọn
          } else if (route.name === 'Favourite') {
            iconSource = focused
              ? require('../../../assets/iconFavouriteActive.png')
              : require('../../../assets/iconFavourite.png');
          } else if (route.name === 'Cart') {
            iconSource = focused
              ? require('../../../assets/iconCartActive.png')
              : require('../../../assets/iconCart.png');
          } else if (route.name === 'User') {
            iconSource = focused
              ? require('../../../assets/iconUserActive.png')
              : require('../../../assets/iconUser.png');
          }

          return (
            <Image
              source={iconSource}
              style={{ width: 25, height: 25, tintColor: focused ? '#C67C4E' : 'gray' }}
            />
          );
        },
        tabBarLabel: ({ focused }) => {
          let labelText;
          if (route.name === 'Home') {
            labelText = 'Trang chủ'; // Tên tùy chỉnh cho tab Home
          } else if (route.name === 'Favourite') {
            labelText = 'Yêu thích'; // Tên tùy chỉnh cho tab Favourite
          } else if (route.name === 'Cart') {
            labelText = 'Giỏ hàng'; // Tên tùy chỉnh cho tab Cart
          } else if (route.name === 'User') {
            labelText = 'Người dùng'; // Tên tùy chỉnh cho tab User
          }
          return (
            <Text style={{ color: focused ? '#760000' : 'gray',fontSize:12, marginVertical:5 }}>{labelText}</Text>
          );
        },
        tabBarStyle:{
          position:'absolute',
          borderRadius:15,
          marginHorizontal:10,
          bottom:10,
          paddingVertical:10,
          // marginBottom:10
        },

      })}
        
      >
        <Tab.Screen name='Home' component={Home} />
        <Tab.Screen name='Favourite' component={Favourite} />
        <Tab.Screen name='Cart' component={Cart} />
        <Tab.Screen name='User' component={User} />
        
      </Tab.Navigator>
    )
  };

  return (
      <NavigationContainer>
          <Stack.Navigator initialRouteName='SignIn' screenOptions={{headerShown:false}}>
              <Stack.Screen name="SignIn" component={SignIn} />
              <Stack.Screen name="HomeTabs" component={MyTabs} />
              <Stack.Screen name="InfoUser" component={InfoUser} />
              <Stack.Screen name="ListAddress" component={ListAddress} />
              <Stack.Screen name="ItemAddress" component={ItemAddress} />
              <Stack.Screen name="ChooseAddress" component={ChooseAddress} />
              <Stack.Screen name="DescriptionItem" component={DescriptionItem} />
              <Stack.Screen name="Note" component={Note} />
              <Stack.Screen name="CartOrder" component={CartOrder} />

          </Stack.Navigator>
      </NavigationContainer>
  )
}
