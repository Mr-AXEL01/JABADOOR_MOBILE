import { View, Text } from 'react-native'
import React from 'react'
import LanguageSwitcher from '@/components/LanguageSwitcher' 

const Page = () => {
  return (
    <View style={{ flex: 1 }}>
      <LanguageSwitcher />
    </View>
  );
};

export default Page;