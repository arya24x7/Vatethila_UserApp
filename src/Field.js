import {View, StyleSheet, Text, TextInput } from 'react-native'
import React from 'react'


const Field = ({props,marginTxtField,placeHolder,bgcolor,bgradius,phTcolor,mrgLeft,wd,ht,mrgHori,val,setVal,secureEntry,clr,mrgRight,edit,scroll,keyboard}) => {
    return(
        <TextInput {...props} style={{borderRadius:bgradius,
        color:clr,paddingHorizontal:10,backgroundColor:bgcolor,marginTop:marginTxtField,width:wd,height:ht,alignSelf:'center',marginLeft:mrgLeft,marginHorizontal:mrgHori,marginRight:mrgRight}} placeholderTextColor={phTcolor} placeholder={placeHolder} value={val} onChangeText={setVal} secureTextEntry={secureEntry} editable={edit} scrollEnabled={scroll} keyboardType={keyboard} />
    );
}

const styles = StyleSheet.create({})

export default Field;