import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, StyleSheet, TouchableOpacity, Text, ScrollView, ActivityIndicator, Image } from 'react-native';
import { Link } from 'expo-router';
import Colors from '@/constants/Colors';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const ExploreHeader = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    axios.get(`https://azhzx0jphc.execute-api.eu-north-1.amazonaws.com/dev/categories?lang=${i18n.language}`)
      .then(response => {
        setCategories([{ category_code: 'all', name: t('All') }, ...response.data]);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
        setLoading(false);
      });
  }, [i18n.language]);

  const handleCategorySelect = (categoryCode) => {
    setSelectedCategory(categoryCode);
    onSelectCategory(categoryCode);
  };
  
  return (
    <SafeAreaView style={{ backgroundColor: '#fff', paddingTop: 35 }}>
      <View style={styles.container}>
        <View style={[styles.actionRow, {flexDirection: isRTL ? 'row-reverse' : 'row'} ]}>
          <Link href={'/(modals)/booking'} asChild>
            <TouchableOpacity style={styles.searchBtn}>
              <Ionicons name="search" size={24} />
              <View>
                <Text style={{ fontFamily: 'mon-sb' }}>{t('Where to?')}</Text>
                <Text style={{ color: Colors.grey, fontFamily: 'mon' }}>{t('Anywhere · Any week')}</Text>
              </View>
            </TouchableOpacity>
          </Link>
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={24} />
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal={true}
          contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 10 }} 
          showsHorizontalScrollIndicator={false}
        >
          {loading ? (
            <ActivityIndicator size="large" color={Colors.primary} />
          ) : (
            categories.map((category) => (
              <View key={category.category_code} style={styles.categoryContainer}>
                <TouchableOpacity
                  style={[styles.categoryBtn, selectedCategory === category.category_code && styles.selectedCategoryBtn]}
                  onPress={() => handleCategorySelect(category.category_code)}
                >
                  {category.category_code === 'all' ? (
                    <Image source={{ uri: 'https://res.cloudinary.com/dofubyjcd/image/upload/v1718222114/system/v7dckrnijvvtlqgy90qz.png' }} style={styles.categoryIcon} />
                  ) : (
                    <Image source={{ uri: category.image }} style={styles.categoryIcon} />
                  )}
                  <Text
                    style={[styles.categoryText, selectedCategory === category.category_code && styles.selectedCategoryText]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
                {selectedCategory === category.category_code && <View style={styles.underline} />}
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: 140,
  },
  actionRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  filterBtn: {
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.grey,
    borderRadius: 24,
  },
  searchBtn: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 8,
    alignItems: 'center',
    width: 280,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#c2c2c2',
    borderRadius: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 1, height: 1 },
    
  },
  categoryContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  categoryBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: Colors.lightGrey,
    
  },
  selectedCategoryBtn: {
    backgroundColor: Colors.lightGrey,
  },
  underline: {
    height: 2,
    backgroundColor: 'black',
    width: '100%',
    marginTop: 3,
  },
  categoryIcon: {
    width: 25,
    height: 25,
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 13,
    fontFamily: 'mon-sb',
    color: Colors.grey,
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: Colors.grey,
  },
});

export default ExploreHeader;
