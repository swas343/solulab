import { useState, useEffect, Fragment } from "react";
// import useOrderBook from "../hooks/useOrderBook";
import { useSelector,useDispatch } from 'react-redux';
import Loader from "./loader";
import { orderBookActions } from "../store/orderBook";
import { tickerActions } from "../store/ticker";

const OrderBook = (props) =>{
    let reconnectionHandle;
    const dispatch = useDispatch();
    const [ws, setWs] = useState(null)
    const [precision, setPrecision] = useState(1);
    const precisionArr = ["P0", "P1", "P2", "P3", "P4"];

    const increaseDisable = (precision === 4) ? 'disabled':'';
    const decreaseDisable = (precision === 0) ? 'disabled':'';

    const Obd = useSelector(state => state.orderBook);
    const bids = Obd.data.bids;
    const asks = Obd.data.asks;

    const isLoading = Obd.isLoading;

    const increasePrecision = () =>{
        dispatch(orderBookActions.updateLoading(true))
        if(precision < 4 ){
            setPrecision(state => precision+1)
        }
    }
    
    const decreasePrecision = () =>{
        dispatch(orderBookActions.updateLoading(true))
        if(precision > 0){
            setPrecision(state => precision-1)
        }
    }

    let precisionVal = precisionArr[precision]

    const connect = () =>{
        clearInterval(reconnectionHandle)
        dispatch(orderBookActions.updateLoading(true))
        let ws = new WebSocket('wss://api-pub.bitfinex.com/ws/2')
        let msg = JSON.stringify({
            event: 'subscribe', 
            channel: 'book', 
            symbol: 'tBTCUSD',
            FREQUENCY: 'F1',
            prec:precisionVal,
        })
        
        
        ws.onopen = () => {
            // dispatch(tickerActions.updateNotification(null))
            setWs(ws)
            ws.send(msg)
        }
        
        ws.onmessage = res => {
          let data = JSON.parse(res.data);
          
          if(Array.isArray(data)){
            if(data[1].length === 50){
                // this is the latest snapshot of the order book
                dispatch(orderBookActions.addTemplate(data[1]))
                dispatch(orderBookActions.updateLoading(false))
            }

            if(data[1].length === 3){
              dispatch(orderBookActions.updateData(data[1]))
            }

          }
          
        }
        
        ws.onclose = () => {
            ws.close();
        }

        ws.onerror = function(err) {
            dispatch(tickerActions.updateNotification("Socket is closed. Reconnect will be attempted after 10 seconds"))
            dispatch(tickerActions.updateNotification(null))
            console.log('Socket is closed. Reconnect will be attempted in 10 second.', err.reason);
            reconnectionHandle = setInterval(function() {
                // dispatch(tickerActions.updateNotification("Connecting"))
                connect();
            }, 10000);
        };
        
    }

    // initializing order book hook
    useEffect( () =>{
        
        if(!props.socket){
            ws.close()
            // connect()
        }else{
            if(ws){
                ws.close()
            }
            connect()
        }
        
    },[props.socket,precision]);

    if(isLoading){
        return <Loader />
    }

    return (
        <Fragment>
            <div className="precisionControls">
                <label>Precision Controls: </label>
                <button className="btn btn-primary ms-4" onClick={increasePrecision} disabled={increaseDisable}> Increase </button> 
                <button className="btn btn-primary" onClick={decreasePrecision} disabled={decreaseDisable}> Decrease </button>
            </div>
            <div className="tableContainer">
                
                <table className="table noPadding" style={{"display":"inline-block","width":"auto", "minHeight":"425px","fontSize":"12px"}}>
                    <tbody>
                        <tr>
                            <th>Count</th>
                            <th>Amount</th>
                            <th>Total</th>
                            <th>Price</th>
                        </tr>
                        {Object.keys(bids).reverse().map( (item,index) => {
                            return bids[item].amount > 0 && <tr key={`t1${index}`}>
                                <td id={`t1td1${index}`} key={`t1td1${index}`}>{bids[item].count}</td>
                                <td id={`t1td2${index}`} key={`t1td2${index}`}>{bids[item].amount}</td>
                                <td id={`t1td3${index}`} key={`t1td3${index}`}></td>
                                <td id={`t1td4${index}`} key={`t1td4${index}`}>{item}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
                <table className="table noPadding" style={{"float":"right","width":"auto","minHeight":"425px","fontSize":"12px"}}>
                    <tbody>
                        <tr>
                            <th>Price</th>
                            <th>Total</th>
                            <th>Amount</th>
                            <th>Count</th>
                        </tr>
                        {Object.keys(asks).map( (item, index) => {
                            return asks[item].amount < 0 && <tr key={`t2${index}`}>
                                <td id={`t2td1${index}`} key={`t2td1${index}`}>{item}</td>
                                <td id={`t2td2${index}`} key={`t2td2${index}`}></td>
                                <td id={`t2td3${index}`} key={`t2td3${index}`}>{asks[item].amount}</td>
                                <td id={`t2td4${index}`} key={`t2td4${index}`}>{asks[item].count}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </Fragment>
    )
}

export default OrderBook;