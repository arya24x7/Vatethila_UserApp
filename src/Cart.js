import { View, StyleSheet, Text, ScrollView,Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SelectList } from 'react-native-dropdown-select-list';
import Btn from './Btn';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const Cart = ({ route }) => {
  const navigation = useNavigation();

  const { updatedDates, addBfCount, addDinnerCount, addLunchCount, addSnacksCount,selectedDates } = route.params;

  const [selected, setSelected] = useState('');
  const [bfCount2, setBfCount2] = useState(0);
  const [lunchCount2, setLunchCount2] = useState(0);
  const [snacksCount2, setSnacksCount2] = useState(0);
  const [dinnerCount2, setDinnerCount2] = useState(0);

  const goToBfCart = () => {
    navigation.navigate('BfCart', {
      selected,
      updatedDates,
      addBfCount,
      addDinnerCount,
      addLunchCount,
      addSnacksCount,
    });
  };

  const goToLunchCart = () => {
    navigation.navigate('LunchCart', {
      selected,
      updatedDates,
      addBfCount,
      addDinnerCount,
      addLunchCount,
      addSnacksCount,
    });
  };

  const goToDinnerCart = () => {
    navigation.navigate('DinnerCart', {
      selected,
      updatedDates,
      addBfCount,
      addDinnerCount,
      addLunchCount,
      addSnacksCount,
    });
  };

  const goToSnacksCart = () => {
    navigation.navigate('SnacksCart', {
      selected,
      updatedDates,
      addBfCount,
      addDinnerCount,
      addLunchCount,
      addSnacksCount,
    });
  };

  useEffect(() => {
    getCounts();
  }, [selected]); // Execute getCounts whenever the selected value changes

  const getCounts = async () => {
    try {
      const currentUser = auth().currentUser;

      if (currentUser) {
        const userId = currentUser.uid;

        const parentCollectionRef = firestore().collection('orderDetails');
        const documentRef = parentCollectionRef.doc(userId);
        const nestedCollectionRef = documentRef.collection(selected).doc('details');

        const docSnapshot = await nestedCollectionRef.get();
        console.log("docsnap", docSnapshot);
        if (docSnapshot.exists) {
          const { bfCount, lunchCount, snacksCount, dinnerCount } = docSnapshot.data();
          console.log('Breakfast count:', bfCount);
          console.log('Lunch count:', lunchCount);
          console.log('Snack Count: ', snacksCount);
          console.log('Dinner Count', dinnerCount);
          setBfCount2(bfCount || 0);
          setLunchCount2(lunchCount || 0);
          setSnacksCount2(snacksCount || 0);
          setDinnerCount2(dinnerCount || 0);
        } else {
          console.log('Document does not exist.');
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView style={{ marginTop: 50, marginHorizontal: 20 }}>
        <SelectList
          data={updatedDates}
          setSelected={(val) => setSelected(val)}
          save="value"
          placeholder="ದಿನಾಂಕವನ್ನು ಆಯ್ಕೆಮಾಡಿ"
          boxStyles={{ width: 200 }}
          inputStyles={{color:'black'}} 
          dropdownTextStyles={{color:'black'}}
          dropdownStyles={{width:200}}
        />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 50,
            backgroundColor: 'white',
            height: 100,
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 25, padding: 10, color: 'rgb(71, 71, 72)', marginTop: 25 }}>ಬ್ರೇಕ್ಫಾಸ್ಟ್</Text>
          <Text
            style={{
              fontSize: 25,
              padding: 10,
              color: 'rgb(71, 71, 72)',
              borderWidth: 1,
              borderColor: 'black',
              borderRadius: 10,
              width: 70,
              height: 50,
              marginTop: 25,
            }}
          >
            {bfCount2}
          </Text>
          <Btn
            bgColor={'rgba(0, 160, 116, 1)'}
            BtnMgTop={25}
            textColor={'#FEF6E1'}
            btnLabel={'ಪಟ್ಟಿ'}
            btnwidth={70}
            btnHeight={50}
            txtmargin={7}
            btnMarginRight={18}
            Press={goToBfCart}
          />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
            backgroundColor: 'white',
            height: 100,
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 25, padding: 10, color: 'rgb(71, 71, 72)', marginTop: 25 }}>ಲಂಚ್</Text>
          <Text
            style={{
              fontSize: 25,
              padding: 10,
              color: 'rgb(71, 71, 72)',
              borderWidth: 1,
              borderColor: 'black',
              borderRadius: 10,
              width: 70,
              height: 50,
              marginTop: 25,
              marginLeft: 20,
            }}
          >
            {lunchCount2}
          </Text>
          <Btn
            bgColor={'rgba(0, 160, 116, 1)'}
            BtnMgTop={25}
            textColor={'#FEF6E1'}
            btnLabel={'ಪಟ್ಟಿ'}
            btnwidth={70}
            btnHeight={50}
            txtmargin={7}
            btnMarginRight={18}
            Press={goToLunchCart}
          />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
            backgroundColor: 'white',
            height: 100,
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 25, padding: 10, color: 'rgb(71, 71, 72)', marginTop: 25 }}>ಸ್ನಾಕ್ಸ್</Text>
          <Text
            style={{
              fontSize: 25,
              padding: 10,
              color: 'rgb(71, 71, 72)',
              borderWidth: 1,
              borderColor: 'black',
              borderRadius: 10,
              width: 70,
              height: 50,
              marginTop: 25,
              marginLeft: 23,
            }}
          >
            {snacksCount2}
          </Text>
          <Btn
            bgColor={'rgba(0, 160, 116, 1)'}
            BtnMgTop={25}
            textColor={'#FEF6E1'}
            btnLabel={'ಪಟ್ಟಿ'}
            btnwidth={70}
            btnHeight={50}
            txtmargin={7}
            btnMarginRight={18}
            Press={goToSnacksCart}
          />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
            backgroundColor: 'white',
            height: 100,
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 25, padding: 10, color: 'rgb(71, 71, 72)', marginTop: 25 }}>ಡಿನ್ನರ್</Text>
          <Text
            style={{
              fontSize: 25,
              padding: 10,
              color: 'rgb(71, 71, 72)',
              borderWidth: 1,
              borderColor: 'black',
              borderRadius: 10,
              width: 70,
              height: 50,
              marginTop: 25,
              marginLeft: 16,
            }}
          >
            {dinnerCount2}
          </Text>
          <Btn
            bgColor={'rgba(0, 160, 116, 1)'}
            BtnMgTop={25}
            textColor={'#FEF6E1'}
            btnLabel={'ಪಟ್ಟಿ'}
            btnwidth={70}
            btnHeight={50}
            txtmargin={7}
            btnMarginRight={18}
            Press={goToDinnerCart}
          />
        </View>
        <Btn
          bgColor={'#A0002C'}
          textColor={'#FEF6E1'}
          btnLabel={'ಚೆಕ್ಔಟ್'}
          btnwidth={windowWidth-60}
          btnHeight={60}
          txtmargin={11}
          BtnMgTop={50}
          Press={() => navigation.navigate('Checkout', { selected,selectedDates })}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default Cart;
