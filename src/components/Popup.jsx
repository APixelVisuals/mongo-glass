import React from "react";
import "./popup.scss";

export default class Popup extends React.Component {

    constructor(props) {
        super(props);
        this.backgroundRef = React.createRef();
    };

    render = () => (
        <div id="popup" ref={this.backgroundRef}>
            <div className="popup-content">

                <img src="/wave.svg" className="wave" />

                <p className="message">{this.props.message}</p>

                <p className="confirm-button" onClick={this.props.confirm}>Confirm</p>
                <p className="cancel-button" onClick={this.props.cancel}>Cancel</p>

            </div>
        </div>
    );

    componentDidMount = () => document.addEventListener("click", this.mouseClick);

    componentWillUnmount = () => document.removeEventListener("click", this.mouseClick);

    mouseClick = e => {
        if (e.target === this.backgroundRef.current) this.props.cancel();
    };
};