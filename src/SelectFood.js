import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Alert,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import {
  Card,
  IconButton,
  FAB,
  Appbar,
  useTheme,
  Button,
  Modal,
} from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { Image, Placeholder, PlaceholderMedia } from 'react-native-elements';
import storage from '@react-native-firebase/storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const BOTTOM_APPBAR_HEIGHT = 90;
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

let clr;
const ArrayDates = [];
const SelectFood = ({ route }) => {
  const navigation = useNavigation();

  const { loc, selectedDates, todayDate } = route.params;

  const [visible, setVisible] = React.useState(false);
  const [dummyArr, setDummyArr] = React.useState([]);
  const [imageUrls, setImageUrls] = useState({});
  const [imageUrl, setImageUrl] = useState('');
  const [addBfCount, setAddBfCount] = React.useState('');
  const [addLunchCount, setAddLunchCount] = React.useState('');
  const [addDinnerCount, setAddDinnerCount] = React.useState('');
  const [addSnacksCount, setAddSnacksCount] = React.useState('');

  const [selectDate, setSelectDate] = React.useState('');
  const [dateArr, setDatesArr] = React.useState();


  const [chooseTime, setChooseTime] = React.useState('');
  const [selectItemType, setSelectItemType] = React.useState('');
  const { bottom } = useSafeAreaInsets();
  const theme = useTheme();

  const [isModalVisible, setModalVisible] = useState(false);
  const [clrArray, setArrColor] = useState([]);

  const [input, setInput] = useState("");
  // console.log(input)
  const [allFoodItem,setAllFoodItem] = React.useState([])  //setArrColor([]);




  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    createDocumentWithNestedCollection(dummyArr);
    setModalVisible(false);
  };

  var Time = [
    { key: '1', value: 'ಬ್ರೇಕ್ಫಾಸ್ಟ್' },
    { key: '2', value: 'ಲಂಚ್' },
    { key: '3', value: 'ಸ್ನಾಕ್ಸ್' },
    { key: '4', value: 'ಡಿನ್ನರ್' },
  ];

  var FoodType = [
    { key: '1', value: 'ಸ್ವೀಟ್ಸ್' },
    { key: '2', value: 'ರಸಾಯನ' },
    { key: '3', value: 'ಪಾಯಸ' },
    { key: '4', value: 'ಕಾಯಿಹುಳಿ' },
    { key: '5', value: 'ಅನ್ನ' },
    { key: '6', value: 'ಉಪ್ಪಿನಕಾಯಿ' },
    { key: '7', value: 'ಎಣ್ಣೆ ತಿಂಡಿಗಳು' },
    { key: '8', value: 'ಐಸ್‌ಕ್ರೀಮ್‌ಗಳು' },
    { key: '9', value: 'ಕೋಸಂಬ್ರಿ' },
    { key: '10', value: 'ಗಸಿ' },
    { key: '11', value: 'ಗೊಜ್ಜು' },
    { key: '12', value: 'ಚಟ್ನಿ' },
    { key: '13', value: 'ಡ್ರೈ ಚಟ್ನಿ' },
    { key: '14', value: 'ತಂಪು ಪಾನೀಯಗಳು' },
    { key: '15', value: 'ತಿಂಡಿಗಳು' },
    { key: '16', value: 'ತೆಳು ಸಾಂಬಾರು' },
    { key: '17', value: 'ನಾರ್ತ್ ಇಂಡಿಯನ್ ತಿಂಡಿಗಳು' },
    { key: '18', value: 'ಪಲ್ಯ' },
    { key: '19', value: 'ಪಾನೀಯಗಳು' },
    { key: '20', value: 'ಫ್ರುಟ್ಸ್ ಕಟ್ಟಿಂಗ್ಸ್' },
    { key: '21', value: 'ಮೆಣಸ್ಕಾಯಿ' },
    { key: '22', value: 'ವೆಜಿಟೆಬಲ್ ಕಟ್ಟಿಂಗ್ಸ್' },
    { key: '23', value: 'ಸಲಾಡ್‌ಗಳು' },
    { key: '24', value: 'ಸಾಂಬಾರು' },
    { key: '25', value: 'ಸಾರು' },
    { key: '26', value: 'ಸೈಡ್ ಐಟಮ್ಸ್' },
  ];

  const [foodList, setFoodList] = React.useState([]);
  const fetchImagesWithNames = async (itemName) => {
    try {
      const url = await storage()
        .ref(itemName)
        .getDownloadURL();

      return url;
    } catch (e) {
      // console.error("error getting image URL with .jpg extension", e);

    };
  }

  const fetchAllItems = async() => {
    const snapshot = await firestore().collection('menu2').get();
      let allItemList = [];
      // console.log("iam in",allItemList)
      
      snapshot.docs.forEach(async (doc) => {
        // console.log("hey",doc.data().item)

        
        if (doc.data().item) {
          await allItemList.push(doc.data().item)
          
        }
      });
      const oneDimensionalArray = allItemList.flat();
      const updatedAllFoodList = oneDimensionalArray.map((item, index) => {
        return { ID: index + 1, Name: item };
      
      });
      // console.log(allFoodItem)
      setAllFoodItem(updatedAllFoodList)
      // console.log("all item for url",updatedAllFoodList)
      
      
      
  }

  const urlFunc =async (Items)=>{
    console.log("items rec ",Items )
    
    const urls = {};
        for (const item of Items) {
          
          urls[item.Name] = await fetchImagesWithNames(item.Name);
          if(item.Name ==="ತೆಂಗಿನಕಾಯಿ ಹೋಳಿಗೆ"){
            // console.log("yaan ulle",urls[item.Name]);
          }
          
        }



        
        // console.log("url",urls["ತೆಂಗಿನಕಾಯಿ ಹೋಳಿಗೆ"])
        setImageUrls(urls);

  }

 useEffect(() => {
  if(input!==''){
  const filteredData = allFoodItem.filter(item => {
    // Convert item name to lowercase for case-insensitive search
    const itemName = item.Name;
    // Check if the item name contains the search term
    return itemName.includes(input);
});
// console.log(filteredData);
setFoodList(filteredData);
  }
  else{
    const unsubscribe = firestore()
      .collection('menu2')
      .doc(selectItemType)
      .onSnapshot(async documentSnapshot => {
        // console.log('User data: ', documentSnapshot.data().item);
        const res = documentSnapshot.data().item || [];
        // console.log('res', res);
        const updatedFoodList = res.map((item, index) => {
          return { ID: index + 1, Name: item };
        });
        setFoodList(updatedFoodList);

        // Fetch image URLs for all items
        // const urls = {};
        // for (const item of updatedFoodList) {
        //   urls[item.Name] = await fetchImagesWithNames(item.Name);
        // }
        // setImageUrls(urls);
      });

    return () => unsubscribe();
  
  }
 },[input,selectItemType]
 )
  
 useEffect(() => {
  fetchAllItems();
  
  
}, []);

// useEffect(() => {
  
//     urlFunc(allFoodItem);
//     console.log(imageUrls)
  
// }, [allFoodItem]);

// useEffect(() => {
  
//     // console.log("the main part",allFoodItem)
//     const unsubscribe = firestore()
//       .collection('menu2')
//       .doc(selectItemType)
//       .onSnapshot(async documentSnapshot => {
//         // console.log('User data: ', documentSnapshot.data().item);
//         const res = documentSnapshot.data().item || [];
//         // console.log('res', res);
//         const updatedFoodList = res.map((item, index) => {
//           return { ID: index + 1, Name: item };
//         });
//         setFoodList(updatedFoodList);

//         // Fetch image URLs for all items
//         // const urls = {};
//         // for (const item of updatedFoodList) {
//         //   urls[item.Name] = await fetchImagesWithNames(item.Name);
//         // }
//         // setImageUrls(urls);
//       });

//     return () => unsubscribe();
  
// }, [selectItemType]);



  //Orderlist creation start
  // console.log('dates', selectedDates);
  const updatedDates = selectedDates.map((item, index) => {
    return { key: (index + 1).toString(), value: item };
  });
  // console.log('newDates', updatedDates);


  const goToCart = () => {
    navigation.navigate('Cart', {
      updatedDates,
      addBfCount,
      addDinnerCount,
      addLunchCount,
      addSnacksCount,
      selectedDates
    });
  };


  //let arr=[]

  const addToCart = async name => {
    try {
      const currentUser = auth().currentUser;

      if (currentUser) {
        const userId = currentUser.uid;

        const parentCollectionRef = firestore().collection('orderDetails');
        const documentRef = parentCollectionRef.doc(userId);
        const nestedCollectionRef = documentRef.collection(selectDate);
        const nestedDocRef = nestedCollectionRef.doc('details');
        const timeCollection = nestedDocRef.collection(chooseTime);

        // Fetch the items array from Firestore
        const documentSnapshot = await timeCollection.doc('items').get();
        var arr = (await documentSnapshot.data().name) || [];
        // console.log('arr inside snapshot', arr);

        // Push the new item to the array
        if (!arr.includes(name)) {
          arr.push(name);
        } else {
          Toast.show({
            type: 'error',
            text1: 'ಐಟಂ ಅನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಅಳಿಸಲಾಗಿದೆ',
            position: 'bottom',
          });
        }
        // console.log('arr after push', arr);

        // Update the Firestore document with the updated array
        await createDocumentWithNestedCollection(arr);
        // console.log('dummy array in addToCart func', dummyArr);
        // console.log('arr after updating Firestore', arr);
        //console.log('clr', clr);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'ದಿನಾಂಕವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
        position: 'bottom',
      });
    }
  };

  const refreshArr = async () => {
    try {
      const currentUser = auth().currentUser;

      if (currentUser) {
        const userId = currentUser.uid;

        const parentCollectionRef = firestore().collection('orderDetails');
        const documentRef = parentCollectionRef.doc(userId);
        const nestedCollectionRef = documentRef.collection(selectDate);
        const nestedDocRef = nestedCollectionRef.doc('details');
        const timeCollection = nestedDocRef.collection(chooseTime);

        // Fetch the items array from Firestore
        const documentSnapshot = await timeCollection.doc('items').get();
        var arr = (await documentSnapshot.data().name) || [];
        // console.log('arr inside snapshot', arr);

        // Push the new item to the array

        // console.log('arr after push', arr);
        await setDummyArr(arr);


      }
    } catch (error) {
      console.error("refreshArr function error");
    }
  };

  // addtocart function end
  function btnColor(name) {
    try {
      if (dummyArr.includes(name)) {
        return 'red';
      } else {
        return 'green';
      }
    } catch (error) {
      return 'green';
    }
  }
  function btnIcon(name) {
    try {
      if (dummyArr.includes(name)) {
        return 'minus';
      } else {
        return 'plus';
      }
    } catch (error) {
      return 'plus';
    }
  }
  const createDocumentWithNestedCollection = async arr => {
    try {
      const currentUser = auth().currentUser;

      if (currentUser) {
        const userId = currentUser.uid;

        const parentCollectionRef = firestore().collection('orderDetails');
        const documentRef = parentCollectionRef.doc(userId);


        const nestedCollectionRef = documentRef.collection(selectDate);
        const nestedDocRef = nestedCollectionRef.doc('details');
        await nestedDocRef.set({
          bfCount: addBfCount,
          lunchCount: addLunchCount,
          snacksCount: addSnacksCount,
          dinnerCount: addDinnerCount,
          delivery: true,
          location: loc,
          name: '',
          phoneNum: '',
          orderDate: todayDate,
        });

        const timeCollection = nestedDocRef.collection(chooseTime);
        const emptyArray = [];
        // console.log('Document and nested collection created successfully.');

        const timeDocSnapshot = await timeCollection.doc('items').get();

        if (timeDocSnapshot.exists) {
          // If the chooseTime collection already exists, update the existing document
          await timeCollection.doc('items').update({
            name: arr,
          });
        } else {
          // If the chooseTime collection doesn't exist, create it and add the document
          await timeCollection.doc('items').set({
            name: emptyArray,
          });
        }
        setDummyArr(arr);
        setFoodList(foodList);
        setArrColor(dummyArr);

        //setButtonClr('green')
        // console.log('dummy array inside func', dummyArr);
        // console.log('arr', arr);
      } else {
        console.error('ಪ್ರಸ್ತುತ ಯಾವುದೇ ಬಳಕೆದಾರರು ಸೈನ್ ಇನ್ ಆಗಿಲ್ಲ.');
      }
    } catch (error) {
      // console.log('Error creating document and nested collection:', error);
    }
  };
  const handleTime = (valuetime) => {
    setChooseTime(valuetime);
  }
  const handleDate = (valueDate) => {
    setSelectDate(valueDate);
    ArrayDates.push(valueDate);
  }
  const deleteItem = (name) => {
    var dltarr = dummyArr;
    // console.log("dlt function started")

    const index = dltarr.indexOf(name);
    // console.log("index of item", index)
    if (index !== -1) {
      dltarr.splice(index, 1);



      // console.log('arr cart in dlt func', dltarr);
      createDocumentWithNestedCollection(dltarr);
      setDummyArr(dltarr)
    }
  };

  const buttonFunc = (name) => {
    try {
      console.log("btn func", dummyArr)
      if (dummyArr.includes(name)) {
        // console.log("deleteItem in btn func")

        return deleteItem(name);
      } else {
        // console.log("add cart in btn func")
        return addToCart(name);
      }
    } catch (error) {
      return addToCart(name);
    }

  }
  
  // orderlist creation end

  // console.log('foodlist', foodList);
  // console.log('items', selectItemType);
  // console.log('dummy array', dummyArr);

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <View style={{ height: windowHeight }}>

        <View style={{ marginTop: 20, marginBottom: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 20, marginHorizontal: windowWidth * 0.05 }}>
          <FontAwesome5 name="search" size={20} style={{ padding: 10, color: 'gray' }} />
          <TextInput
            value={input}
            onChangeText={(text) => setInput(text)}
            style={styles.searchBar}
            placeholder="Search"
            placeholderTextColor={'gray'}
            height={50}
            backgroundColor={'white'}
          // value={searchQuery}
          // onChangeText={setSearchQuery}
          />
        </View>
        
        <ScrollView nestedScrollEnabled={true} >
          <View
            style={{
              marginHorizontal: windowWidth * 0.05,
              marginTop: 30,
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginLeft: 20,
            }}>
            <SelectList
              data={updatedDates}
              setSelected={val => handleDate(val)}
              save="value"
              placeholder="ದಿನಾಂಕ"
              boxStyles={{ width: 87 }}
              inputStyles={{ color: 'black' }}
              dropdownTextStyles={{ color: 'black' }}
              maxHeight={150}
              onSelect={value => {


                createDocumentWithNestedCollection(value);
                refreshArr();
                // Call the refreshArr function here
              }}
            />
            <SelectList
              data={Time}
              setSelected={val => handleTime(val)}
              save="value"
              placeholder="ಸಮಯ"
              boxStyles={{ width: 95 }}
              inputStyles={{ color: 'black' }}
              dropdownTextStyles={{ color: 'black' }}
              maxHeight={150}
              defaultOption={{ key: 'ಬ್ರೇಕ್ಫಾಸ್ಟ್', value: 'ಬ್ರೇಕ್ಫಾಸ್ಟ್' }}
              onSelect={value => {
                createDocumentWithNestedCollection(value);
                refreshArr(); // Call the refreshArr function here
              }}
            />
            <SelectList
              data={FoodType}
              setSelected={val => setSelectItemType(val)}
              save="value"
              placeholder="ಆಹಾರದ ಪ್ರಕಾರ"
              boxStyles={{ width: 80 }}
              inputStyles={{ color: 'black' }}
              dropdownTextStyles={{ color: 'black' }}
              dropdownStyles={{ width: 100 }}
              maxHeight={150}
              defaultOption={{ key: 'ಸ್ವೀಟ್ಸ್', value: 'ಸ್ವೀಟ್ಸ್' }}
            />
          </View>
          {/* </ScrollView>
          <ScrollView nestedScrollEnabled={true} style={{...StyleSheet.absoluteFillObject, zIndex: 0}}> */}
          {/* <ScrollView style={{flex:1,marginTop:40}}> */}
          <FlatList
            data={foodList}
            style={{ flex: 1, marginTop: 40 }}
            renderItem={({ item }) => {

              return (
                <View style={{
                  margin: 5,
                  borderRadius: 10,
                  marginHorizontal: windowWidth * 0.05,
                  height: 150,
                  width: windowWidth - 35,
                  marginLeft: 15,
                  backgroundColor: "white"
                }}>
                  <View style={{ flexDirection: 'row', flex: 1, marginLeft: 20, justifyContent: 'space-between' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 15, marginTop: 65, color: "gray" }}>{item.Name}</Text>
                    {imageUrls[item.Name] ? (<Image source={{ uri: imageUrls[item.Name] }} style={{ width: 130, height: 130, marginTop: 10, marginBottom: 10, borderRadius: 10, marginRight: 10 }} />)
                      : (<Image source={require("./assets/no_food.jpeg")} style={{ width: 130, height: 130, marginTop: 10, marginBottom: 10, borderRadius: 10, marginRight: 10 }} />)}
                  </View>
                  <FAB
                    icon={btnIcon(item.Name)}
                    style={{
                      position: 'absolute',
                      marginRight: 10,
                      right: 0,
                      bottom: 0,
                      borderRadius: 50,
                      width: 50,
                      height: 50,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: btnColor(item.Name),
                    }}
                    small
                    color="white"
                    onPress={() => buttonFunc(item.Name)}
                  />
                </View>
              );
            }}
            keyExtractor={item => item.ID}
          />
          <View style={{
            margin: 5,
            borderRadius: 10,
            marginHorizontal: windowWidth * 0.05,
            height: 100,
            width: windowWidth - 35,
            marginLeft: 15,
            backgroundColor: "white"
          }}></View>
        </ScrollView>
        <Modal
          visible={isModalVisible}
          onRequestClose={closeModal}
          style={{
            height: 400,
            backgroundColor: 'white',
            marginTop: 150,
            marginHorizontal: 20,
            borderRadius: 10,
          }}>
          <IconButton
            icon="close"
            size={20}
            onPress={closeModal}
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              zIndex: 1, // Ensure the button is above other modal content
            }}
          />
          <Text
            style={{
              marginTop: 5,
              marginLeft: 130,
              fontSize: 30,
              color: 'black',
            }}>
            ಸಂಖ್ಯೆ
          </Text>
          <TextInput
            style={{
              backgroundColor: 'rgb(242, 242, 242)',
              marginTop: 10,
              marginHorizontal: 10,
              borderRadius: 10,
              color: 'black',
            }}
            placeholderTextColor={'black'}
            placeholder="ಬ್ರೇಕ್ಫಾಸ್ಟ್ ಎಣಿಕೆ ನಮೂದಿಸಿ"
            value={addBfCount}
            onChangeText={val => setAddBfCount(val)}
            keyboardType='numeric'
          />
          <TextInput
            style={{
              backgroundColor: 'rgb(242, 242, 242)',
              marginTop: 10,
              marginHorizontal: 10,
              borderRadius: 10,
              color: 'black',
            }}
            placeholderTextColor={'black'}
            placeholder="ಲಂಚ್ ಎಣಿಕೆ ನಮೂದಿಸಿ"
            value={addLunchCount}
            onChangeText={val => setAddLunchCount(val)}
            keyboardType='numeric'
          />
          <TextInput
            style={{
              backgroundColor: 'rgb(242, 242, 242)',
              marginTop: 10,
              marginHorizontal: 10,
              borderRadius: 10,
              color: 'black',
            }}
            placeholderTextColor={'black'}
            placeholder="ಸ್ನಾಕ್ಸ್ ಎಣಿಕೆ ನಮೂದಿಸಿ"
            value={addSnacksCount}
            onChangeText={val => setAddSnacksCount(val)}
            keyboardType='numeric'
          />
          <TextInput
            style={{
              backgroundColor: 'rgb(242, 242, 242)',
              marginTop: 10,
              marginHorizontal: 10,
              borderRadius: 10,
              color: 'black',
            }}
            placeholderTextColor={'black'}
            placeholder="ಡಿನ್ನರ್ ಎಣಿಕೆ ನಮೂದಿಸಿ"
            value={addDinnerCount}
            onChangeText={val => setAddDinnerCount(val)}
            keyboardType='numeric'
          />
          <Button style={{ marginTop: 10, width: 180, marginLeft: 80 }} buttonColor="gray" textColor="white" onPress={closeModal}>
            ಸಲ್ಲಿಸು
          </Button>
        </Modal>
        {/* <Toast /> */}
      </View>
      <View>
        <Appbar
          style={[
            styles.bottom,
            {
              height: BOTTOM_APPBAR_HEIGHT,
              backgroundColor: theme.colors.elevation.level2,
            },
          ]}
          safeAreaInsets={{ bottom }}>
          <Button
            icon="check"
            style={{ borderRadius: 10, marginLeft: 30 }}
            textColor="rgba(0, 0, 0, 1)"
            onPress={() => {
              openModal();
              setAddBfCount('');
              setAddLunchCount('');
              setAddSnacksCount('');
              setAddDinnerCount('');
            }}>
            ಅಂತಿಮಗೊಳಿಸಿ
          </Button>
          <Button
            icon="cart"
            style={{ borderRadius: 10, marginLeft: 80 }}
            buttonColor="#A0002C"
            textColor="#FEF6E1"
            onPress={goToCart}>
            ಕಾರ್ಟ್
          </Button>
        </Appbar>
      </View>
      <Toast />
      {/* Use foodList array in your component */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    // margin: 0,
    marginRight: 10,
    right: 0,
    bottom: 0,
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 160, 116, 1)',
  },
  fabExt: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(61, 61, 61, 1)',
    color: 'white',
  },
  bottom: {
    backgroundColor: 'aquamarine',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  // Styles for your component
});

export default SelectFood;