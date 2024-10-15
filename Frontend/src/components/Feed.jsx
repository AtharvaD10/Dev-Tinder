import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addFeed } from '../utils/feedSlice'
import UserCard from './UserCard'
const Feed = () => {
  const feed = useSelector((store) => store.feed);
  console.log(feed)
  const dispatch = useDispatch();

  const getFeed = async () => {
    // if (!Array.isArray(feed) || feed.length > 0) return;
    try {
      const res = await axios.get(BASE_URL + "/feed",
        { withCredentials: true} 
      );
      console.log(res);
      dispatch(addFeed(res.data));
    }
    catch (err) {
      console.error(err);
    }
  }

  useEffect(()=>{
    getFeed();
  },[])

  return (
    feed && (
      <div className='flex justify-center my-8'>
         <UserCard user={feed[0]}/>
       </div>
    ) 
  )
}


export default Feed