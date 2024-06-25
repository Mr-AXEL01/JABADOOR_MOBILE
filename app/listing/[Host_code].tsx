import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Share } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { SvgXml } from 'react-native-svg'; // Import SvgXml for SVG rendering
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
    const amenityIcon = amenity?.svg;

    // Modify the SVG string to remove 'fill: currentcolor;'
    const svgXmlData = amenityIcon.replace('fill: currentcolor;', '');

    return (
      <View key={index} style={styles.amenity}>
        <SvgXml xml={svgXmlData} width={24} height={24} />
        <Text style={styles.amenityText}>{amenityName}</Text>
      </View>
    );
  };

const shareListing = async () => {
  if (!host || !host.Host_code) {
    console.error('Host data or Host code is not available.');
    alert('Host data or Host code is not available.');
    return;
  }

  try {
    const imageUrl = host.image[0].secure_url;
    const imageUri = `${FileSystem.cacheDirectory}${host.Host_code}.jpg`;

    await FileSystem.downloadAsync(imageUrl, imageUri);

    await Share.share({
      message: `Check out this wonderful Host: ${host.nom}\n\nLink: https://main.d11i2xf9qyhgyw.amplifyapp.com/host/${host.Host_code}`,
      url: imageUri,
    });

    console.log('Shared successfully');
  } catch (error) {
    console.error('Error sharing listing:', error.message);
    alert(`Error sharing: ${error.message}`);
  }
};


  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: host.image[0].secure_url }} style={styles.mainImage} />
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <View style={styles.roundButtons}>
        <TouchableOpacity style={styles.roundButton} onPress={shareListing} >
          <Ionicons name="share-outline" size={22} color={'#000'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.roundButton}>
          <Ionicons name="heart-outline" size={22} color={'#000'} />
        </TouchableOpacity>
      </View>

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
          <View style={{flexDirection:'row'}}>
            <Text style={styles.price}>${host.price}</Text>
            <Text style={{margin:4,}}>night</Text>
          </View>
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
    padding: 8,
    elevation: 2,
  },
  roundButtons: {
    width: 80,
    position: 'absolute',
    top: 40,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roundButton: {
    borderRadius: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    color: Colors.primary,
    padding: 8,
    elevation: 2,
    borderRadius: 18,
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
    fontSize: 18,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
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
