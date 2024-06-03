import { View } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import ExploreHeader from '@/components/ExploreHeader'
import Listings from '@/components/Listings'

const Page = () => {
  return (
      <View style={{ flex: 1, marginTop: 80 }}>
        <Stack.Screen 
          options={{
            header:() => <ExploreHeader />,
          }}
        />
      </View>
  );
};

export default Page;