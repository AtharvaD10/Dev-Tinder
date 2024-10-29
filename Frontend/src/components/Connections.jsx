import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";

const Connections = () => {
  const connections = useSelector((store) => {
    console.log('Connections:', store.connections); // Log the connections state
    return store.connections;
  });

  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      console.log(res.data); // Log the response data
      dispatch(addConnections(res.data.data)); // Dispatch the connections to Redux
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  return (
    <div className="text-center my-10">
      <h1 className="font-bold text-white text-3xl">Connections</h1>
      {Array.isArray(connections) && connections.length > 0 ? (
        connections.map((connection) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about } = connection;

          return (
            <div key={_id} className="flex m-4 p-4 rounded-lg bg-base-300 w-1/2 mx-auto">
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
            </div>
          );
        })
      ) : (
        <p>No connections found.</p> // Or a loading message
      )}
    </div>
  );
};

export default Connections;
