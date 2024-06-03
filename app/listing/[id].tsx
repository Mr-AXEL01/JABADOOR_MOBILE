import { View, Text } from 'react-native'
import React from 'react'

const Page = () => {
    const { id } = useLocalSearchParams<{id: string}>();
  return (
    <View>
      <Text>Page</Text>
    </View>
  )
}

export default Page