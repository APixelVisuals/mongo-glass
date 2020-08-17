import React from "react";
import ToggleSwitch from "react-switch";
import Number from "./Number";
import Dropdown from "./Dropdown";
import Slider from "./Slider";
import "./setting.css";

export default class Setting extends React.Component {

    constructor(props) {
        super(props);
    };

    render = () => {
        return (
            <div id="setting" className={`${["slider"].includes(this.props.type) && "large"} ${this.props.small && "small"} ${this.props.type === "button" && "setting-button"} ${this.props.type === "slider" && "slider"}`}>

                {this.props.type !== "button" && (
                    <div className={`setting-title ${this.props.type === "toggle" && "setting-title-toggle-switch"}`}>

                        <p className="setting-title-text">{this.props.title}</p>
                        {this.props.alternateOption && <p className="alternate-option-text" onClick={() => this.props.alternateOption.input(this.props.alternateOption.name)}>{this.props.alternateOption.title}</p>}

                        {this.props.type === "toggle" && (
                            <ToggleSwitch
                                checked={this.props.value}
                                onChange={() => this.props.input(this.props.name)}
                                onColor="#24a03c"
                                offColor="#262f28"
                                width={55}
                                height={25}
                                checkedIcon={false}
                                uncheckedIcon={false}
                                activeBoxShadow={null}
                                className="setting-toggle-switch"
                            />
                        )}

                    </div>
                )}

                <div className={`setting-wrapper ${((this.props.toggleData) && (!this.props.toggleData.enabled)) && "disabled"}`}>
                    <div className={`setting ${((this.props.toggleData) && (!this.props.toggleData.enabled)) && "disabled"}`}>

                        {this.props.type === "textbox" && (
                            <input
                                type={this.props.password ? "password" : "text"}
                                className={`textbox ${this.props.errors && this.props.errors.length && "errors"}`}
                                placeholder={this.props.placeholder}
                                onInput={e => this.props.input(this.props.name, e.target.value)}
                                value={this.props.value}
                            />
                        )}

                        {this.props.type === "number" && (
                            <Number
                                placeholder={this.props.placeholder}
                                input={data => this.props.input(this.props.name, data)}
                                value={this.props.value}
                                errors={this.props.errors}
                                min={this.props.min}
                                max={this.props.max}
                            />
                        )}

                        {this.props.type === "button" && (
                            <p className="setting-button-button" onClick={() => this.props.input(this.props.name)}>{this.props.title}</p>
                        )}

                        {this.props.type === "dropdown" && (
                            <Dropdown
                                input={data => this.props.input(this.props.name, data)}
                                value={this.props.value}
                                options={this.props.options}
                            />
                        )}

                        {this.props.type === "slider" && (
                            <Slider
                                input={data => this.props.input(this.props.name, data)}
                                value={this.props.value}
                                min={this.props.min}
                                max={this.props.max}
                            />
                        )}

                        {this.props.errors && this.props.errors.map(e => (
                            <div className="error">
                                <img src="/cross.svg" />
                                <p>{e}</p>
                            </div>
                        ))}

                    </div>
                </div>

            </div>
        );
    };

};