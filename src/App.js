import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col } from 'react-bootstrap';
import Card from './components/Card';
import OrderBook from './components/OrderBook';
import { useState } from 'react';
import ToggleButton from './components/UI/toggleBtn';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useSelector,useDispatch } from 'react-redux';

function App() {
  const [socket, setSocket] = useState(true);
  const notification = useSelector(state => state.ticker.notification);

  const socketHandler = (value) =>{
    setSocket(state => value);
  }
  
  const notify = (msg) => toast(msg);

  if(notification){
    notify(notification);
  }

  return (
    <div className="App">
      <ToastContainer />

      <ToggleButton socketHandler={socketHandler} socket={socket}/>
      
      <Row>
        <Col sm={4} md={4} lg={4}>
          <Card socketHandler={socketHandler} socket={socket} />
        </Col>
        <Col lg={8}>
          <OrderBook socketHandler={socketHandler} socket={socket}/>
        </Col>
      </Row>
    </div>
  );
}

export default App;
