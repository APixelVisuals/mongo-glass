import React from "react";
import "./popup.css";

export default class Popup extends React.Component {

    constructor(props) {
        super(props);
        this.backgroundRef = React.createRef();
    };

    render = () => (
        <div id="popup" ref={this.backgroundRef}>
            <div className="popup-content">

                <img src="/wave.svg" className="wave" />

                {this.props.jsx || <p className={`message ${this.props.codeblock && "codeblock"}`}>{this.props.message}</p>}

                <p className={`confirm-button ${this.props.confirmDisabled && "disabled"}`} onClick={this.props.confirmDisabled ? null : this.props.confirm}>{this.props.confirmText || "Confirm"}</p>
                {this.props.cancel && <p className="cancel-button" onClick={this.props.cancel}>{this.props.cancelText || "Cancel"}</p>}

            </div>
        </div>
    );

    componentDidMount = () => document.addEventListener("click", this.mouseClick);

    componentWillUnmount = () => document.removeEventListener("click", this.mouseClick);

    mouseClick = e => {
        if ((e.target === this.backgroundRef.current) && (this.props.cancel)) this.props.cancel();
    };
};