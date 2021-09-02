import { createSlice } from '@reduxjs/toolkit';

const orderBookInitialState = {
    isLoading:true, 
    notification:null,
    socketOpen:false,
    data:{
        bids:{},
        asks:{}
    }, 
}

const orderBookSlice = createSlice({
	name:'orderBook',
	initialState:orderBookInitialState,
	reducers:{
        updateLoading(state,action){
            state.isLoading = action.payload
        },
        addTemplate(state,action){
            state.data = {
                bids:{},
                asks:{}
            }
            
            for (let item of action.payload){
                let [price,count,amount] = item
                
                if(amount > 0){
                    state.data.bids[item[0]] = {count:count,amount:amount.toFixed(4)}
                }else{
                    state.data.asks[item[0]] = {count:count,amount:amount.toFixed(4)}
                }
                
            }
            // state.data = action.payload
        },
		updateData(state,action){
            let [price,count,amount] = action.payload
            
            if(count > 0){
                if(amount > 0){
                    state.data.bids[price] = {count:count,amount:amount.toFixed(4)}
                }

                if(amount < 0){
                    state.data.asks[price] = {count:count,amount:amount.toFixed(4)}
                }
            }

            if(count == 0){
                if(amount == 1){
                    delete state.data.bids[price]
                }else if(amount == -1){
                    delete state.data.asks[price]
                }
            }
		},
	}
});

export const orderBookActions = orderBookSlice.actions;

export default orderBookSlice.reducer;