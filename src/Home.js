import {View, StyleSheet, Text } from 'react-native'
import React from 'react'
import Background from './Background';
import Btn from './Btn';
import { SafeAreaView } from 'react-native-safe-area-context';

const Home = (props) => {
    return(
        <SafeAreaView>
        <View style={{backgroundColor:'black'}}>
        <Background img={require('./assets/food4.webp')} backgroundImgHeight={'100%'} imgOpacity={0.35}>
            <View style={{marginHorizontal:10,marginVertical:420}}>
                <Text style={{fontSize:18,color:'#FEF6E1',fontWeight:'bold',height:30}}>ವಾಟೆತ್ತಿಲ ಕ್ಯಾಟರಿಂಗ್</Text>
                <Text style={{fontSize:50,color:'#FEF6E1',fontWeight:'bold',marginTop:5,height:80}}>ಸ್ವಾಗತ!</Text>
                <Text style={{fontSize:13,color:'#FEF6E1',fontWeight:'bold',marginTop:15,height:50}}>ನಮ್ಮ ಅಡುಗೆ ಸೇವೆಗಳೊಂದಿಗೆ ನಿಮ್ಮ ಕಡುಬಯಕೆಗಳನ್ನು ಪೂರೈಸಿಕೊಳ್ಳಿ!</Text>
                <Btn bgColor={'#A0002C'} textColor={'#FEF6E1'} btnLabel={"ಪ್ರಾರಂಭಿಸಿ!"} btnwidth={330} btnHeight={51} txtmargin={10} BtnMgTop={40} Press={() => props.navigation.navigate("Login")}/>
            </View>
        </Background>
        </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({})

export default Home;