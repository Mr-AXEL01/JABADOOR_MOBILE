import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useMemo, useRef } from 'react';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Listings from '@/components/Listings';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const ListingsBottomSheet = ({ selectedCategory }: Props) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['10%', '100%'], []);

  const onShowMap = () => {
    bottomSheetRef.current?.collapse();
  };

  return (
    <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        handleIndicatorStyle={{ backgroundColor: Colors.grey }}
        style={styles.sheetContainer}
      >
        <BottomSheetScrollView Style={styles.contentContainer}>
          <Listings selectedCategory={selectedCategory} />
        </BottomSheetScrollView>
        <View style={styles.absoluteBtn}>
          <TouchableOpacity onPress={onShowMap} style={styles.btn}>
            <Text style={{ fontFamily: 'mon-sb', color: '#fff' }}>Map</Text>
            <Ionicons name="map" size={20} style={{ marginLeft: 10 }} color={'#fff'} />
          </TouchableOpacity>
        </View>
      </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 60, 
  },
  absoluteBtn: {
    position: 'absolute',
    bottom: 8,
    width: '100%',
    alignItems: 'center',
    opacity: 0.7,
  },
  btn: {
    backgroundColor: Colors.dark,
    padding: 10,
    height: 45,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sheetContainer: {
    backgroundColor: '#fff',
    borderRadius: 14,
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
