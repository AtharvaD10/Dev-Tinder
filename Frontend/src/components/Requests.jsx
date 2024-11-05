import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect, useState } from "react";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/requests/received`, {
        withCredentials: true,
      });
      console.log(res);
      
      dispatch(addRequests(res.data.requestReceived));
    } catch (err) {}
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleRequest = async(status,_id) =>{
    try{
        const res = await axios.post(`${BASE_URL}/request/review/${status}/${_id}`,{},{withCredentials:true});
        dispatch(removeRequest(_id));
    }catch(err){
        console.log(err);
    } 
  }

  if(!requests) return;
  
  return (
    <div className="text-center my-10">
      <h1 className="font-bold text-white text-3xl">Requests</h1>
      { requests.length > 0 ? (
        requests.map((request) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about } = request.fromUserId;

          return (
            <div key={_id} className="flex m-4 p-4 justify-between items-center rounded-lg bg-base-300 w-1/2 mx-auto">
              <div>
                <img
                  alt="photo"
                  className="w-20 h-20 rounded-full object-cover"
                  src={photoUrl}
                />
              </div>
              <div className="text-left mx-4">
                <h2 className="font-bold text-xl">{`${firstName} ${lastName}`}</h2>
                {age && gender && <p>{`${age}, ${gender}`}</p>}
                <p>{about}</p>
              </div>
              <div>
              <button className="btn btn-primary mx-2" onClick={()=>handleRequest("rejected","request._id")}>Reject</button>
              <button className="btn btn-secondary mx-2" onClick={()=> handleRequest("accepted",request._id)}>Accept</button>
              </div>
            </div>
          );
        })
      ) : (
        <p>No Requests</p>
      )}
    </div>
  );
};
export default Requests;