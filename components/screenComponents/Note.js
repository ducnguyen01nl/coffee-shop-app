import React, { useState } from 'react'
import { View,TouchableOpacity,Text,StyleSheet, TextInput } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'

const Note = ({navigation,route}) => {
    const {data,noteDefault} = route.params;
    const [note,setNote] = useState(noteDefault?noteDefault:'');

  return (
    <View style={{backgroundColor:'white',flex:1}}>
        <View style={styles.headerTop}>
            <TouchableOpacity onPress={()=>navigation.navigate('DescriptionItem',{data:data}) }>
            <Ionicons name='close-outline' style={{fontSize:35}} />
            </TouchableOpacity>
            <Text style={{fontWeight:'bold'}}>Lưu ý tới cửa hàng</Text>
            <View></View>
        </View>
        <TextInput style={styles.inputText}  
            multiline={true}
            numberOfLines={4} 
            placeholder='Ví dụ: Nhiều đá,...' 
            value={note} 
            onChangeText={(text)=>{setNote(text)}}
        />
        <View style={styles.bottom}>
            <View style={styles.noteWarning}>
                <Entypo name='warning' style={{fontSize:18,marginRight:10}} />
                <Text style={{fontSize:12}}>Cửa hàng chỉ có thể đáp ứng những yêu cầu phù hợp/trong khả năng</Text>
            </View>
            <TouchableOpacity
                style={[styles.btn,{ opacity: note.trim() ? 1 : 0.5 }]}
                disabled={!note.trim()}
                onPress={()=>{navigation.navigate('DescriptionItem',{data:data,note:note})}}
            >
                <Text style={{color:'white',fontWeight:'bold'}}>Thêm</Text>
            </TouchableOpacity>
        </View>
      
    </View>
  )
}
const styles = StyleSheet.create({
    headerTop:{
        height:50,
        // borderWidth:1,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal:10,
        backgroundColor:'white'
    },
    inputText:{
        margin:10,
        
    },
    bottom:{
        position:'absolute',
        width:'100%',
        bottom:10,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center'
    },
    noteWarning:{
        width:'90%',
        alignItems:'center',
        backgroundColor:'#E6F0FF',
        padding:10,
        flexDirection:'row',
        borderRadius:10,
        opacity:0.6
    },
    btn:{
        height:40,
        backgroundColor:'#C67C4E',
        width:'90%',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        marginTop:10
    }
})

export default Note
