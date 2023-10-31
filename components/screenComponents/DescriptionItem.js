import React, { useEffect, useState } from 'react'
import { View,Image,StyleSheet, TouchableOpacity,Text, ScrollView } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import Entypo from 'react-native-vector-icons/Entypo'
import {RadioButton} from 'react-native-paper'
import { addDoc, collection, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { useUser } from '../context/UserContext'

const DescriptionItem = ({navigation,route}) => {
    const {data,note} = route.params;
    const {userCurrent} = useUser();
    
    const [selected, setSelected] = useState('');
    const [quantity, setQuatity] = useState(1);
    const [price, setPrice] = useState(data.price);

    useEffect(()=>{
        if(selected == 'M'){
            setPrice((data.price + 6000)*quantity)
        }
        else if(selected == 'L'){
            setPrice((data.price + 10000)*quantity)
        }
        else{
            setPrice(data.price*quantity)
        }
    },[selected, quantity]);

    const handleAddItem = async()=> {
        //tạo bảng orderItem
        try{

            const docRef = await addDoc(collection(db,"orderItem"),{
                idUser:userCurrent.id,
                name:data.name,
                img:data.urlImgItem,
                size:selected,
                quantity:quantity,
                price:price,
                note:note ? note : ''
            })
            await updateDoc(docRef,{id: docRef.id});
            navigation.goBack();
        }
        catch(error){
            console.error("Error adding order item document: ", error);
        }
    }

   

  return (
    <View style={{backgroundColor:'white',flex:1}}>
        <Image source={{uri:data.urlImgItem}}  style={styles.imgItem}/>
        <TouchableOpacity style={styles.iconX}
            onPress={()=>{navigation.goBack()}}
        >
            <Feather name='x' style={{fontSize:16,color:'white'}} />
        </TouchableOpacity>
        <View style={{marginHorizontal:10}} >
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                <Text style={styles.nameItem}>{data.name}</Text>
                <Text>{data.price}đ</Text>    
            </View>
            <Text style={styles.desItem}>{data.des}</Text>
            
            <TouchableOpacity
                style={styles.note}
                onPress={()=>{navigation.navigate('Note',{data:data,noteDefault:note})}}
            >
                <Feather name='file-text' style={styles.iconNote} />
                <Text style={{opacity:note ? 1 : 0.4 }}>{note? note : 'Bạn có gì muốn nhắn tới nhà hàng không?'}</Text>
            </TouchableOpacity>
        </View>
        <ScrollView>
            <View style={styles.option}>
                <Text style={styles.optionTitle}>Chọn kích cỡ</Text>
                <Text style={styles.optionSub}>Chọn ít nhất 1 mục</Text>
            </View>
            <RadioButton.Group onValueChange={value => setSelected(value)} value={selected}>
                <TouchableOpacity style={styles.radioBtn} onPress={() => setSelected('S')}>
                    <RadioButton value="S" status={selected == 'S' ? 'checked' :'unchecked'}/>
                    <View style={styles.textOption}>
                        <Text style={styles.textOptionStyle}>Cỡ S</Text>
                        <Text style={styles.textOptionStyle}>0đ</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity  style={styles.radioBtn}onPress={() => setSelected('M')}>
                    <RadioButton value="M" status={selected == 'M' ? 'checked' :'unchecked'}/>
                    <View style={styles.textOption}>
                        <Text style={styles.textOptionStyle}>Cỡ M</Text>
                        <Text style={styles.textOptionStyle}>6.000đ</Text>
                    </View>
                    
                </TouchableOpacity>
                <TouchableOpacity  style={styles.radioBtn} onPress={() => setSelected('L')}>
                    <RadioButton value="L" status={selected == 'L' ? 'checked' :'unchecked'}/>
                    <View style={styles.textOption}>
                        
                        <Text style={styles.textOptionStyle}>Cỡ L</Text>
                        <Text style={styles.textOptionStyle}>10.000đ</Text>
                    </View>
                </TouchableOpacity>
                
            </RadioButton.Group>
            
        </ScrollView>
        <View style={styles.bottom}>
            <View style={styles.quantity}>
                <TouchableOpacity onPress={()=>{setQuatity(quantity-1)}} disabled={quantity <= 1 ? true : false}>
                    <Entypo style={[styles.iconQuantity,{opacity: quantity <= 1 ? 0.5 : 1}]} name='minus' />
                </TouchableOpacity>
                <Text>{quantity}</Text>
                <TouchableOpacity onPress={()=>{setQuatity(quantity+1)}}>
                    <Entypo style={styles.iconQuantity}  name='plus' />
                </TouchableOpacity>

            </View>
            <TouchableOpacity 
                style={[styles.btn,{opacity: selected ? 1: 0.5}]} 
                disabled={selected ? false : true}
                onPress={handleAddItem}
                >
                
                <Text style={styles.btnText}>{selected ? 'Thêm - ' + price : 'Chọn size'}</Text>
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
    },
    option:{
        backgroundColor:'#E6F0FF',
        paddingVertical:10
    },
    optionTitle:{
        fontWeight:'bold',
        marginLeft:10,
        fontSize:16
        
    },
    optionSub:{
        color:'orange',
        marginLeft:10,
        fontSize:12
        
    },

    radioBtn:{
        flexDirection:'row',
        width:'100%',
        alignItems:'center',
        borderBottomWidth:1,
        borderBottomColor:'#E6F0FF',
        
    },
    textOption:{
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
        marginHorizontal:10,
    },
    textOptionStyle:{
        opacity:0.7
    },
    bottom:{
        flexDirection:'row',
        height:60,
        width:'100%',
        alignItems:'center',
        // elevation:1,
        // backgroundColor:'#FFE8E2'
    },
    quantity:{
        flexDirection:'row',
        width:'30%',
        justifyContent:'center'
    },
    iconQuantity:{
        fontSize:18,
        backgroundColor:'#E6F0FF',
        borderRadius:5,
        marginHorizontal:10,
        color:'#00B0BB'
    },
    btn:{
        width:'60%',
        backgroundColor:'#C67C4E',
        height:40,
        borderRadius:10,
        alignItems:'center',
        justifyContent:'center'
    },
    btnText:{
        fontWeight:'bold',
        color:'white'
    }
})

export default DescriptionItem
