import React from 'react'
import { View,Image,StyleSheet, TouchableOpacity,Text } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const DescriptionItem = ({navigation,route}) => {
    const {data,note} = route.params;
    console.log(data);
  return (
    <View style={{backgroundColor:'white',flex:1}}>
        <Image source={{uri:data.urlImgItem}}  style={styles.imgItem}/>
        <TouchableOpacity style={styles.iconX}
            onPress={()=>{navigation.goBack()}}
        >
            <Feather name='x' style={{fontSize:16,color:'white'}} />
        </TouchableOpacity>
        <View style={{marginHorizontal:10}}>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                <Text style={styles.nameItem}>{data.name}</Text>
                <Text>{data.price}đ</Text>    
            </View>
            <Text style={styles.desItem}>{data.des}</Text>
            <TouchableOpacity
                style={styles.note}
                onPress={()=>{navigation.navigate('Note',{data:data,noteDefault:note})}}
            >
                <MaterialCommunityIcons name='note-text-outline' style={styles.iconNote} />
                <Text style={{opacity:note ? 1 : 0.4 }}>{note? note : 'Bạn có gì muốn nhắn tới nhà hàng không?'}</Text>
            </TouchableOpacity>
            
        </View>
      
    </View>
  )
}

const styles = StyleSheet.create({
    imgItem:{
        width:200,
        height:200,
        resizeMode:'stretch',
        alignSelf:'center'
    },
    iconX:{
        backgroundColor:'#c8c9ca',
        width:25,
        height:25,
        borderRadius:100,
        alignItems:'center',
        justifyContent:'center',
        position:'absolute',
        top:10,
        left:5
        
    },
    nameItem:{
        fontSize:26,
        fontWeight:'bold'
    },
    desItem:{
        opacity:0.7
    },
    note:{
        marginVertical:10,
        flexDirection:'row',
        alignItems:'center'
    },
    iconNote:{
        fontSize:24,
        marginRight:10
    }
})

export default DescriptionItem
