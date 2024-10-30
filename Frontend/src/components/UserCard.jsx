import axios from 'axios';
import React from 'react';
import { BASE_URL } from '../utils/constants';
import { useDispatch} from "react-redux";
import { removeUSerFromFeed } from '../utils/feedSlice';

const UserCard = ({ user }) => {
    console.log(user);
    const dispatch = useDispatch();
    const {
        _id,
        firstName ,
        lastName ,
        photoUrl , 
        gender ,
        age ,
        about 
    } = user ; 

    const handleRequest = async(status,_id)=>{
        const res = await axios.post(`${BASE_URL}/request/send/${status}/${_id}`,{},{withCredentials:true});
        dispatch(removeUSerFromFeed(_id))
    }

    return (
        <div className="card bg-base-300 rounded-lg shadow-lg overflow-hidden w-100">
            <figure className="relative">
                <img
                    src={photoUrl}
                    alt="userphoto"
                    className="w-full h-64 object-cover"
                />
            </figure>
            <div className="card-body p-4">
                <h2 className="text-xl font-bold">{`${firstName} ${lastName}`}</h2>
                {age && gender && <p className="text-gray-400">{`${age}, ${gender}`}</p>}
                <textarea
                    value={about}
                    readOnly
                    className="h-24 bg-base-300 resize-none"
                />
                <div className="flex justify-between mt-4">
                    <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
                    onClick={()=>handleRequest("ignored",_id)}>Ignore</button>
                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
                     onClick={()=>handleRequest("interested",_id)}>Interested</button>
                </div>
            </div>
        </div>
    );
};

export default UserCard;
