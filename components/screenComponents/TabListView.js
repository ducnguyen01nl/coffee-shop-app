import React, { useEffect, useState } from 'react'
import { ScrollView, View,Text,Image,TouchableHighlight, TouchableOpacity } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { faL } from '@fortawesome/free-solid-svg-icons';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { useNavigation,useNavigationState } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();


const TabListView = () => {

    
const [listCoffee,setListCoffee] = useState([]);
let listTea = [];
let listFreeze = [];
let listCake = [];
const Coffee = () => {
    console.log("hell"+listCoffee);
    return(
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={{width:'100%',height:'100%',backgroundColor:'white'}}
        >
            {/* <View> */}
                {/* {
                    listCoffee ? listCoffee.map((data,index)=>{
                        <View key={index}>
                            <Text>{data.name}</Text>
                        </View>

                    })
                    : <Text>Không có sản phẩm</Text>
                } */}
            {/* </View> */}
            {
                listCoffee.length > 0 ? 
                listCoffee.map((doc,index)=>(
                    <TouchableOpacity key={index} style={{height:100,flexDirection:'row', margin:10,alignItems:'center'}}>
                        <Image source={{uri:doc.urlImgItem}} style={{width:100,height:100,marginHorizontal:10}} />
                        <View style={{flexDirection:'column',justifyContent:'space-between',height:80}}>
                            <View>
                                <View style={{flexDirection:'row'}}>
                                    <Image source={require('../../assets/icon-check.png')}  style={{width:20,height:20,marginRight:5}}/>  
                                    <Text style={{backgroundColor:'orange',color:'white',fontWeight:'bold',fontSize:12,textAlign:'center',paddingHorizontal:5,borderRadius:5,marginRight:5}}>PROMO</Text> 
                                    <Text style={{fontWeight:'bold'}}>{doc.name}</Text>

                                </View>
                                <Text style={{opacity:0.5,fontSize:12}}>Cà phê sô cô la thơm ngon</Text>
                            </View>
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <View style={{flexDirection:'row',marginRight:20,alignItems:'center'}}>
                                    <Image source={require('../../assets/icon-star.png')}  style={{width:20,height:20,marginRight:5}}/>
                                    <Text>4.5</Text>
                                </View>
                                <Text>45.000đ</Text>
                            </View>
                        </View> 
                    </TouchableOpacity>
                ))
                : <Text>Không có sản phẩm</Text>
            }

            {/* <TouchableOpacity style={{height:100,flexDirection:'row', margin:10,alignItems:'center'}}>
                <Image source={require('../../assets/Phindi_Choco.jpg')} style={{width:100,height:100,marginHorizontal:10}} />
                <View style={{flexDirection:'column',justifyContent:'space-between',height:80}}>
                    <View>
                        <View style={{flexDirection:'row'}}>
                            <Image source={require('../../assets/icon-check.png')}  style={{width:20,height:20,marginRight:5}}/>  
                            <Text style={{backgroundColor:'orange',color:'white',fontWeight:'bold',fontSize:12,textAlign:'center',paddingHorizontal:5,borderRadius:5,marginRight:5}}>PROMO</Text> 
                            <Text style={{fontWeight:'bold'}}>Cà phê sô cô la</Text>

                        </View>
                        <Text style={{opacity:0.5,fontSize:12}}>Cà phê sô cô la thơm ngon</Text>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <View style={{flexDirection:'row',marginRight:20,alignItems:'center'}}>
                            <Image source={require('../../assets/icon-star.png')}  style={{width:20,height:20,marginRight:5}}/>
                            <Text>4.5</Text>
                        </View>
                        <Text>45.000đ</Text>
                    </View>
                </View> 
            </TouchableOpacity> */}
            
            
        </ScrollView>
    )
}
const Tea = () => {
    return(
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={{width:'100%',height:'100%'}}
        >
            <View>
                {listTea}
            </View>
        </ScrollView>
    )
}
const Freeze = () => {
    return(
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={{width:'100%',height:'100%'}}
        >
            <View>
                {listFreeze}
            </View>
        </ScrollView>
    )
}
const Cake = () => {
    return(
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={{width:'100%',height:'100%'}}
        >
            <View>
                {listCake}
            </View>
        </ScrollView>
    )
}
    
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation();

//   useEffect(() => {
//     const unsubscribe = navigation.addListener('tabPress', (e) => {
//       const tabIndex = e.target;
//       console.log('Tab index changed:', tabIndex);
//     });
//     return unsubscribe;
//   }, [navigation]);



    const handleGetListItem = async() =>{
        const updatedListCoffee = []; 
        const querySnapshot = await getDocs(collection(db,'items'));
        const promise =  querySnapshot.docs.map(async(doc) =>{
            //get image in storage
            // const urlImgItem = await handleGetImgItem(doc.data().img);
            // console.log("url"+urlImgItem);
            
            const storage = getStorage();
            const refItem = ref(storage, 'imagesDrink/' + doc.data().img);
            try {
                const url = await getDownloadURL(refItem);
                // return url; // Trả về URL hình ảnh thay vì promise
                if(doc.data().type == 1){
                    updatedListCoffee.push({...doc.data(),urlImgItem:url})
                }
            } catch (error) {
                console.log('lỗi get img'+error);
                // return null;
            }
            // setListCoffee(updatedListCoffee)

        });
        await Promise.all(promise)
        setListCoffee(updatedListCoffee);
        console.log("list"+listCoffee);
    }

    useEffect(()=>{
        handleGetListItem();
    },[])


    // const handleGetImgItem = async (img) => {
    //     const storage = getStorage();
    //     const refItem = ref(storage, 'imagesDrink/' + img);
    //     try {
    //         const url = await getDownloadURL(refItem);
    //         return url; // Trả về URL hình ảnh thay vì promise
    //     } catch (error) {
    //         console.log(error);
    //         return null;
    //     }
    // }

    

    // for(let i =0;i<numberOfSquare;i++){
    //     squares.push(
    //         <View key={i}>
    //             <View style={{width:130,height:150,marginVertical:0.5,backgroundColor:'black',opacity:0.1}}>

    //             </View>
    //         </View>
    //     )
    // }

    

  return (
    <Tab.Navigator
        screenOptions={({route}) =>({
            // tabBarShowLabel:false,
            tabBarIndicatorStyle:{
                backgroundColor:'black',
                height:1.5
            },
            tabBarLabel: ({ focused }) => {
                let labelText;
                if (route.name === 'Coffee') {
                  labelText = 'Cà phê'; 

                } else if (route.name === 'Tea') {
                  labelText = 'Trà'; 
                } else if (route.name === 'Cake') {
                  labelText = 'Bánh'; 
                } 
                else if (route.name === 'Freeze') {
                    labelText = 'Freeze'; 
                  } 
                return (
                  <Text style={{ color: focused ? '#760000' : 'gray',fontSize:14 }}>{labelText}</Text>
                );
              },
        })}
    >
        <Tab.Screen name='Coffee' component={Coffee} /> 
        <Tab.Screen name='Tea' component={Tea} /> 
        <Tab.Screen name='Freeze' component={Freeze} /> 
        <Tab.Screen name='Cake' component={Cake} /> 
    </Tab.Navigator>
  )
}

export default TabListView
