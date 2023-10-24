import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { View,Text,StyleSheet, TouchableOpacity } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import Feather from 'react-native-vector-icons/Feather'
import { db } from '../../firebase'
import { useUser } from '../context/UserContext'
import { useFocusEffect } from '@react-navigation/native'

const ChooseAddress = ({navigation}) => {

    
    const {userCurrent} = useUser();
    const [listAddress,setListAddress] = useState(null);

    const getListAddress = async() => {
        try{
            const addresses = [];
            const listRef = collection(db,'address');
            const q = query(listRef,where('idUser','==',userCurrent.id));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                addresses.push(doc.data());
            });

            if (addresses.length > 0) {
                setListAddress(addresses);
            } else {
                setListAddress([]);
                console.log('Không tìm thấy địa chỉ với idUser ', userCurrent.id);
            }
            
        }catch(error){
            console.log(error);
        }
    }
    useFocusEffect(
        React.useCallback(()=>{
            getListAddress();
        })
    )

    //cập nhật lại mỗi khi focus vào page
    // useFocusEffect(
    //     React.useCallback(()=>{
    //         getListAddress();
    //     },[])
    // )
    const handleActiveAddress = (id) =>{
        // try{
        //     const listRef = collection(db,'address');
        //     const q = query(listRef,where('idUser','==',userCurrent.id));
        //     const querySnapshot = await getDocs(q);
        //     if(!querySnapshot.empty){
              
        //       querySnapshot.forEach(async(docData) => {
            listAddress.forEach(async(item) =>{

                if(item.id == id){
                    await updateDoc(doc(db,'address',item.id),{
                        active:true
                    });
                }
                else{
                    await updateDoc(doc(db,'address',item.id),{
                        active:false
                    });
                }
            })
        //       });
              
        //     }
    
        // }catch(error){
        //     console.log(error);
        // }
        navigation.goBack();
    }

  return (
    <View>
        <View style={styles.headerTop}>
            <TouchableOpacity onPress={()=>navigation.goBack() }>
                <AntDesign name='arrowleft' style={{fontSize:24}} />
            </TouchableOpacity>
            <Text style={{fontWeight:'bold'}}>Chọn địa chỉ đã lưu</Text>
            <View></View>
        </View>
        <View style={styles.content}>
            <View style={styles.topContent}>
                <Text>Địa điểm của tôi</Text>
                <Text>{listAddress != null ? listAddress.length : '0'}/5</Text>
            </View>
            <View>
                {listAddress != null && listAddress.map((data,index) => (
                    <View key={index} style={styles.itemAddress}>
                        <TouchableOpacity 
                            onPress={() =>{handleActiveAddress(data.id)}}
                            style={{flexDirection:'row',alignItems:'center'}}>
                            <Feather name='map-pin' style={{fontSize:24, marginRight:10}} />
                            <View>
                                <Text>{data.name}</Text>
                                <Text style={{opacity:0.5}}>{data.address}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={()=> navigation.push("ItemAddress",{data:data})}
                        >
                            <Entypo name='pencil' style={{fontSize:24, marginRight:10}} />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
            <TouchableOpacity 
                onPress={()=> navigation.push("ItemAddress",{data:null})}
                style={styles.bottomContent}>
                <Entypo name='plus' style={{fontSize:24, marginRight:10,color:'#76FEFF'}} />
                <Text style={{color:'#76FEFF'}}>Thêm địa chỉ</Text>
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
    content:{
    },
    topContent:{
        // backgroundColor:'#ECF6F8',
        height:50,
        flexDirection:"row",
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal:10
    },

    itemAddress:{
        backgroundColor:'white',
        height:60,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal:10
    },

    bottomContent:{
        flexDirection:'row',
        paddingHorizontal:10,
        backgroundColor:'white',
        height:50,
        alignItems:'center',
        borderTopWidth:1,
        borderColor:'gray'
    }
})

export default ChooseAddress
