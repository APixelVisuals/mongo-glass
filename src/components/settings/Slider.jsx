import React from "react";
import reactSlider from "rc-slider";
import "rc-slider/assets/index.css";
import "./slider.css";

const ReactSlider = reactSlider.createSliderWithTooltip(reactSlider);

export default class Slider extends React.Component {

    constructor(props) {
        super(props);
        this.componentRef = React.createRef();
    };

    render = () => {
        return (
            <div id="slider" ref={this.componentRef}>

                <ReactSlider
                    value={this.props.value}
                    onChange={data => {
                        if (this.componentRef.current.querySelector(".rc-slider-tooltip")) this.componentRef.current.querySelector(".rc-slider-tooltip").style.left = `${parseInt(window.getComputedStyle(this.componentRef.current.querySelector(".rc-slider-handle")).getPropertyValue("left")) + (data > this.props.value ? 75 : -100)}px`;
                        this.props.input(data);
                    }}
                    min={this.props.min}
                    max={this.props.max}
                />

            </div>
        );
    };

};