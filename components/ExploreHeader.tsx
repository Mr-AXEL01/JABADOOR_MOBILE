import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, StyleSheet, TouchableOpacity, Text, ScrollView, ActivityIndicator, Image } from 'react-native';
import { Link } from 'expo-router';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const ExploreHeader = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    axios.get('https://azhzx0jphc.execute-api.eu-north-1.amazonaws.com/dev/categories')
      .then(response => {
        setCategories(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
        setLoading(false);
      });
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category.category_code);
    onSelectCategory(category.category_code);
  };

  return (
    <SafeAreaView style={{ backgroundColor: '#fff', paddingTop: 35 }}>
      <View style={styles.container}>
        <View style={styles.actionRow}>
          <Link href={'/(modals)/booking'} asChild>
            <TouchableOpacity style={styles.searchBtn}>
              <Ionicons name="search" size={24} />
              <View>
                <Text style={{ fontFamily: 'mon-sb' }}>Where to?</Text>
                <Text style={{ color: Colors.grey, fontFamily: 'mon' }}>Anywhere · Any week</Text>
              </View>
            </TouchableOpacity>
          </Link>
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={24} />
          </TouchableOpacity>
        </View>
        <ScrollView horizontal={true} style={{ flex: 1 }} contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 10 }} showsHorizontalScrollIndicator={false}>
          {loading ? (
            <ActivityIndicator size="large" color={Colors.primary} />
          ) : (
            categories.map((category) => (
              <TouchableOpacity
                key={category.category_code}
                style={[styles.categoryBtn, selectedCategory === category.category_code && styles.selectedCategoryBtn]}
                onPress={() => handleCategorySelect(category)}
              >
                <Image source={{ uri: category.image }} style={styles.categoryIcon} />
                <Text style={[styles.categoryText, selectedCategory === category.category_code && styles.selectedCategoryText]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
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
    height: 130,
  },
  actionRow: {
    flexDirection: 'row',
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
  categoryBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: Colors.lightGrey,
    borderRadius: 20,
  },
  selectedCategoryBtn: {
    backgroundColor: Colors.primary,
  },
  categoryIcon: {
    width: 30,
    height: 30,
    borderRadius: 24,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'mon-sb',
    color: Colors.grey,
  },
  selectedCategoryText: {
    color: '#fff',
  },
});

export default ExploreHeader;
