import { createSlice } from '@reduxjs/toolkit';

const tickerInitialState = {
    isLoading:true, 
    notification:null,
    socketOpen:false,
    data:[0,0,0,0,0,0,0,0,0,0], 
}

const tickerSlice = createSlice({
	name:'ticker',
	initialState:tickerInitialState,
	reducers:{
        updateLoading(state,action){
            state.isLoading = action.payload
        },
		updateData(state,action){
			state.data = action.payload.data
		},
		updateNotification(state,action){
			state.notification = action.payload
		}
		
	}
});

export const tickerActions = tickerSlice.actions;

export default tickerSlice.reducer;