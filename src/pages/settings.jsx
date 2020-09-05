import React from "react";
import Tooltip from "react-tooltip";
import Background from "../components/Background";
import SidePanel from "../components/SidePanel";
import SettingsModule from "../components/settings/Settings";
import SettingsGroup from "../components/settings/SettingsGroup";
import Setting from "../components/settings/Setting";
import Popup from "../components/Popup";
import "./settings.css";
const store = new (window.require("electron-store"))();

export default class Settings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    };

    render = () => (
        <div id="settings-page">

            {/* <Background /> */}

            <Tooltip />

            <SidePanel
                title="Settings"
                back={() => this.props.setPage("/")}
                items={[
                    {
                        id: null,
                        name: "Global"
                    }
                ]}
                setItem={item => this.setState({ connectionID: item })}
            />

            <div className="content">

                <div className="title">
                    <img src="/gear-green.svg" className="icon" />
                    <h1 className="text">Settings</h1>
                </div>

                {this.state.defaults && (
                    <SettingsModule
                        parsers={{
                            infiniteScroll: {
                                default: this.state.defaults.infiniteScroll,
                                input: (value, { infiniteScroll }) => infiniteScroll.value = !infiniteScroll.value
                            },
                            richDocuments: {
                                default: this.state.defaults.richDocuments,
                                input: (value, { richDocuments }) => richDocuments.value = !richDocuments.value
                            },
                            indentationSpaces: {
                                default: this.state.defaults.indentationSpaces,
                                input: (value, { indentationSpaces }) => indentationSpaces.value = value
                            }
                        }}
                        settings={(data, input) => (
                            <div>

                                <SettingsGroup>

                                    <Setting
                                        name="infiniteScroll"
                                        title="Infinite Scroll"
                                        type="toggle"
                                        input={input}
                                        value={data.infiniteScroll.value}
                                    />

                                    <Setting
                                        name="richDocuments"
                                        title="Rich Documents"
                                        type="toggle"
                                        input={input}
                                        value={data.richDocuments.value}
                                    />

                                    <Setting
                                        name="indentationSpaces"
                                        title="Indentation Spaces"
                                        type="slider"
                                        input={input}
                                        min={0}
                                        max={12}
                                        value={data.indentationSpaces.value}
                                    />

                                </SettingsGroup>

                            </div>
                        )}
                        save={this.save}
                    />
                )}

            </div>

        </div>
    );

    componentDidMount = () => this.setDefaults();

    setDefaults = async () => {

        //Get data
        const defaults = store.get("settings") || {};
        if (defaults.infiniteScroll === undefined) defaults.infiniteScroll = true;
        if (defaults.richDocuments === undefined) defaults.richDocuments = true;
        if (defaults.indentationSpaces === undefined) defaults.indentationSpaces = 4;

        //Set defaults
        await this.setState({ defaults: null });
        this.setState({ defaults });
    };

    save = data => {

        //Get data
        const settings = store.get("settings") || {};

        //Set data
        settings.infiniteScroll = data.infiniteScroll.value;
        if (settings.infiniteScroll) delete settings.infiniteScroll;

        settings.richDocuments = data.richDocuments.value;
        if (settings.richDocuments) delete settings.richDocuments;

        settings.indentationSpaces = data.indentationSpaces.value;
        if (settings.indentationSpaces === 4) delete settings.indentationSpaces;

        //Save data
        store.set("settings", settings);

        //Set defaults
        this.setDefaults();
    };
};