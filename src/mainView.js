import { View, StyleSheet, Text, TouchableOpacity, Keyboard, Alert, TextInput, Modal, Button, Dimensions, ActivityIndicator, ScrollView } from 'react-native'
import React from 'react'
import Background from './Background';
import Btn from './Btn';
import Field from './Field';
import firestore from '@react-native-firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateRangePicker from "rn-select-date-range";
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { FlatList } from 'react-native';


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;


const MainView = (props) => {

  const navigation = useNavigation();

  const sendData = firestore().collection('test');
  const [addLoc, setAddLoc] = React.useState('');
  const [addDateFrom, setAddDateFrom] = React.useState('');
  const [addDateTo, setAddDateTo] = React.useState('');

  const [openStartDatePicker, setOpenStartDatePicker] = React.useState(false);
  const [selectedRange, setRange] = React.useState({});

  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [selectedDates, setSelectedDates] = React.useState([]);
  const [textInputValue, setTextInputValue] = React.useState('');

  const [loading, setLoading] = React.useState(false);


  const handleConfirm = (event, date) => {
    if (date !== undefined) {
      const selectedDate = date.toISOString().split('T')[0];
      if (!selectedDates.includes(selectedDate) && selectedDate !== getTodayDate()) {
        const updatedSelectedDates = [...selectedDates, selectedDate];
        setSelectedDates(updatedSelectedDates);
        setTextInputValue(updatedSelectedDates.join(' \n'));
        console.log(textInputValue)
      }
    }
    setShowDatePicker(false);
  };

  const handleTextInputPress = () => {
    setShowDatePicker(true);
  };


  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const todayDate = getTodayDate();

  // console.log("todays date",todayDate);



  React.useEffect(() => {
    // getDatabase();
  }, []);

  const addField = async () => {
    try {
      const loc = await firestore()
        .collection('test')
        .add({
          location: addLoc,
          dateFrom: addDateFrom,
          dateTo: addDateTo,
        })
        .then(() => {
          console.log('User updated!');
        });
      // setMyData(flagVal);
    } catch (err) {
      console.log(err);

    }

  }

  const btnPressed = () => {

    if (addLoc == '' && selectedDates == '') {
      Toast.show({
        type: 'error',
        text1: 'ಸ್ಥಳ ಮತ್ತು ದಿನಾಂಕಗಳನ್ನು ನಮೂದಿಸಿ',
        position: 'bottom',
      });
    } else if (addLoc == '') {
      Toast.show({
        type: 'error',
        text1: 'ಸ್ಥಳವನ್ನು ನಮೂದಿಸಿ',
        position: 'bottom',
      });
    } else if (selectedDates == '') {
      Toast.show({
        type: 'error',
        text1: 'ದಿನಾಂಕಗಳನ್ನು ನಮೂದಿಸಿ',
        position: 'bottom',
      });
    } else {
      addField();
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigation.navigate('SelectFood', { loc: addLoc, selectedDates, todayDate });
      }, 6000); // delay of 6 seconds
    }
    // props.navigation.navigate("SelectFood")
  };

  const clear = () => {
    setSelectedDates([]);
    setTextInputValue('');
  };

  return (
    <SafeAreaView>

      <View style={{ backgroundColor: 'black', width: windowWidth }}>
        <Background img={require('./assets/food4.webp')} marginLeft backgroundImgHeight={'100%'} imgOpacity={0.35}>
          <View style={styles.inputContainer}>
            <FontAwesome5 name="map-marker-alt" size={20} style={styles.icon} />
            <Field bgcolor={'rgba(128,128,128,0.1)'} bgradius={10} placeHolder={'ಸ್ಥಳವನ್ನು ನಮೂದಿಸಿ'} phTcolor={'white'} wd={windowWidth - 80} ht={58} setVal={(location) => setAddLoc(location)} val={addLoc} clr={'white'}></Field>
          </View>
          <View style={{ flexDirection: 'row', alignItems: "center" }}>
            {/* <TouchableOpacity style={{backgroundColor:'rgba(128,128,128,0.5)',marginTop:40,marginLeft:25,w2idth:250,height:58,borderRadius:10}} onPress={handleTextInputPress}> */}
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(128,128,128,0.5)', borderRadius: 10, marginHorizontal: windowWidth * 0.06, marginTop: 30, padding: 10, width :windowWidth -140 }}>
    <FontAwesome5 name="calendar" size={20} style={styles.icon}  />

    <FlatList
        data={selectedDates }
        renderItem={({ item }) => (
            <Text style={{ color: 'white', marginVertical: 10 }}>{item}</Text>
        )}
        keyExtractor={(item, index) => index.toString()}
        style={{ maxHeight: 100 }} // Set maximum height for scrolling
    />
</View>

            <TouchableOpacity style={{ backgroundColor: 'green', width: 58, height: 58, borderRadius: 10, marginTop: 30, marginHorizontal: windowWidth * 0.04 }} onPress={handleTextInputPress}>
              <FontAwesome5 name='plus' size={20} style={{ color: 'white', marginHorizontal: 20, marginVertical: 20 }} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={{ backgroundColor: '#A0002C', width: 98, height: 48, borderRadius: 10, marginTop: 30, marginHorizontal: windowWidth - 230 }} onPress={clear}>
            <Text style={{ color: '#FEF6E1', marginHorizontal: 28, marginVertical: 13 }}>Clear</Text>
          </TouchableOpacity>
          <Btn bgColor={'#A0002C'} textColor={'#FEF6E1'} btnLabel={"ಮುಂದುವರಿಸಿ"} btnwidth={windowWidth - 60} btnHeight={60} txtmargin={11} btnMarginleft={28} BtnMgTop={140} Press={() => btnPressed()} />
          <View style={{ alignItems: 'flex-end', marginTop: 20, marginLeft: 90 }}>
          </View>
          {loading &&
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" />
            </View>
            // <ActivityIndicator size="large"/>
          }

          {/* Modal for datepicker */}
          {showDatePicker && (
            <DateTimePicker
              mode="date"
              display="calendar"
              value={new Date()}
              minimumDate={new Date()} // Set minimum date to today's date
              onChange={handleConfirm}
            />
          )}
        </Background>
        <Toast />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(128,128,128,0.5)',
    borderRadius: 10,
    marginTop: 200,
    marginHorizontal: windowWidth * 0.06,
    width: windowWidth - 45,
  },
  icon: {
    padding: 10,
    color: 'white',
  },
  loadingContainer: {
    position: 'absolute',
    // bottom: 0.01, // Adjust this value to position the indicator as per your requirement
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0)',
    marginTop: windowHeight - 100
  },
})

export default MainView;