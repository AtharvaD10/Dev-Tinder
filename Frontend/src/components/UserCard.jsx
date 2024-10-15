// import React from 'react'

// const UserCard = ({user}) => {
//     console.log(user);
//     const {firstName, lastName, photoUrl, gender, age, about} = user;
//     return (
//         <div className="card bg-base-300 w-96 shadow-xl">
//             <figure>
//                 <img
//                     src={user.photoUrl}
//                     alt="userphoto" />
//             </figure>
//             <div className="card-body my-1">
//                 <h2 className="card-title my-1">{firstName +" "+ lastName}</h2>
//               {age && gender &&<p>{age +" , "+ gender}</p>}
//                 <p>{about}</p>
//                 <div className="card-actions justify-center my-4">
//                     <button className="btn btn-primary">Ignore</button>
//                     <button className="btn btn-secondary">Interested</button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default UserCard
import React from 'react';

const UserCard = ({ user }) => {
    console.log(user);
    const { firstName, lastName, photoUrl, gender, age, about } = user;
    return (
        <div className="card bg-base-300 rounded-lg shadow-lg overflow-hidden  w-100">
            <figure className="relative">
                <img
                    src={photoUrl}
                    alt="userphoto"
                    className="w-full h-64 object-cover"
                />
            </figure>
            <div className="card-body p-4">
                <h2 className="text-xl font-bold">{firstName + " " + lastName}</h2>
                {age && gender && <p className="text-gray-400">{age + " , " + gender}</p>}
                <p className="text-gray-400 ">{about}</p>
                <div className="flex justify-between mt-4">
                    <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200">Ignore</button>
                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200">Interested</button>
                </div>
            </div>
        </div>
    );
};

export default UserCard;
