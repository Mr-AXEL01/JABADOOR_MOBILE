import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useMemo, useRef, useState } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import Listings from '@/components/Listings';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { GestureHandlerRootView } from 'react-native-gesture-handler';



const ListingsBottomSheet = ({ selectedCategory }: Props) => {
  const snapPoints = useMemo(() => ['10%', '100%'], []);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const onShowMap = () => {
    bottomSheetRef.current?.collapse();
  };

  return (
    <GestureHandlerRootView>
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        handleIndicatorStyle={{ backgroundColor: Colors.grey }}
        style={styles.sheetContainer}
      >
        <View style={styles.contentContainer}>
        <Listings selectedCategory={selectedCategory} />
        <View style={styles.absoluteView}>
          <TouchableOpacity onPress={onShowMap} style={styles.btn}>
            <Text style={{ fontFamily: 'mon-sb', color: '#fff' }}>Map</Text>
            <Ionicons name="map" size={20} style={{ marginLeft: 10 }} color={'#fff'} />
          </TouchableOpacity>
        </View>
        </View>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  absoluteView: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  btn: {
    backgroundColor: Colors.dark,
    padding: 14,
    height: 50,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sheetContainer: {
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
});

export default ListingsBottomSheet;
