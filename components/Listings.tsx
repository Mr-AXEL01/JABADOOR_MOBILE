// Listings.tsx
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Colors from '@/constants/Colors';

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

  const filteredListings = selectedCategory
    ? listings.filter(listing => listing.category.category_code === selectedCategory)
    : listings;

  return (
    <View style={{ padding: 20 }}>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        filteredListings.length > 0 ? (
          <FlatList
            data={filteredListings}
            keyExtractor={(item) => item.Host_code}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image source={{ uri: item.image[0].secure_url }} style={styles.image} />
                <View style={styles.cardContent}>
                  <Text style={styles.title}>{item.nom}</Text>
                  <Text style={styles.description}>{item.About}</Text>
                  <View style={{ justifyContent: 'space-between' , flexDirection: 'row'}}>
                  <Text style={styles.rating}>Rating: {item.Rating}</Text>
                  <Text style={styles.price}>Price: ${item.price}</Text>
                  </View>
                
                </View>
              </View>
            )}
          />
        ) : (
          <Text>No listings available for this category.</Text>
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
  rating: {
    fontSize: 16,
    color: Colors.primary,
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
});

export default Listings;
