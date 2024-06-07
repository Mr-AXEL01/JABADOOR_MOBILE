import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import i18n from './i18n';

const LanguageSwitcher = () => {
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => changeLanguage('en')}>
        <Text>English</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => changeLanguage('fr')}>
        <Text>Français</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => changeLanguage('ar')}>
        <Text>العربية</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

export default LanguageSwitcher;
