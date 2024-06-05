// index.tsx
import { View } from 'react-native';
import React, { useState } from 'react';
import { Stack } from 'expo-router';
import ExploreHeader from '@/components/ExploreHeader';
import Listings from '@/components/Listings';

const Page = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ header: () => <ExploreHeader onSelectCategory={setSelectedCategory} selectedCategory={selectedCategory} /> }} />
      <Listings selectedCategory={selectedCategory} />
    </View>
  );
};

export default Page;
