import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Colors from '@/constants/Colors';
import { Ionicons} from '@expo/vector-icons';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

const Listings = ({ selectedCategory }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://azhzx0jphc.execute-api.eu-north-1.amazonaws.com/dev/hosts');
        setListings(response.data);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredListings = selectedCategory && selectedCategory !== 'all'
    ? listings.filter(listing => listing.category.category_code === selectedCategory)
    : listings;

  const renderItem = ({ item }) => (
    <Animated.View style={styles.card} entering={FadeInRight} exiting={FadeOutLeft}>
      <Image source={{ uri: item.image[0].secure_url }} style={styles.image} />
      <TouchableOpacity style={{ position: 'absolute', right: 15, top: 15 }}>
        <Ionicons name="heart-outline" size={24} color="#000" />
      </TouchableOpacity>
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.nom}</Text>
        <Text style={styles.description}>{item.About}</Text>
        <View style={styles.infoRow}>
          <View style={{flexDirection: 'row'}}>
            <Ionicons name="star" size={16} style={{marginTop: 2.5}}/>
            <Text style={styles.rating}>{item.Rating}</Text>
          </View>
          <Text style={styles.price}>Price: ${item.price}</Text>
        </View>
      </View>
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
            contentContainerStyle={{ paddingBottom: 20 , marginHorizontal: 20 , marginTop: 20 }}
          />
        ) : (
          <View style={styles.noListingsContainer}>
            <Image
              source={{ uri: 'https://res.cloudinary.com/dofubyjcd/image/upload/v1717607025/system/meb4jgxbgoenfqj9ur7y.png' }}
              style={styles.noListingsImage}
            />
            <Text style={styles.noListingsText}>No listings available for this category.</Text>
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
