import { useEffect, useState } from 'react';
// import useTicker from '../hooks/useTicker';
import { useSelector, useDispatch } from 'react-redux';
import { tickerActions } from '../store/ticker';

import Loader from './loader';

const Card = (props) =>{
    const dispatch = useDispatch();
    const [ws, setWs] = useState(null)

    const connect = () =>{
        let msg = JSON.stringify({
            event: 'subscribe', 
            channel: 'ticker', 
            symbol: 'tBTCUSD' 
        })
        
        let ws = new WebSocket('wss://api-pub.bitfinex.com/ws/2')
        
        ws.onmessage = res => {
          let data = JSON.parse(res.data);
          if(Array.isArray(data)){
            if(data[1].length > 2){
                dispatch(tickerActions.updateData({data:data[1]}))
                // setTickerData(data[1])
            }
          }
        }
        
        ws.onopen = () => {
          dispatch(tickerActions.updateLoading(false));
          setWs(ws)
          ws.send(msg)
        }

        ws.onclose = () => {
            ws.close();
        }

        ws.onerror = function(err) {
            setInterval(function() {
                // dispatch(tickerActions.updateNotification("Connecting"))
                connect();
            }, 10000);
        };

    }

    useEffect( () =>{
        if(props.socket){
            connect()    
        }else{
            ws.close()
        }
        
    },[props.socket]);

    const tickerData = useSelector(state => state.ticker);

    const [BID_SIZE,ASK,ASK_PERIOD,ASK_SIZE,DAILY_CHANGE,DAILY_CHANGE_RELATIVE,LAST_PRICE,VOLUME,HIGH,LOW] = tickerData.data;

    const isLoading = tickerData.isLoading;
    const isNegative = Math.sign(DAILY_CHANGE) > 0 ? 'green' : 'red';

    if(isLoading){
        return <Loader/>
    }

    return (

        <div className="ui-panel row bg-wrap main-ticker custom-scrollbar">
            <div className="col-md-3">
                <img src="https://static.bitfinex.com/images/icons/BTC-alt.svg" alt="bitcoin logo" style={{"width":"100%"}} />
            </div>
            <div className="col-md-9">
                <table className="text-start col-md-12">
                    <tbody>
                        <tr>
                            <td> <u>BTC/USD</u></td>
                            <td className="white">{LAST_PRICE.toFixed()}</td>
                        </tr>
                        <tr>
                            <td>VOL <u className="white">{(VOLUME*LAST_PRICE).toFixed()}</u> USD</td>
                            <td className={isNegative}> {DAILY_CHANGE.toFixed(2)} ({DAILY_CHANGE_RELATIVE.toFixed(2)}%)</td>
                        </tr>
                        <tr>
                            <td className="white">Low {LOW}</td>
                            <td className="white">High {HIGH}</td>
                        </tr>
                        <tr>
                            <td><u className="white">Your BTC/USD Rank</u></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    )
}

export default Card;