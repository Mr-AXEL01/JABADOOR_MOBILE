import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image, TouchableOpacity, Share } from 'react-native';
import * as FileSystem from 'expo-file-system';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Colors from '@/constants/Colors';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { useNavigation } from 'expo-router';
import { useTranslation } from 'react-i18next';


const shareListing = async (item) => {
  if (!item || !item.Host_code) {
    console.error('Host data or Host code is not available.');
    alert('Host data or Host code is not available.');
    return;
  }

  try {
    const imageUrl = item.image[0].secure_url;
    const imageUri = `${FileSystem.cacheDirectory}${item.Host_code}.jpg`;

    await FileSystem.downloadAsync(imageUrl, imageUri);

    await Share.share({
      title: `Check out this wonderful Host: ${item.nom}`,
      message: `Check out this wonderful Host: ${item.nom}\n\nLink: https://main.d11i2xf9qyhgyw.amplifyapp.com/host/${item.Host_code}`,
      url: imageUri,
    });

    console.log('Shared successfully');
  } catch (error) {
    console.error('Error sharing listing:', error.message);
    alert(`Error sharing: ${error.message}`);
  }
};

const Listings = ({ selectedCategory }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { t, i18n } = useTranslation(); // Get the current language

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://azhzx0jphc.execute-api.eu-north-1.amazonaws.com/dev/hosts?lang=${i18n.language}`);
        setListings(response.data);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [i18n.language]); // Update when the language changes

  const filteredListings = selectedCategory && selectedCategory !== 'all'
    ? listings.filter(listing => listing.category.category_code === selectedCategory)
    : listings;

  const renderItem = ({ item }) => (
    <Animated.View style={styles.card} entering={FadeInRight} exiting={FadeOutLeft}>
      <TouchableOpacity onPress={() => navigation.navigate('listing/[Host_code]', { Host_code: item.Host_code })}>
        <Image source={{ uri: item.image[0].secure_url }} style={styles.image} />
        <TouchableOpacity style={styles.roundButton} onPress={() => shareListing(item)}>
          <AntDesign name="sharealt" size={16} color={'#000'} />
        </TouchableOpacity>
        <View style={styles.cardContent}>
          <Text style={styles.title}>{item.nom}</Text>
          <Text style={styles.description}>{item.About}</Text>
          <View style={styles.infoRow}>
            <View style={{ flexDirection: 'row' }}>
              <Ionicons name="star" size={16} style={{ marginTop: 2.5 }} />
              <Text style={styles.rating}>{item.Rating}</Text>
            </View>
            <Text style={styles.price}>{t('Price')}: ${item.price}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        filteredListings.length > 0 ? (
          <FlatList
            data={filteredListings}
            keyExtractor={(item) => item.Host_code}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20, marginHorizontal: 20, marginTop: 20 }}
          />
        ) : (
          <View style={styles.noListingsContainer}>
            <Image
              source={{ uri: 'https://res.cloudinary.com/dofubyjcd/image/upload/v1717607025/system/meb4jgxbgoenfqj9ur7y.png' }}
              style={styles.noListingsImage}
            />
            <Text style={styles.noListingsText}>{t('No listings available for this category')}</Text>
          </View>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  image: {
    width: '100%',
    height: 200,
  },
  roundButton:{
    position: 'absolute', 
    right: 6, 
    top: 8,
    borderRadius: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    color: Colors.primary,
    padding: 8,
    elevation: 2,
    borderRadius: 18,
  },
  cardContent: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rating: {
    fontSize: 16,
  },
  price: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  noListingsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D0D0D0',
  },
  noListingsImage: {
    width: 300,
    height: 300,
    marginBottom: 20,
    borderRadius: 20,
  },
  noListingsText: {
    fontSize: 16,
    color: Colors.grey,
    textAlign: 'center',
  },
});

export default Listings;
