import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useNavigation } from 'expo-router'
import * as Location from 'expo-location';
import axios from 'axios';
import MapView from 'react-native-map-clustering'; 

const ListingsMap = ({ selectedCategory }) => {
  const [region, setRegion] = useState(null);
  const [listings, setListings] = useState([]);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();

    // Fetch listings
    const fetchListings = async () => {
      try {
        const response = await axios.get('https://azhzx0jphc.execute-api.eu-north-1.amazonaws.com/dev/hosts');
        setListings(response.data);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const filteredListings = selectedCategory && selectedCategory !== 'all'
    ? listings.filter(listing => listing.category.category_code === selectedCategory)
    : listings;

  return (
    <View style={styles.container}>
      {region && (
        <MapView
          style={StyleSheet.absoluteFill}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          showsMyLocationButton={true}
          initialRegion={region}
        >
          {filteredListings.map(listing => (
            <Marker
              key={listing.Host_code}
              onPress={() => navigation.navigate('listing/[Host_code]', { Host_code: listing.Host_code })}
              coordinate={{
                latitude: parseFloat(listing.latitude),
                longitude: parseFloat(listing.longitude),
              }}
            >
                <View style={styles.marker}>
                    <Text style={styles.markerText}>
                        ${listing.price}
                    </Text>
                </View>
            </Marker>
          ))}
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marker: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 6,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
        width: 1,
        geight: 10,
    },
  },
  markerText: {
    fontSize: 14,
    fontFamily: 'mon-sb'
  },
});

export default ListingsMap;
