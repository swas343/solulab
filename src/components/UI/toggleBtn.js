import { useRef } from "react";
const ToggleButton = (props) =>{
    const check = useRef();

    // const checked = props.socket ? 'checked': ''

    const socketHandler = () =>{
        props.socketHandler(check.current.checked);
    }
    
    return (
        <div className="row">
            <label>Toggle Websocket</label>
            <div className="form-check form-switch">
                <input className="form-check-input" onClick={socketHandler} ref={check} type="checkbox" id="flexSwitchCheckDefault" style={{"marginLeft":"46%","fontSize":"50px"}} checked={props.socket}/>
            </div>

        </div>
    )
}

export default ToggleButton;