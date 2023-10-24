import React, {createContext, useEffect, useState} from 'react'
import { View,Text, TextInput, StyleSheet, Image, SafeAreaView, ImageBackground, StatusBar,TouchableOpacity, ToastAndroid } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faEye, faEyeSlash, faLock } from "@fortawesome/free-solid-svg-icons";
import { app, auth,db } from '../../../firebase';
import { collection, addDoc, getDocs, getDoc, where, updateDoc, doc, query } from "firebase/firestore"; 
import { uuid } from 'uuid-random';
import { Timestamp, getFirestore, serverTimestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useUser } from '../../context/UserContext';
import { getStorage,ref,getDownloadURL, listAll } from 'firebase/storage'
import Entypo from 'react-native-vector-icons/Entypo'

const SIGN_IN = 'SIGN_IN';
const SIGN_UP = 'SIGN_UP';

const SignIn = ({navigation}) => {

  const [page,setPage] = useState(SIGN_IN);
  const {userCurrent,setUserCurrent,imgUser,setImgUser} = useUser();

    return (
      <ImageBackground source={require('../../../assets/backgroundApp.jpg')} style={styles.imgbg} >
        {/* <View style={styles.overlay}></View> */}
        <StatusBar barStyle="light-content"/>
        <SafeAreaView style={styles.container}>
          {/* <BannerComponent page={page} setPage={setPage}/> */}
          <FormComponent page={page} setPage={setPage} navigation={navigation} userCurrent={userCurrent} setUserCurrent={setUserCurrent} setImgUser={setImgUser}/>
          <SocialComponent/>
          
        </SafeAreaView>
      </ImageBackground>
    )
  }


const BannerComponent = ({page,setPage}) => {
    return(
        <View style={styles.containerLogo}>
            <Image style={styles.logo} source={require('../../../assets/logo.png')} resizeMethod="auto"/>
            <View style={styles.nav}>
              <TouchableOpacity style={styles.navItem}
                onPress={() => setPage(SIGN_IN)}
              >
                <Text style={styles.navItemText}>Đăng nhập</Text>
                {page === SIGN_IN ? <View style={{height:3,width:'100%',backgroundColor:'green',position:'absolute',bottom:0}}></View> : null}
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem}
                onPress={() => setPage(SIGN_UP)}
              >
                <Text style={styles.navItemText}>Đăng ký</Text>
                {page === SIGN_UP ? <View style={{height:3,width:'100%',backgroundColor:'green',position:'absolute',bottom:0}}></View> : null}
              </TouchableOpacity>
            </View>
        </View>
    )
}

const FormComponent = ({page,setPage,navigation,userCurrent,setUserCurrent,setImgUser}) => {

  const [show,setShow] = useState(false);
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirmPassword,setComfirmPassword] = useState("");
  const app = auth;
  // const [user,setUser] = useState(null);
  // const [loadingUser, setLoadingUser] = useState(false); // Thêm state để theo dõi trạng thái đang tải

  
  

  const removeForm = () => {
    setName("");
    setEmail("");
    setComfirmPassword("");
    setPassword("");
  }

  useEffect(() =>{
    removeForm();
  },[page])
  
  const handleSetPage = () =>{
    if(page === SIGN_IN){
        setPage(SIGN_UP)
    }
    if(page === SIGN_UP){
        setPage(SIGN_IN)
    }
  }

  const createNewUser = async(uid ) => {
    // const id = uuid();
    console.log('UID của người dùng:', uid);
    try {
      const docRef = await addDoc(collection(db, "users"), {
        email:email,
        uid:uid,
        // name: "User" + Math.floor(Math.random()*1000),
        name:name,
        createAt: serverTimestamp(),
        img: "imgUserDefault.jpg",
        lookTime: serverTimestamp(),
        updateAt: serverTimestamp(),
        active:'true',
        phone:"",
      });
      await updateDoc(docRef,{id: docRef.id});
      ToastAndroid.show('Tạo tài khoản thành công !', ToastAndroid.SHORT)
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const getUserCurrent = async(uid) =>{
    // setLoadingUser(true) //Bắt đầu tải dữ liệu
    try {
      // Tìm tài liệu người dùng dựa trên email
      console.log(uid);
      // const querySnapshot = await getDoc(doc(db, "users",uid));
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "==", uid));
    // Thực hiện truy vấn để lấy danh sách tài liệu phù hợp với điều kiện
    const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        // Lấy dữ liệu của tài liệu đầu tiên trong kết quả
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        setUserCurrent(userData);
        handleGetImgUser(userData.img);
      } else {
        console.error('Không tìm thấy người dùng với id:', uid);
      }
    } catch (error) {
      console.error('Lỗi khi truy cập người dùng:', error);
    }

    
  }

  const handleGetImgUser = (img) => {
    //lấy ảnh user--------------------------------------
    const storage = getStorage();
      const starsRef = ref(storage,'images/'+img);
    
    // Get the download URL
    getDownloadURL(starsRef)
    .then((url) => {
        setImgUser(url);
      // Insert url into an <img> tag to "download"
      // setUserCurrent({...userCurrent,imgUser:url})
    }) 
    .catch((error) => {
      console.log('lỗi'+ error);
    });
  }

  // const handleGetImgDrink = () =>{
  //   const storage = getStorage();
  //   const folderRef = ref(storage, 'imagesDrink/');
  //   const array = []

  //   listAll(folderRef)
  //     .then((result) => {
  //       result.items.forEach((itemRef) => {
  //         // itemRef is a reference to each item (image) in the folder
  //         // You can get the download URL for each item and use it to display or download the images.
  //         getDownloadURL(itemRef)
  //           .then(async(downloadURL) => {
  //             console.log('Download URL:', downloadURL);
  //             const urlParts = downloadURL.split('/');

  //             // Extract the last part, which is the filename
  //             const fullFileName = urlParts[urlParts.length - 1];

  //             // Split the filename by '.' to remove the file extension
  //             const nameWithQueryParams = fullFileName.split('.')[0];
  //             // Split the filename with path by '/'
  //             const pathParts = nameWithQueryParams.split('%2F');
              
  //             // The last part will be the filename without the extension
  //             const name = pathParts[pathParts.length - 1];
  //             //----------------------
  //             const fileNameWithQueryParams = fullFileName.split('?')[0];
  //             const fileNameParams = fileNameWithQueryParams.split("%2F");
  //             const fileName = fileNameParams[fileNameParams.length - 1];

  //             // console.log(fileName);
  //             // console.log(name);
  //             // const createNewDrink = async() => {
  //               // const id = uuid();
  //               console.log('drink:', name);
  //               console.log(fileName);
  //               try {
  //                 const docRef = await addDoc(collection(db, "items"), {
  //                   name:name,
  //                   createAt: serverTimestamp(),
  //                   img: fileName,
  //                   updateAt: serverTimestamp(),
  //                   active:'false',
  //                   price:0,
  //                   discount:20
  //                 });
  //                 await updateDoc(docRef,{id: docRef.id});
  //                 ToastAndroid.show('Tạo item thành công !', ToastAndroid.SHORT)
  //               } catch (e) {
  //                 console.error("Error adding document: ", e);
  //               }
  //             // };
  //             // You can use the download URL to display or download the images
  //           })
  //           .catch((error) => {
  //             console.error('Error getting download URL:', error);
  //           });
  //       });
  //     })
  //     .catch((error) => {
  //       console.error('Error listing items:', error);
  //     });
  // }

  
  

  const handleAuth = () =>{
    if(page === SIGN_UP){
      createUserWithEmailAndPassword(auth,email,password)
      .then(async(userCredential) =>{
        const user = userCredential.user;
        const uid = user.uid;
        console.log("thành công"+uid);
        await createNewUser(uid);
        removeForm();
        await getUserCurrent(uid); // Cập nhật userCurrent sau khi đăng ký
      })
      .catch((error) =>{
        const errorCode = error.code;
        const errorMessage = error.message;
      })
    }
    else if(page === SIGN_IN){
      signInWithEmailAndPassword(auth,email,password)
      .then(async(userCredential) => {
        // Signed in 
        const user = userCredential.user;
        const uid = user.uid;
        await getUserCurrent(uid);
        // setUserCurrent(userDoc.data());
        // handleGetImgDrink();
        navigation.navigate('HomeTabs');        
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });
    }
    
  };

  return(
    <View style={styles.containerForm}>
        <View style={{ margin:10}}>
            <Image style={styles.logo} source={require('../../../assets/logo.png')} resizeMethod="auto"/>
            <Text style={styles.title}>{page === SIGN_UP ? 'Đăng ký' : 'Đăng nhập'}</Text>
            {page == SIGN_UP ? 
              <View style={styles.inputStyle}>
              <FontAwesomeIcon icon={faEnvelope} style={styles.icon}/>
              <TextInput style={styles.input} placeholder="Name" placeholderTextColor='#cfcfcf' value={name} onChangeText={(text) =>setName(text)}></TextInput>
          </View>
            : null}
            <View style={styles.inputStyle}>
                <FontAwesomeIcon icon={faEnvelope} style={styles.icon}/>
                <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor='#cfcfcf' value={email} onChangeText={(text) =>setEmail(text)}></TextInput>
            </View>
            <View style={styles.inputStyle}>
                <FontAwesomeIcon icon={faLock} style={styles.icon}/>
                <TextInput style={styles.input} placeholder="Password" placeholderTextColor='#cfcfcf'
                  value={password} onChangeText={(text) =>setPassword(text)}
                    secureTextEntry={show ? false : true}
                ></TextInput>
                <TouchableOpacity
                    onPress={() =>setShow(!show)}
                    
                >
                    {show ? <Entypo name='eye-with-line' style={{marginRight:10,color:'white'}} /> :<Entypo name='eye' style={{marginRight:10,color:'white'}} /> }
                </TouchableOpacity>
                
            </View>
            {page === SIGN_UP ? 
              <View style={styles.inputStyle}>
                  <FontAwesomeIcon icon={faLock} style={styles.icon}/>
                  <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor='#cfcfcf'
                    value={confirmPassword} onChangeText={(text) =>setComfirmPassword(text)}
                      secureTextEntry={show ? false : true}
                  ></TextInput>
                  <TouchableOpacity
                      onPress={() =>setShow(!show)}
                      
                  >
                    {show ? <Entypo name='eye-with-line' style={{marginRight:10,color:'white'}} /> :<Entypo name='eye' style={{marginRight:10,color:'white'}} /> }

                  </TouchableOpacity>
                  
              </View> : null

            }
            {page === SIGN_IN ? 
              <View style={{height:30}}>

                  <Text style={{position:'absolute',right:10,color:'#E9AA69',textDecorationLine:'underline'}}>Quên mật khẩu?</Text>
              </View> : null
            }
            <TouchableOpacity
                style={styles.btnLogin}
                onPress={handleAuth}
            >
                <Text style={{color:'white',fontSize:20,fontWeight:'bold'}}>{page === SIGN_IN ? 'Đăng nhập' : 'Đăng ký'}</Text>
            </TouchableOpacity>
            <View style={{alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                <Text style={{color:'white'}}>Bạn chưa có tài khoản? 
                </Text>
                    <TouchableOpacity
                        onPress={handleSetPage}
                    >
                        <Text style={{color:'#E9AA69',textDecorationLine:'underline'}}>{page === SIGN_IN ? 'Đăng ký' : 'Đăng nhập'}</Text>
                    </TouchableOpacity>

            </View>

        </View>

    </View>
  )
}




const SocialComponent = () =>{
  return(
      <View style={styles.socialContainer}
      >
          <View style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
              <View style={{height:3,backgroundColor:'white',width:'33.33%'}}></View>
              <Text style={{marginHorizontal:10,fontWeight:'bold',color:'white'}}>or connect with</Text>
              <View style={{height:3,backgroundColor:'white',width:'33.33%'}}></View>
          </View>
          <View style={{marginTop:20,flexDirection:'row',flexWrap:'wrap',justifyContent:'center',alignItems:'center'}}>
              <TouchableOpacity style={styles.itemLogin}>
                  <Image style={styles.iconSocial} source={require('../../../assets/google.png')}  resizeMethod="auto"/>
                  <Text style={styles.textSocial}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.itemLogin}>
                  <Image style={styles.iconSocial} source={require('../../../assets/apple.png')}  resizeMethod="auto"/>
                  <Text style={styles.textSocial}>Apple</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.itemLogin}>
                  <Image style={styles.iconSocial} source={require('../../../assets/twitter.png')}  resizeMethod="auto"/>
                  <Text style={styles.textSocial}>Twitter</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.itemLogin}>
                  <Image style={styles.iconSocial} source={require('../../../assets/facebook-icon.png')}  resizeMethod="auto"/>
                  <Text style={styles.textSocial}>Facebook</Text>
              </TouchableOpacity>
              
          </View>

      </View>
  )
}


  const styles = StyleSheet.create({
    imgbg:{
      flex:1,
    },
    container:{
        borderWidth:2,
        flex:1,
          
    },
    // overlay: {
    //     ...StyleSheet.absoluteFillObject, // Lớp phủ chiếm toàn bộ không gian của container
    //     // backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu sắc của lớp phủ (màu đen với độ trong suốt 0.5)
    //   },
    // containerLogo:{
    //     flex:0.3,
    //     justifyContent:'center',
    //     alignItems:'center',
    //   },
    //   title:{
    //     fontSize:40,
    //     color:'white',
    //     fontWeight:'600'
    //   },
    //   logo:{
    //     width:130,
    //     height:100,
    //     // position:'absolute',
    //     // top:20
    // },
    // nav:{
    //   flexDirection:'row',
    //   width:'100%',
    //   height:50,
    //   backgroundColor:'white',
    //   position:'absolute',
    //   bottom:0
    // },
    // navItem:{
    //   width:'50%',
    //   height:'100%',
    //   justifyContent:'center',
    //   alignItems:'center',
    // },
    // navItemText:{
    //   color:'#2E8464',
    //   fontSize:20,
    //   fontWeight:'bold'
    // },

    ///


    containerForm:{
      flex:0.7,
      justifyContent:'center',
      alignItems:'center',
    },
    title:{
        fontSize:40,
        color:'white',
        fontWeight:'600',
        textAlign:'center',
        marginVertical:20,
      },
      logo:{
        width:130,
        height:100,
        alignSelf:'center',
        marginBottom:20,
    },

    textForm:{
      fontSize:24,
      fontWeight:'bold',
      marginBottom:20,
  },
  inputStyle:{
      height:50,
      width:'80%',
    //   backgroundColor:'white',
      borderWidth:2,
      borderColor:'#cfcfcf',
      flexDirection:'row',
      alignItems:'center',
      marginBottom:10,
      borderRadius:10
  },
  input:{
    //   backgroundColor:'white',
      height:48,
      flex:1,
      marginHorizontal:10,
      color:'#cfcfcf'
      
      
  },
  icon:{
      fontSize:40,
      margin:10,
      color:'#cfcfcf'
  },
  btnLogin:{
      backgroundColor:'#C67C4E',
      height:40,
      marginHorizontal:30,
      marginVertical:10,
      borderRadius:15,
      justifyContent:'center',
      alignItems:'center'
  },


  ///

  socialContainer:{
    flex:1, 
    paddingTop: 20,
    paddingHorizontal:20,
    position:'absolute',
    top:'75%',
    bottom:0
  },
  itemLogin:{
    flexDirection:'row',
    width:'45%',
    boxSizing:'border-box',
    backgroundColor:'white',
    height:40,
    borderRadius:10,
    paddingLeft:30,
    alignItems:'center',
    margin:5,

},
iconSocial:{
    width:20,
    height:20,
    marginRight:10


},
textSocial:{
    fontWeight:'bold',
    fontSize:20
}

  })
  
  export default SignIn;
  