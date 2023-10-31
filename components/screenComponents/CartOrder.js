import React, { useState } from 'react'
import { View,StyleSheet, TouchableOpacity,Text } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import Entypo from 'react-native-vector-icons/Entypo'

const CartOrder = ({route,navigation}) => {
    const {listOrder} = route.params;
    const [quantity,setQuatity] = useState(null);

    const handleChangeQuantity = (data,type) =>{
        const priceOnePiece = data.price/data.quantity;
        if(type == 0){
            setQuatity(quantity - 1);
        }
        else if(type == 1){
            setQuatity(quantity + 1);
        }
    }

  return (
    <View>
      <View style={styles.headerTop}>
        <TouchableOpacity 
            onPress={()=>{navigation.goBack()}}
        >
            <Feather name='x' style={styles.iconX} />
        </TouchableOpacity>
        <Text>Giỏ hàng</Text>
        <TouchableOpacity>
            <Text style={styles.textDelete}>Xóa</Text>
        </TouchableOpacity>
      </View>
      <View>
        {listOrder.map((data,index)=>(
            <View key={index} style={styles.containerItem}>
                <View style={styles.infoItem}>
                    <Text style={styles.textName}>{data.name}</Text>
                    <Text style={styles.textSize}>Size {data.size}</Text>
                </View>
                <View style={styles.price}>
                    <Text>{data.price}đ</Text>
                    <View style={styles.quantity}>
                        <TouchableOpacity 
                            onPress={()=>{
                                
                                handleChangeQuantity(data,type=0)}} >
                            <Entypo style={styles.iconQuantity} name='minus' />
                        </TouchableOpacity>
                        <Text>{quantity ? quantity : data.quantity}</Text>
                        <TouchableOpacity 
                            onPress={()=>{
                                handleChangeQuantity(data,type=1)}}>
                            <Entypo style={styles.iconQuantity}  name='plus' />
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    headerTop:{
        flexDirection:'row',
        height:46,
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal:10,
        backgroundColor:'white',
        borderBottomWidth:1,
        borderBottomColor:'#cad1d5',
        
    },
    iconX:{
        fontSize:20
    },
    textDelete:{
        color:'red',
        fontSize:12
    },
    containerItem:{
        backgroundColor:'white',
        backgroundColor:'white',
        borderBottomWidth:1,
        borderBottomColor:'#cad1d5',
        paddingVertical:10
        
    },
    infoItem:{
        marginHorizontal:10

    },
    textName:{  
        fontWeight:'bold'
    },
    textSize:{
        fontSize:12,
        opacity:0.7
    },
    price:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginHorizontal:10,
        marginTop:10
    },
    quantity:{
        flexDirection:'row',
        width:'30%',
        justifyContent:'center',
    },
    iconQuantity:{
        fontSize:18,
        backgroundColor:'#E6F0FF',
        borderRadius:5,
        marginHorizontal:10,
        color:'#00B0BB'
    },
})

export default CartOrder
