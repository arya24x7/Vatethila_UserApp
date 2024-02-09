import {View, ImageBackground, StyleSheet } from 'react-native'
import React from 'react'

const Background = ({children,img,backgroundImgHeight,imgOpacity}) => {
    return(
        <View>
            <ImageBackground source={img} style={{height:backgroundImgHeight,opacity:imgOpacity,backgroundColor:'black',color:'black',resizeMode:'contain',}}/>
            <View style={{position:"absolute"}}>
                {children}
            </View>
        </View>
    );
}
export default Background;