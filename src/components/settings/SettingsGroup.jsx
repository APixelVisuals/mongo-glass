import React from "react";
import ToggleSwitch from "react-switch";
import "./settingsGroup.css";

export default class SettingsGroup extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.settingsRef = React.createRef();
    };

    render = () => {

        const contentDisplayable = ((!this.props.toggleData) || (this.props.toggleData.enabled));
        const contentDisplayed = ((contentDisplayable) && (!this.state.collapsed));

        return (
            <div id="settings-group">

                {this.props.title && (
                    <div className="settings-group-title">

                        <div className={`collapsable-wrapper ${(!contentDisplayable) && "content-hidden"}`} onClick={((this.props.collapsable) && (contentDisplayable)) && (() => this.setState({ collapsed: !this.state.collapsed }))}>

                            {this.props.collapsable && <div className={`arrow ${this.state.collapsed && "collapsed"} ${(!contentDisplayable) && "content-hidden"}`} />}

                            <p className="text">{this.props.title}</p>

                        </div>

                        {this.props.toggleData && (
                            <ToggleSwitch
                                checked={this.props.toggleData.enabled}
                                onChange={() => this.props.toggleData.input(this.props.toggleData.name)}
                                onColor="#24a03c"
                                offColor="#262f28"
                                width={55}
                                height={25}
                                checkedIcon={false}
                                uncheckedIcon={false}
                                activeBoxShadow={null}
                                className="toggle-switch"
                            />
                        )}

                    </div>
                )}

                <div className="settings-group-settings-wrapper" style={{ height: this.props.toggleData ? (((contentDisplayed) && (this.settingsRef.current)) ? this.settingsRef.current.scrollHeight : "0px") : "auto" }}>
                    <div className={`settings-group-settings ${this.props.inline && "inline"}`} ref={this.settingsRef}>
                        {(contentDisplayed || this.props.toggleData) && this.props.children}
                    </div>
                </div>

            </div>
        );
    };

    componentDidMount = () => this.forceUpdate();

};