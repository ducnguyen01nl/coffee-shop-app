import React, { useState,useEffect } from 'react'
import { TouchableOpacity, View,Text, ToastAndroid,Image,TextInput } from 'react-native'
import Ionic from 'react-native-vector-icons/Ionicons'
import { useUser } from '../context/UserContext'
import { doc,getDoc,serverTimestamp,setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import uuid from 'react-native-uuid'

const InfoUser = ({navigation}) => {

    const {userCurrent,setUserCurrent,imgUser,setImgUser} = useUser();
    const [name,setName] = useState(userCurrent.name);
    const [phone,setPhone] = useState(userCurrent.phone);
    const [image, setImage] = useState(null);
    const [fileName, setFileName] = useState(null);
    const storage = getStorage();
 

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log('img'+result);

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const fileName = uri.substring(uri.lastIndexOf('/') + 1);
      setImage(result.assets[0].uri);
      setFileName(fileName);
    }
  };

  const handleUploadImage = async() =>{


    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function() {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", image, true);
      xhr.send(null);
    });

    /** @type {any} */
    const metadata = {
      contentType: 'image/jpeg',
      // firebaseStorageDownloadTokens: uuid.v4(),
    };
    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, 'images/' + fileName);
    const uploadTask = uploadBytesResumable(storageRef, blob, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      }, 
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;

          // ...

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      }, 
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
        });
      }
    );

  }

  const ToastMessage = () =>{
    ToastAndroid.show('Sửa thành công !', ToastAndroid.SHORT)
  }

  const updateUser = async() => {
    try {
      const useRef = doc(db,'users',userCurrent.id);
      await updateDoc(useRef,{name:name,phone:phone,updateAt:serverTimestamp(),img:fileName});

      const update = await getDoc(useRef);
      if(update.exists()){
        const updateUserData = update.data();
        setUserCurrent(updateUserData);
        setImgUser(image);
        handleUploadImage();
      }
      else{
      console.log('không tìm thấy tài liệu');
    }
      console.log('cập nhật thành công');
    }
    catch(error){
      console.error('lỗi cập nhập',error);
    }
  }

  useEffect(()=>{
    console.log('cập nhật user'+userCurrent);
  },[userCurrent])
  // useEffect(()=>{
  //   const uploadImage = async() =>{
  //     const blob = await Promise((resolve,reject) =>{
  //       const xhr = XMLHttpRequest();
  //       xhr.onload = function(){
  //         resolve(xhr.response);
  //       };
  //       xhr.onerror = function(){
  //         reject(TypeError("Network request failed"));
  //       };
  //       xhr.responseType = "blob";
  //       xhr.open("GET",image,true);
  //       xhr.send(null);

  //     });

  //     /** @type {any} */
  //     const metadata = {
  //       contentType: 'image/jpeg'
  //     };

  //     // Upload file and metadata to the object 'images/mountains.jpg'
  //     const storageRef = ref(storage, 'images/' + Date.now());
  //     const uploadTask = uploadBytesResumable(storageRef, blob, metadata);

  //     // Listen for state changes, errors, and completion of the upload.
  //     uploadTask.on('state_changed',
  //       (snapshot) => {
  //         // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
  //         const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //         console.log('Upload is ' + progress + '% done');
  //         switch (snapshot.state) {
  //           case 'paused':
  //             console.log('Upload is paused');
  //             break;
  //           case 'running':
  //             console.log('Upload is running');
  //             break;
  //         }
  //       }, 
  //       (error) => {
  //         // A full list of error codes is available at
  //         // https://firebase.google.com/docs/storage/web/handle-errors
  //         switch (error.code) {
  //           case 'storage/unauthorized':
  //             // User doesn't have permission to access the object
  //             break;
  //           case 'storage/canceled':
  //             // User canceled the upload
  //             break;

  //           // ...

  //           case 'storage/unknown':
  //             // Unknown error occurred, inspect error.serverResponse
  //             break;
  //         }
  //       }, 
  //       () => {
  //         // Upload completed successfully, now we can get the download URL
  //         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  //           console.log('File available at', downloadURL);
  //         });
  //       }
  //     );

  //   }


  //   if(image != null){
  //     uploadImage();
  //     setImage(null)
  //   }
  // },[image])




  return (
    <View style={{width:'100%',height:'100%',backgroundColor:'white'}} >
      <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',padding:10}}>
        <TouchableOpacity
            onPress={()=>navigation.goBack()}
        >
            <Ionic name='close-outline' style={{fontSize:35}} />
        </TouchableOpacity>
        <Text style={{fontSize:16,fontWeight:'bold'}}>Sửa thông tin</Text>
        <TouchableOpacity
            onPress={() =>{
                updateUser();
                ToastMessage();
                navigation.goBack()
            }}
        >
            <Ionic name='checkmark' style={{fontSize:35,color:'#3493D9'}} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={{padding:20,alignItems:'center'}}
        onPress={pickImage}
      >
        <Image source={{uri:image ? image : imgUser}} style={{width:80,height:80,borderRadius:100}} />
        <Text style={{color:'#3493D9'}}>Đổi ảnh đại diện</Text>
      </TouchableOpacity>
      <View style={{padding:10}}>
        <View style={{paddingVertical:10}}>
            <Text style={{opacity:0.5}}>Tên</Text>
            <TextInput placeholder="name" defaultValue={userCurrent.name} onChangeText={(e)=>setName(e)} style={{fontSize:16,borderBottomWidth:1,borderColor:'#CDCDCD'}} />
        </View>
        
        <View style={{paddingVertical:10}}>
            <Text style={{opacity:0.5}}>Số điện thoại</Text>
            <TextInput placeholder="Phone" defaultValue={userCurrent.phone} onChangeText={(e)=>setPhone(e)}  style={{fontSize:16,borderBottomWidth:1,borderColor:'#CDCDCD'}} />
        </View>
        <View style={{paddingVertical:10, opacity:0.5}}>
            <Text style={{opacity:0.5}}>Email</Text>
            <Text placeholder="accountName" style={{fontSize:16,borderBottomWidth:1,borderColor:'#CDCDCD'}}>{userCurrent.email}</Text>
        </View>
        
        <View style={{paddingVertical:10, opacity:0.5}}>
            <Text >Ngày tạo tài khoản</Text>
            <Text style={{fontSize:16,borderBottomWidth:1,borderColor:'#CDCDCD',color:'#3493D9'}}>{userCurrent.createAt ? new Date(userCurrent.createAt.seconds * 1000).toLocaleString() : ''}</Text>
        </View>
        <View style={{paddingVertical:10, opacity:0.5}}>
            <Text >Ngày sửa thông tin</Text>
            <Text style={{fontSize:16,borderBottomWidth:1,borderColor:'#CDCDCD',color:'#3493D9'}}>{userCurrent.updateAt ? new Date(userCurrent.updateAt.seconds * 1000).toLocaleString() : ''}</Text>
        </View>
      </View>


    </View>
  )
}

export default InfoUser
