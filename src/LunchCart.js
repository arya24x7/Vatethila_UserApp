import React, { useState,useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const LunchCart = ({route}) => {

  const navigation = useNavigation(); 
  const {selected,updatedDates} = route.params;

  useEffect(() => {

    getBfItems();
  }, []);
 
let arrayCart=[];
  const [cartItems, setCartItems] = useState([]
    
    // Add more items as needed
  );


  const deleteItem = (itemId) => {
    const updatedItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedItems);
    console.log(cartItems);
    arrayCart = updatedItems.map(item => item.name);
    console.log('arr cart',arrayCart);
    createDocumentWithNestedCollection(arrayCart);
  };

  const createDocumentWithNestedCollection = async (arr) => {
    try {
      const currentUser = auth().currentUser;
  
      if (currentUser) {
        const userId = currentUser.uid;
  
        const parentCollectionRef = firestore().collection('orderDetails');
        const documentRef = parentCollectionRef.doc(userId);
        await documentRef.set({});
  
        const nestedCollectionRef = documentRef.collection(selected);
        const nestedDocRef = nestedCollectionRef.doc('details');
        
  
        const timeCollection = nestedDocRef.collection('ಲಂಚ್');
        const emptyArray = [];
        console.log('Document and nested collection created successfully.');
        
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
      
        console.log('arr',arr);
      } else {
        console.error('ಪ್ರಸ್ತುತ ಯಾವುದೇ ಬಳಕೆದಾರರು ಸೈನ್ ಇನ್ ಆಗಿಲ್ಲ.');
      }
    } catch (error) {
      console.log('Error creating document and nested collection:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.name}</Text>
      <TouchableOpacity onPress={() => deleteItem(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>ಅಳಿಸಿ</Text>
      </TouchableOpacity>
    </View>
  );

  

  const getBfItems = async () =>{
    try{
        const currentUser = auth().currentUser;
        if (currentUser) {
            const userId = currentUser.uid;
      
            const parentCollectionRef = firestore().collection('orderDetails');
        const documentRef = parentCollectionRef.doc(userId);
        const nestedCollectionRef = documentRef.collection(selected);
        console.log("date",selected);
        const nestedDocRef = nestedCollectionRef.doc('details');
        const timeCollection = nestedDocRef.collection('ಲಂಚ್');
  
        // Fetch the items array from Firestore
        const documentSnapshot = await timeCollection.doc('items').get();
        console.log('doc snapshot',documentSnapshot);
       let  arrayCart = documentSnapshot.data().name || [];
                let cartFormated = arrayCart.map((item, index) => {
                    return { id: index + 1, name: item };
                  });
                  setCartItems(cartFormated)

                  console.log("cartformatted",cartFormated);
                  

            
          } else {
            console.error('ಪ್ರಸ್ತುತ ಯಾವುದೇ ಬಳಕೆದಾರರು ಸೈನ್ ಇನ್ ಆಗಿಲ್ಲ');
          }
    }catch(e){
        console.error(e);
    }
  };
  


  return (
    <View style={styles.container}>
      <Text style={styles.heading}>ಕಾರ್ಟ್</Text>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyText}>ಕಾರ್ಟ್ ಖಾಲಿಯಾಗಿದೆ</Text>
      ) : (
        <FlatList
          data={cartItems}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      )}
      <TouchableOpacity style={{backgroundColor:'gray',width:140,borderRadius:10,marginBottom:20}} onPress={() =>navigation.navigate("Cart",{updatedDates})}>
        <Text style={{color:'white',marginBottom:10,marginTop:10,marginLeft:10}}>ಕಾರ್ಟ್ ಗೆ ಹಿಂತಿರುಗಿ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
      },
      heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color:'black'
      },
      emptyText: {
        fontSize: 18,
        textAlign: 'center',
        color:'black'
      },
      itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
      },
      itemName: {
        fontSize: 16,
        color:'black',
      },
      deleteButton: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        backgroundColor: 'red',
        borderRadius: 4,
      },
      deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
  },
});

export default LunchCart;