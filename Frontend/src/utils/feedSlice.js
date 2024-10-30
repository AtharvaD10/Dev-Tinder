import { createSlice } from "@reduxjs/toolkit";
const feedSlice = createSlice({
    name: "feed",
    initialState: null,
    reducers: {
        addFeed: (state,action)=>{
            return action.payload;
        },
        removeUSerFromFeed :(state,action)=>{
            const newArray = state.filter((user)=>user._id !== action.payload);
            return newArray;
        },
    },
});

export const { addFeed, removeUSerFromFeed } = feedSlice.actions;
export default feedSlice.reducer;