import React from "react";
import Tooltip from "react-tooltip";
import "./saveWarning.css";

export default class SaveWarning extends React.Component {

    constructor(props) {
        super(props);
    };

    render = () => {
        return (
            <div id="save-warning" className={`${this.props.displayed && "displayed"} ${this.props.errors && "errors"}`}>

                <Tooltip />

                {this.props.customButton && <img
                    src={`/${this.props.customButton.icon}.svg`}
                    data-tip={this.props.customButton.tooltip}
                    data-effect="solid"
                    data-class="tooltip"
                    className="custom-button"
                    onClick={this.props.customButton.input}
                />}

                <p className="text">You have unsaved changes!</p>

                <div className="buttons">
                    <p className={`reset-button ${this.props.saving && "saving"}`} onClick={this.props.reset}>Reset</p>
                    <p className={`save-button ${this.props.saving && "saving"} ${this.props.errors && "errors"}`} onClick={this.props.save}>Save</p>
                </div>

            </div>
        );
    };

};