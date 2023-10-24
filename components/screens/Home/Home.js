
import React, { useEffect, useState } from 'react'
import { View,Text,StyleSheet,Image, TouchableOpacity } from 'react-native'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import TabListView from '../../screenComponents/TabListView'
import { useUser } from '../../context/UserContext'
import { collection, doc, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../../firebase'
import { useFocusEffect } from '@react-navigation/native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import ListItemView from '../../screenComponents/ListItemView'
const Home = ({navigation}) => {

  const {userCurrent,setUserCurrent,imgUser} = useUser();
  const [addressActive,setAddressActive] = useState("");
  const [nameActive,setNameActive] = useState("");
  const [listAddress,setListAddress] = useState("");
  const addresses = [];
  // const [imageUrl,setImageUrl] = useState('');

  // const reference = storage().ref('/images/' + userCurrent.img);
  
  
  // useEffect(()=>{
      
  //     const storage = getStorage();
  //     const starsRef = ref(storage,'images/'+userCurrent.img);
    
  //   // Get the download URL
  //   getDownloadURL(starsRef)
  //   .then((url) => {
  //       setImageUrl(url);
  //     // Insert url into an <img> tag to "download"
  //     // setUserCurrent({...userCurrent,imgUser:url})
  //   }) 
  //   .catch((error) => {
  //     console.log('lỗi'+ error);
  //   });

  // },[])

  // const getListAddress = async() =>{
  //   try {
  //     const addressDocRef = collection(db,'address');
  //     const q = query(addressDocRef,where('id','==',userCurrent.id))
  //     const querySnapshot = await getDocs(q);
  //     if(!querySnapshot.empty){
  //       setAddressActive(querySnapshot.docs[0]);
  //       console.log(querySnapshot.docs[0]);
  //       querySnapshot.forEach(doc =>{
  //         if(doc.data().active == true){
  //           setAddressActive(doc.data().address);
  //           console.log(doc.data.address);
  //         }
  //       })
  //     }
      
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  const getListAddress = async() => {
    try{
        
        const listRef = collection(db,'address');
        const q = query(listRef,where('idUser','==',userCurrent.id));
        const querySnapshot = await getDocs(q);
        if(!querySnapshot.empty){
          
          querySnapshot.forEach((doc) => {
            addresses.push(doc.data());
            if(doc.data().active){ 
              setAddressActive(doc.data().address);
              setNameActive(doc.data().name);
            }
          });
          setListAddress(addresses)
        }else{
          setAddressActive('Thêm địa chỉ')
        }

    }catch(error){
        console.log(error);
    }
}

  useFocusEffect(
    React.useCallback(()=>{
      getListAddress();
    },[])
  )
   

  return (
    <View style={{backgroundColor:'white',height:'100%'}}>
      <View style={styles.topHome}>
        <View style={styles.infoUser}>
          <TouchableOpacity onPress={()=>{navigation.push('ChooseAddress')}} >
            {/* <Text style={{color:'white',opacity:0.8}}>Địa chỉ</Text> */}
            <View style={{flexDirection:'row'}}>
              <FontAwesome5 name='map-marker-alt' style={styles.iconMap}/>
              <Text style={{color:'white'}}>{nameActive}</Text>
            </View>
            <View style={{flexDirection:'row'}}>
              <Text style={{color:'white',opacity:0.8}}>{addressActive}</Text>
              <Entypo name='chevron-right' style={{color:'white',fontSize:18,color:'#02FFF6'}} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>navigation.push('InfoUser')}>
            <Image style={styles.imgUser} source={{ uri: imgUser }} />
          </TouchableOpacity>
          {/* <Image source={{uri:imageUrl}} style={styles.imgUser} /> */}
        </View>
        <TouchableOpacity style={styles.search}>
          <FontAwesome name='search' style={{color:'white',fontSize:18, marginHorizontal:10}} />
          <Text style={{color:'white',fontSize:16,opacity:0.8}}>Tìm kiếm sản phẩm</Text>
        </TouchableOpacity>
        {/* <Image source={require('../../../assets/banner.jpg')} style={styles.banner} /> */}
      </View>
      <View 
      // style={{flex:1,marginTop:20}}
      >
        {/* <TabListView navigation={navigation} /> */}
        <ListItemView />

      </View>
      
    </View>
  )
}

const styles = StyleSheet.create({
  topHome:{
    height:'25%',
    backgroundColor:'#131313',
    paddingTop:20,
    paddingHorizontal:20,
    position:'relative'
  },
  infoUser:{
    flexDirection:'row',
    justifyContent:'space-between',

  },
  iconMap:{
    color:'#02FFF6',
    marginRight:10

  },

  imgUser:{
    width:40,
    height:40,
    borderColor:'white',
    borderWidth:2,
    borderColor:'white',
    borderRadius:10
  },
  search:{
    backgroundColor:'#202020',
    height:40,
    marginTop:20,
    borderRadius:20,
    // justifyContent:'center',
    alignItems:'center',
    paddingHorizontal:20,
    flexDirection:'row'
  },
  banner:{
    width:'100%',
    height:150,
    borderRadius:20,
    position:'absolute',
    bottom:-50,
    marginHorizontal:20,
  }

})

export default Home
