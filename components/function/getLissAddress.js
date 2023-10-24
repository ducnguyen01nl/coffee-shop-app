import { useState } from "react/cjs/react.production.min";
import { useUser } from "../context/UserContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";

export const getListAddress = async() => {

    const {userCurrent} = useUser();
    const [listAddress,setListAddress] = useState(null);

    try{
        // const querySnapshot = await getDocs(collection(db,"address"),where('idUser',userCurrent.id));
        const addresses = [];
        const listRef = collection(db,'address');
        const q = query(listRef,where('idUser','==',userCurrent.id));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            addresses.push(doc.data());
        });

        if (addresses.length > 0) {
            setListAddress(addresses);
            console.log(listAddress); // Đặt console.log ở đây
        } else {
            setListAddress([]);
            console.log('Không tìm thấy địa chỉ với idUser ', userCurrent.id);
        }
        
    }catch(error){
        console.log(error);
    }

    return listAddress
}