//api calls for user managemnet

import axios from "axios";
import { capitalize } from "../utils/helpers";

const URL='http://localhost:8080/users';
// const capitalize = (str) => {
//     if (!str) return '';
//     return str[0].toUpperCase() + str.slice(1).toLowerCase();
// };
export const fetchUsers = async () => {
    try {
        const res = await axios.get(URL);

        // firstname, lastname, email, registered data, type, status
        const users=res.data.success?res.data.data:_userdata;
        const userdata = users.map((user) => [
            user.id, user.firstName, user.lastName, user.email, new Date(user.createdAt).toLocaleDateString(), capitalize(user.type), user.active?'Active':'Inactive',
        ]);
        return {userdata};
        
    } catch (err) {
        console.log(err);
        return { _userdata };
    }
};
export const updateUser=async(userid,user)=>{

    try{
        console.log(user);
        const res=await axios.put(`${URL}/${userid}`,user);
        console.log(res);
    }catch(err){
        alert('could not update user at this time...');
    }
};
const _userdata = [
    ['1','win','houng','18whoung@gmail123211111111111111111','2021','admin','Active'],
    ['2','seabass','houng','seabass@gmail','2020','user','Inactive'],
];