import React from "react";
import deepEqual from "deep-equal";
import SaveWarning from "./SaveWarning";
import "./settings.css";

export default class Settings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    };

    render = () => {

        if (this.props.saveWarningCustomButton) {
            const saveWarningCustomButtonInput = this.props.saveWarningCustomButton.input;
            this.props.saveWarningCustomButton.input = () => saveWarningCustomButtonInput(this.state.data);
        }

        return (
            <div id="settings">

                {this.state.data && (
                    <div className={`settings-wrapper ${(this.state.saveWarning || this.props.alwaysDisplaySaveWarning) && "bottom-padding"}`}>

                        {this.props.settings(
                            this.state.data,
                            this.input,
                            {
                                channels: this.state.channels,
                                roles: this.state.roles,
                                members: this.state.members,
                                emojis: this.state.emojis,
                                emojiList: this.state.emojiList,
                                items: this.state.items,
                                commands: this.state.commands
                            },
                            {
                                maxItems: this.state.maxItems,
                                newItem: this.new,
                                remove: this.remove,
                                dashboardData: this.state.dashboardData
                            }
                        )}

                        <SaveWarning
                            displayed={this.state.saveWarning || this.props.alwaysDisplaySaveWarning}
                            saving={this.props.saving}
                            errors={Boolean(Object.keys(this.state.data).find(d => this.state.data[d].errors && this.state.data[d].errors.length))}
                            reset={this.reset}
                            save={Object.keys(this.state.data).find(d => this.state.data[d].errors && this.state.data[d].errors.length) ? null : () => this.props.save(this.state.data)}
                            customButton={this.props.saveWarningCustomButton}
                        />

                    </div>
                )}

            </div>
        );
    };

    componentDidMount = () => this.getData();

    getData = () => {

        //Parse data
        const data = {};

        Object.keys(this.props.parsers).forEach(d => {

            let value = this.props.parsers[d].initialValue === undefined ? this.props.parsers[d].default : this.props.parsers[d].initialValue;
            value = typeof value === "object" ? JSON.parse(JSON.stringify(value)) : value;

            data[d] = { value, errors: this.props.parsers[d].initialValue === undefined ? this.props.parsers[d].defaultErrors : [] };
        });

        //Set current data
        this.currentData = {};
        for (let d in data) this.currentData[d] = typeof data[d].value === "object" ? JSON.parse(JSON.stringify(data[d].value)) : data[d].value;

        //Set data
        this.setState({
            data,
            saveWarning: false,
            saving: false
        });
    };

    input = (type, value) => {

        //Parse data
        this.props.parsers[type].input(value, this.state.data, this.currentData);

        //Set changed
        this.state.data[type].changed = (!deepEqual(this.state.data[type].value, this.currentData[type]));
        this.setState({ saveWarning: Boolean(Object.keys(this.state.data).find(d => this.state.data[d].changed)) });

        //Force update
        this.forceUpdate();
    };

    reset = () => {

        //Saving
        if (this.props.saving) return;

        //Get data
        this.getData();
    };

};