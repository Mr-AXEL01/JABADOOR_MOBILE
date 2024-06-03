import React from 'react'
import { Tabs } from 'expo-router'
import Colors from '@/constants/Colors.ts'

const Layout = () => {
  return (
  <Tabs 
    screenOptions={{ 
        tabBarActiveTintColor: Colors.primary,
        tabBarLabelStyle: {
            fontFamily: 'mon-sb',
            
        }
    }}>
    <Tabs.Screen 
        name="index" 
        options={{
            tabBarLabel: 'Explore',
        }} 
    />
  </Tabs>
  );
}

export default Layout;