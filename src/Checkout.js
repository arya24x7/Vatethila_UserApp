import {View, StyleSheet, Text} from 'react-native'
import React from 'react'
import { RadioButton } from 'react-native-paper';
import Field from './Field';
import Btn from './Btn';
import Dialog from "react-native-dialog";
import { SafeAreaView } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import Toast from 'react-native-toast-message';

const {width, height} = Dimensions.get('window');

const Checkout = ({route}) => {
    const navigation = useNavigation(); 

    const {selected,selectedDates} = route.params;
    const [name,setName] = React.useState('');
    const [phoneNo,setPhoneNo] = React.useState('');

    const [checked, setChecked] = React.useState('first')

    const [visible, setVisible] = React.useState(false);

    

    const showDialog = () => {
        btnPressed();
        
    };

    const closeDialog = () => {
        setVisible(false);
        navigation.navigate("MainView")
    };

    const setValues = async () => {
      try {
        const currentUser = auth().currentUser;
    
        if (currentUser) {
          const userId = currentUser.uid;
          const parentCollectionRef = firestore().collection('orderDetails');
          const documentRef = parentCollectionRef.doc(userId);
    
          // Get the current data
          const documentSnapshot = await documentRef.get();
          const dataStatus = documentSnapshot.data();
          let tempselectedDates = selectedDates;
          // Initialize or update the selectedDates array
          if (dataStatus && dataStatus.dates) {
            console.log("Appending:", dataStatus.dates);
            tempselectedDates = await dataStatus.dates.concat(selectedDates);
            console.log("after append",tempselectedDates) // Append to existing dates
          } else {
            console.log("Not Appending:", tempselectedDates);
          }
    
          // Set the 'dates' field
          await documentRef.set({ dates: tempselectedDates });
    
          // Update the details in a nested collection
          const nestedCollectionRef = documentRef.collection(selected);
          const nestedDocRef = nestedCollectionRef.doc('details');
          await nestedDocRef.update({
            delivery: boolVal,
            name: name,
            phoneNum: phoneNo,
          });
        } else {
          console.log("No current user.");
        }
      } catch (e) {
        console.error("Error:", e);
      }
    };
    

    let boolVal;

    const btnPressed = () => {
         if(checked=='first'){
            boolVal = false;
         }
         else{
            boolVal= true;
         }
        if(name == '' && phoneNo=='' ){
          Toast.show({
            type: 'error',
            text1: 'ಹೆಸರು ಮತ್ತು ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ',
            position: 'bottom',
            bottomOffset:0
          });
          // console.error("ಹೆಸರು ಮತ್ತು ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ")
        }else if(name == ''){
          Toast.show({
            type: 'error',
            text1: 'ಹೆಸರನ್ನು ನಮೂದಿಸಿ',
            position: 'bottom',
            bottomOffset:0
          });
          // console.error("ಹೆಸರನ್ನು ನಮೂದಿಸಿ")
        }else if(phoneNo==''){
          Toast.show({
            type: 'error',
            text1: 'ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ',
            position: 'bottom',
            bottomOffset:0
          });
          // console.error("ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ")
        }else{
          setValues();
          setVisible(true);
          //console.log(selectedDates);
        }
        

    }

    



    return(
        <SafeAreaView>
        <View>
            <Text style={{fontSize:40,fontWeight:400,color:'#3D3D3D',marginTop:85,marginHorizontal:28}}>ಚೆಕ್ಔಟ್</Text>
            <Field placeHolder={'ಹೆಸರು'} marginTxtField={52} bgcolor={'#FFFFFF'} bgradius={10} phTcolor={'rgba(61, 61, 61, 0.5)'} wd={320} ht={58} val={name} setVal={(val) => setName(val)} clr={'black'}></Field>
            <Field placeHolder={'ವಾಟ್ಸಾಪ್ ಫೋನ್ ಸಂಖ್ಯೆ'} marginTxtField={30} bgcolor={'#FFFFFF'} bgradius={10} phTcolor={'rgba(61, 61, 61, 0.5)'} wd={320} ht={58} val={phoneNo} setVal={(val) => setPhoneNo(val)} clr={'black'} keyboard={'numeric'}></Field>
            <View style={{flexDirection:"row",alignItems:'center',marginTop:80}}>
                <View style={{flex:4,marginLeft:50}}>
                    <Text style={{fontSize:20,color:'black'}}>ಸ್ಥಳದಲ್ಲಿ ಅಡುಗೆ</Text>
                </View>
                <View style={{flex:1,marginRight:30}}>
                    <RadioButton
                        value="first"
                        color='black'
                        status={ checked === 'first' ? 'checked' : 'unchecked' }
                        onPress={() => setChecked('first')}
                    />
                </View>
            </View>
            <View style={{flexDirection:"row",alignItems:'center',marginTop:30}}>
                <View style={{flex:4,marginLeft:50}}>
                    <Text style={{fontSize:20,color:'black'}}>ವಿತರಣೆ</Text>
                </View>
                <View style={{flex:1,marginRight:30}}>
                    <RadioButton
                        style={{}}
                        color='black'
                        value="second"
                        status={ checked === 'second' ? 'checked' : 'unchecked' }
                        onPress={() => setChecked('second')}
                    />
                </View>
            </View>
            <Btn bgColor={'#A0002C'} textColor={'#FEF6E1'} btnLabel={"ಉದ್ಧರಣವನ್ನು ವಿನಂತಿಸಿ"} btnwidth={width-60} btnHeight={60} txtmargin={11} btnMarginleft={width*0.075}  BtnMgTop={80} Press={showDialog}/>
            <Dialog.Container visible={visible}>
                <Dialog.Title>ಅಭಿನಂದನೆಗಳು</Dialog.Title>
                <Dialog.Description>
                    ಉದ್ಧರಣ ವಿನಂತಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಕಳುಹಿಸಲಾಗಿದೆ!
                </Dialog.Description>
                <Dialog.Button label="ಮುಚ್ಚಿ" onPress={closeDialog} />
      </Dialog.Container>
        
        </View>
        <Toast />
        </SafeAreaView>
        
    );
}

const styles = StyleSheet.create({})

export default Checkout;