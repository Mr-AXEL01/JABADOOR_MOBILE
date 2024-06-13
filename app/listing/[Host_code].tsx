import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const Page = () => {
  const { Host_code } = useLocalSearchParams<{ Host_code: string }>();
  const [host, setHost] = useState<any>(null);
  const router = useRouter();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchHostDetails = async () => {
      try {
        const response = await axios.get(`https://azhzx0jphc.execute-api.eu-north-1.amazonaws.com/dev/hosts/${Host_code}?lang=${i18n.language}`);
        setHost(response.data);
      } catch (error) {
        console.error('Error fetching host details:', error);
      }
    };

    if (Host_code) {
      fetchHostDetails();
    }
  }, [Host_code, i18n.language]);

  if (!host) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const renderAmenity = (amenity: any, index: number) => {
    const amenityName = amenity?.name || t('Unknown Amenity');
    const amenityIcon = amenity?.icon;

    const amenityIconSource = {
      uri: amenityIcon,
    };

    return (
      <View key={index} style={styles.amenity}>
        <Image source={amenityIconSource} style={styles.amenityImage} />
        <Text style={styles.amenityText}>{amenityName}</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: host.image[0].secure_url }} style={styles.mainImage} />
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.favoriteButton}>
        <Ionicons name="heart-outline" size={24} color="#000" />
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{host.nom}</Text>
        <Text style={styles.description}>{host.About}</Text>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="star" size={16} color={Colors.primary} />
            <Text style={styles.infoText}>{host.Rating}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="bed" size={16} color={Colors.primary} />
            <Text style={styles.infoText}>{t('Bedrooms')}: {host.bedrooms}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="water" size={16} color={Colors.primary} />
            <Text style={styles.infoText}>{t('Baths')}: {host.baths}</Text>
          </View>
        </View>
        <Text style={styles.price}>${host.price}</Text>
        <Text style={styles.amenitiesTitle}>{t('Amenities')}:</Text>
        {host.amenities && host.amenities.length > 0 ? (
          host.amenities.map(renderAmenity)
        ) : (
          <Text style={styles.noAmenities}>{t('No amenities listed')}</Text>
        )}
        <View style={styles.hostContainer}>
          <Image source={{ uri: host.image[0].secure_url }} style={styles.hostImage} />
          <Text style={styles.hostName}>{t('Hosted by')}: {host.nom}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>{t('Book')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainImage: {
    width: '100%',
    height: 400,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  favoriteButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 5,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  amenitiesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  amenity: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  amenityImage: {
    width: 16,
    height: 16,
    marginRight: 5,
  },
  amenityText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 5,
  },
  noAmenities: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  hostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  hostImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  hostName: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  addButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Page;
