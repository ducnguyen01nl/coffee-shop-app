
import { faChevronRight, faComments, faGear, faHeadset, faLock, faUser, faUserClock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import React from 'react'
import { View,Text,SafeAreaView, StatusBar, TouchableOpacity, Image,StyleSheet, ScrollView } from 'react-native'
import { auth, db } from '../../../firebase';
import { signOut } from 'firebase/auth';
import { useUser } from '../../context/UserContext';
import { useEffect, useState } from 'react/cjs/react.production.min';
import { getStorage,ref,getDownloadURL } from 'firebase/storage'


const User = ({navigation}) => {

  const {userCurrent,setUserCurrent,imgUser} = useUser();
  // const [imageUrl,setImageUrl] = useState('');
  console.log(userCurrent);
  console.log('cập nhật user'+imgUser);

  const handleSignout = async() => {
    try {
      await signOut(auth);
      navigation.navigate('SignIn');
      await setUserCurrent(null);
      console.log('user'+userCurrent);
      // Redirect to the login screen or perform any other necessary actions
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  // useEffect(()=>{
      
  //   const storage = getStorage();
  //   const starsRef = ref(storage,'images/'+userCurrent.img);
  
  //     // Get the download URL
  //     getDownloadURL(starsRef)
  //     .then((url) => {
  //         setImageUrl(url);
  //       // Insert url into an <img> tag to "download"
  //       // setUserCurrent({...userCurrent,imgUser:url})
  //     }) 
  //     .catch((error) => {
  //       console.log('lỗi'+ error);
  //     });

  //   },[])
 

  return (
    <View style={{flex:1,backgroundColor:'#C67C4E'}}>
      {/* <StatusBar barStyle="light-content"/> */}
      <SafeAreaView style={{flex:1}}>
          <TouchableOpacity style={styles.containerUser}
            onPress={()=>navigation.push('InfoUser')}
          >
          <Image style={styles.imgUser} source={{uri:imgUser}}/>
            
            <Text style={styles.textUser}>{userCurrent.name}</Text>
          </TouchableOpacity>
          <View style={styles.containerContent}>
            <TouchableOpacity style={styles.itemContent}>
              <Image style={styles.icon} source={require('../../../assets/iconNote.png')}/>
              <Text style={{color:'white',fontWeight:'bold'}}>Đơn hàng</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.itemContent, styles.itemMid]}>
              <Image style={styles.icon} source={require('../../../assets/iconHeart.png')}/>
              <Text style={{color:'white',fontWeight:'bold'}}>Yêu thích</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.itemContent}
              onPress={() => navigation.push("ListAddress")}
            >
              <Image style={styles.icon} source={require('../../../assets/iconMap.png')}/>
              <Text style={{color:'white',fontWeight:'bold'}}>Địa chỉ</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.containerFunction}>
            <ScrollView style={{marginTop:10,marginBottom:50 }} showsVerticalScrollIndicator={false}>

              <View style={{margin:20}}>
                  <View>
                    <Text style={styles.titleFunction}>Tài khoản</Text>
                    <View style={styles.itemFunction}>
                      <TouchableOpacity style={styles.item} onPress={() => navigation.push("InfoUser")}>
                        <View style={{flexDirection:'row'}}>
                          <FontAwesomeIcon icon={faUser} color='#C67C4E' />
                          <Text style={styles.textItem}>Hồ sơ</Text>
                        </View>
                        <FontAwesomeIcon icon={faChevronRight} color='gray'/>
                      </TouchableOpacity>
                      <View style={{backgroundColor:'gray',height:1}}></View>
                      <TouchableOpacity style={styles.item}>
                        <View style={{flexDirection:'row'}}>
                          <FontAwesomeIcon icon={faLock} color='#C67C4E' />
                          <Text style={styles.textItem}>Đổi mật khẩu</Text>
                        </View>
                        <FontAwesomeIcon icon={faChevronRight} color='gray'/>
                      </TouchableOpacity>
                    
                    </View>
                  </View>

                  <View>
                    <Text style={styles.titleFunction}>Tương tác</Text>
                    <View style={styles.itemFunction}>
                      <TouchableOpacity style={styles.item}>
                        <View style={{flexDirection:'row'}}>
                          <FontAwesomeIcon icon={faUserClock} color='#C67C4E' />
                          <Text style={styles.textItem}>Hoạt động</Text>
                        </View>
                        <FontAwesomeIcon icon={faChevronRight} color='gray'/>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View>
                    <Text style={styles.titleFunction}>Trung tâm trọ giúp</Text>
                    <View style={styles.itemFunction}>
                      <TouchableOpacity style={styles.item}>
                        <View style={{flexDirection:'row'}}>
                          <FontAwesomeIcon icon={faComments} color='#C67C4E' />
                          <Text style={styles.textItem}>Câu hỏi thường gặp</Text>
                        </View>
                        <FontAwesomeIcon icon={faChevronRight} color='gray'/>
                      </TouchableOpacity>
                      <View style={{backgroundColor:'gray',height:1}}></View>
                      <TouchableOpacity style={styles.item}>
                        <View style={{flexDirection:'row'}}>
                          <FontAwesomeIcon icon={faHeadset} color='#C67C4E' />
                          <Text style={styles.textItem}>Phản hồi & Hỗ trợ</Text>
                        </View>
                        <FontAwesomeIcon icon={faChevronRight} color='gray'/>
                      </TouchableOpacity>
                      
                    </View>
                  </View>
                  <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <TouchableOpacity style={styles.btnLogout}
                      onPress={handleSignout}
                    >
                      <Text style={{color:'white',fontSize:20,fontWeight:'bold',textAlign:'center',marginTop:10}}>Đăng xuất</Text>
                    </TouchableOpacity>
                    
                  </View>

              </View>
            </ScrollView>
          </View>
        
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  containerUser:{
    flexDirection:'row',
    alignItems:'center',
    margin:20,
    marginTop:40,

  },
  imgUser:{
    width:64,
    height:64,
    borderRadius:100,
  },
  textUser:{
    marginHorizontal:20,
    fontSize:20,
    color:'white',
    fontWeight:'bold'
  },
  ////
  containerContent:{
    flexDirection:'row',
    marginVertical:10,
    justifyContent:'space-around',
    alignItems:'center',
    padding:0,
    margin:0,
    borderColor:'white',
    // borderBottomWidth:3,
    // borderTopWidth:3,
    borderWidth:3,
    borderRadius:10,
    marginHorizontal:20,
    // paddingBottom:10,
  },
  icon:{
    width:60,
    height:60,
  },
  itemContent:{
    width:'33%',
    paddingBottom:10,
    alignItems:'center',
  },
  itemMid:{
    borderLeftWidth:3,
    borderRightWidth:3,
    borderColor:'white',
  },
  ////
  containerFunction:{
    flex:1,
    backgroundColor:'#ECF6F8',
    marginTop:20,
    borderTopRightRadius:30,
    borderTopLeftRadius:30,
    
  },
  itemFunction:{
    backgroundColor:'white',
    paddingHorizontal:20,
    borderRadius:10,
    marginBottom:10
  },
  item:{
    flexDirection:'row',
    justifyContent:'space-between',
    height:50,
    alignItems:'center',
    
  },
  titleFunction:{
    fontSize:20,
    marginVertical:10,
    fontWeight:"bold"
  },
  textItem:{
    marginLeft:10
  },
  btnLogout:{
    width:'100%',
    backgroundColor:'#C67C4E',
    height:50,
    borderRadius:30,
    marginTop:10,
  }
})

export default User
