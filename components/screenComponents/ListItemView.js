import { collection, getDocs, query, where } from 'firebase/firestore'
import React, { useEffect, useState,useRef } from 'react'
import { ScrollView, TouchableOpacity, View,Text, StyleSheet, FlatList,Image } from 'react-native'
import { db } from '../../firebase'
import { faL } from '@fortawesome/free-solid-svg-icons'
import { getDownloadURL, getStorage, ref } from 'firebase/storage'
import { useNavigation } from '@react-navigation/native'

const ListItemView = () => {
    const navigation = useNavigation();
    const [listTypeItem,setListTypeItem] = useState(null);
    const [listItem,setListItem] = useState([]);
    const [typeItemActive,setTypeItemActive] = useState(0);
    const [dataLoaded, setDataLoaded] = useState(false);
    const flatListRef = useRef();

    const handleGetListTypeItem = async()=>{
        const listType = [];
        const querySnapshot = await getDocs(collection(db,'typeItems'));
        querySnapshot.docs.map((doc)=>{
            listType.push(doc.data())
        })
        setListTypeItem(listType);
    }
    const handleGetListItem = async()=>{
        setDataLoaded(false)
        const list = [];
        const querySnapshot = await getDocs(query(collection(db,'items'),where('type','==',typeItemActive)));
        console.log(querySnapshot.docs.length);
        for (const doc of querySnapshot.docs) {
            // Lặp qua từng mục
            try {
              // Lấy hình ảnh từ Firebase Storage
              const storage = getStorage();
              const refItem = ref(storage, 'imagesDrink/' + doc.data().img);
              const url = await getDownloadURL(refItem);
        
              list.push({ ...doc.data(), urlImgItem: url });
            } catch (error) {
              console.log('Lỗi khi lấy hình ảnh: ' + error);
            }
          }
        setListItem(list);
        setDataLoaded(true)
        console.log(listItem);
    }
    useEffect(()=>{
        console.log(typeItemActive); 
        handleGetListItem();
    },[typeItemActive])

    useEffect(()=>{
        // Cuộn về item đầu khi listItem thay đổi
        if (listItem.length > 0 && flatListRef.current) {
            flatListRef.current.scrollToIndex({ index: 0, animated: false });
        }
    },[listItem])

    useEffect(()=>{
        handleGetListTypeItem();
        handleGetListItem();
    },[])


    const handleTypeItemPress = (index) => {
        setTypeItemActive(index);
    }

  return (
    <View >
      <ScrollView
       style={{height:50}}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ alignItems: 'center' }}
      > 
        {
            listTypeItem && listTypeItem.map((data,index)=>(
                <TouchableOpacity
                    onPress={()=>{handleTypeItemPress(index)}}
                    key={index}
                    style={[styles.typeItem,{backgroundColor:typeItemActive == index ? 'orange': '#F2F2F2'}]}
                >
                    <Text style={[styles.textTypeItem,{color:typeItemActive == index ? 'white': 'black'}]}>{data.name}</Text>
                </TouchableOpacity>
            ))
        }

      </ScrollView>

      {dataLoaded ?
        listItem.length > 0 ?
        <FlatList
            ref={flatListRef}
            data={listItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
                <TouchableOpacity style={styles.item}
                    onPress={()=>{navigation.navigate('DescriptionItem',{data:item})}}
                >
                        <Image source={{uri:item.urlImgItem}} style={styles.imgItem} />
                        <View style={styles.viewItem}>
                            <View style={{width:200}}>
                                <View style={{flexDirection:'row'}}>
                                    <Image source={require('../../assets/icon-check.png')}  style={{width:20,height:20,marginRight:5}}/>  
                                    <Text style={styles.promo}>PROMO</Text> 
                                    <Text style={{fontWeight:'bold'}}>{item.name}</Text>

                                </View>
                                <Text style={{opacity:0.5,fontSize:12}} numberOfLines={2}>{item.des}</Text>
                            </View>
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <View style={{flexDirection:'row',marginRight:20,alignItems:'center'}}>
                                    <Image source={require('../../assets/icon-star.png')}  style={{width:20,height:20,marginRight:5}}/>
                                    <Text>4.5</Text>
                                </View>
                                <Text>{item.price}đ</Text>
                            </View>
                        </View> 
                    </TouchableOpacity>
                )}
                contentContainerStyle={{ paddingBottom: 200 }} // Đặt khoảng cách bottom 
                ListFooterComponent={<View style={{ height: 120 }} />}
                
            />
            : <View style={{alignItems:'center',marginTop:20}}>
                <Image source={require('../../assets/no-cart.png')} style={{width:100,height:60}} />
                <Text style={{alignItems:'center',marginTop:10}}>Không có sản phẩm</Text>

              </View> 
        : null
        }
    </View>
  )
}

const styles = StyleSheet.create({
    typeItem:{
        height:30,
        // alignItems:'center',
        marginHorizontal:10,
        paddingHorizontal:20,
        borderRadius:10
    },
    textTypeItem:{
        lineHeight:30,
        // fontWeight:'bold'
    },
    item:{
        height:100,
        flexDirection:'row', 
        margin:10,
        alignItems:'center'
    },
    imgItem:{width:100,height:100,marginHorizontal:10},
    viewItem:{flexDirection:'column',justifyContent:'space-between',height:80},
    promo:{backgroundColor:'orange',color:'white',fontWeight:'bold',fontSize:12,textAlign:'center',paddingHorizontal:5,borderRadius:5,marginRight:5},

})

export default ListItemView
