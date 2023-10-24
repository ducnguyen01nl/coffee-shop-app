import { addDoc, collection, deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import {View,StyleSheet,TouchableOpacity,Text, TextInput, ToastAndroid} from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { db } from '../../firebase';
import { useUser } from '../context/UserContext';
import { faL } from '@fortawesome/free-solid-svg-icons';

const ItemAddress = ({navigation,route}) => {
    const {data} = route.params;
    const {userCurrent} = useUser();

    const [name,setName] = useState(data ? data.name : '');
    const [address,setAddress] = useState(data ? data.address : '');
    const [note,setNote] = useState(data ? data.note : '');
    const [errorName,setErrorName] = useState('');
     
    console.log(data);
    // useEffect(() =>{
    //     if(name == ''){
    //         setErrorName('Tên không đươc để trống')
    //     }
    //     else(
    //         setErrorName('')
    //     )
    // },[name])

    const handleAddAddress = async() => {
        try {

            if(data){
                const docRef = await updateDoc(doc(db,"address",data.id),{
                    name:name,
                    address:address,
                    note:note,
                    active:false,
                })
                ToastAndroid.showWithGravity('Cập nhật chỉ thành công',ToastAndroid.SHORT,ToastAndroid.BOTTOM);

            }
            else{
                const docref = await addDoc(collection(db,"address"),{
                    name:name,
                    address:address,
                    note:note,
                    idUser:userCurrent.id
                })
                await updateDoc(docref,{id:docref.id})
                ToastAndroid.showWithGravity('Lưu địa chỉ thành công',ToastAndroid.SHORT,ToastAndroid.BOTTOM);

            }
            navigation.goBack();
        }
        catch(error){
            console.log(error);
        }


        
    }

    const handleDeleteAddress = async() =>{
        try{
            await deleteDoc(doc(db,'address',data.id))
            navigation.goBack();
        }
        catch(error){
            console.log(error);
        }
    }

  return (
    <View style={{backgroundColor:'white',height:'100%'}}>
      <View style={styles.headerTop}>
            <TouchableOpacity onPress={()=>navigation.goBack() }>
                <AntDesign name='arrowleft' style={{fontSize:24}} />
            </TouchableOpacity>
            <Text style={{fontWeight:'bold'}}>{data ? 'Sửa địa chỉ ': 'Thêm địa chỉ'}</Text>
            <View></View>
        </View>
        <View style={styles.content}>
            <View style={{marginBottom:30}}>
                <Text style={{fontWeight:'bold'}}>Tên*</Text>
                <TextInput placeholder='VD: Trường học, Phòng tập' defaultValue={data && data.name} onChangeText={(text) => setName(text)} style={styles.textInput} />
                <Text style={{display:errorName == '' ? 'none' : 'flex',color:'red'}}>{errorName}</Text>
            </View>
            <View style={{marginBottom:30}}>
                <Text style={{fontWeight:'bold'}}>Địa chỉ*</Text>
                <TextInput placeholder='Địa chỉ'  defaultValue={data && data.address} onChangeText={(text) => setAddress(text)}  style={styles.textInput} />
            </View>
            <View style={{marginBottom:30}}>
                <Text style={{fontWeight:'bold'}}>Ghi chú</Text>
                <TextInput placeholder='VD: Vào trong hẻm đối diện trường học' defaultValue={data && data.note} onChangeText={(text) => setNote(text)}  style={styles.textInput} />
            </View>

            {data ? 
                <TouchableOpacity style={{flexDirection:'row'}}
                    onPress={handleDeleteAddress}
                >
                    <AntDesign name='delete' style={{color:'red',fontSize:20, marginRight:10}} />
                    <Text style={{color:'red',fontWeight:'bold'}}>Xóa địa chỉ này</Text>
                </TouchableOpacity> 
            : null}
            
        </View>
        <View style={styles.btn}>
            <TouchableOpacity style={styles.btnSave} onPress={handleAddAddress}>
                <Text style={styles.btnText}>Lưu địa chỉ</Text>
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
        marginHorizontal:10,
        backgroundColor:'white',
        
    },
    content:{
        marginHorizontal:10,
        marginTop:30,
    },
    textInput:{
        height:50,
        borderBottomWidth:1,
        borderBottomColor:'gray',
        // fontSize:18
    },
    btn:{
        flex:1,
        position:'absolute',
        bottom:20,
        width:'100%',
        justifyContent:'center',
        alignItems:'center'
    },
    btnSave:{
        width:'90%',
        backgroundColor:'#76FEFF',
        height:40,
        justifyContent:'center',
        textAlign:'center',
        borderRadius:10,
    },
    btnText:{
        color:'white',
        justifyContent:'center',
        fontWeight:'bold',
        textAlign:'center'
    }
})

export default ItemAddress
