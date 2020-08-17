import React from "react";

export default class Number extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    };

    render = () => {
        return (
            <input type="text" className={`textbox ${this.props.errors && this.props.errors.length && "errors"}`} onFocus={() => this.setState({ textboxValue: this.props.value })} onInput={e => this.setState({ textboxValue: e.target.value })} onBlur={e => this.input(e.target.value)} value={this.state.textboxValue === undefined ? this.props.value : this.state.textboxValue} placeholder={this.props.placeholder} />
        );
    };

    input = value => {

        value = parseInt(value) || 0;

        if (value < this.props.min) value = this.props.min;
        if (value > this.props.max) value = this.props.max;

        this.props.input(value);

        this.setState({ textboxValue: undefined });
    };

};