import { configureStore } from '@reduxjs/toolkit';
import tickerSlice from './ticker';
import orderBookSlice from './orderBook';

const store = configureStore({
	reducer: {
		ticker:tickerSlice,
		orderBook:orderBookSlice
	}
})

export default store;