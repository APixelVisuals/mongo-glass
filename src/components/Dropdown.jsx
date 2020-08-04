import React from "react";
import ReactDropdown from "react-dropdown";
import "react-dropdown/style.css";
import "./dropdown.css";

export default class Dropdown extends React.Component {

    constructor(props) {
        super(props);
    };

    render = () => (
        <ReactDropdown
            options={this.props.options}
            value={this.props.value}
            onChange={({ value }) => this.props.input(value)}
            className="dropdown"
            controlClassName="dropdown-control"
            placeholderClassName="dropdown-text"
            arrowClassName="dropdown-arrow"
            menuClassName="dropdown-menu"
            placeholder={this.props.placeholder}
        />
    );
};