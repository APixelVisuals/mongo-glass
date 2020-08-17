import React from "react";
import Background from "../components/Background";
import Popup from "../components/Popup";
import Settings from "../components/settings/Settings";
import SettingsGroup from "../components/settings/SettingsGroup";
import Setting from "../components/settings/Setting";
import "./new-connection.css";
const { ipcRenderer: ipc } = window.require("electron-better-ipc");
const store = new (window.require("electron-store"))();

export default class NewConnection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.canceledTestingConnections = [];
    };

    render = () => (
        <div id="new-connection">

            <Background />

            <h1 className="title">New Connection</h1>

            <div className="back-button" onClick={() => this.setState({ cancelWarning: true })} />

            {this.state.cancelWarning && (
                <Popup
                    message="Are you sure you want to discard this connection?"
                    confirm={() => this.props.setPage("/")}
                    cancel={() => this.setState({ cancelWarning: false })}
                />
            )}

            {this.state.testingConnection && (
                <Popup
                    message={this.state.testingConnectionResult ? (this.state.testingConnectionResult.success ? "Successfully Connected to MongoDB!" : this.state.testingConnectionResult.error) : "Connecting..."}
                    codeblock={this.state.testingConnectionResult && this.state.testingConnectionResult.error}
                    confirm={this.cancelTestConnection}
                    confirmText={this.state.testingConnectionResult ? "Close" : "Cancel"}
                />
            )}

            <Settings
                parsers={{
                    name: {
                        default: "",
                        defaultErrors: ["You must enter a name"],
                        input: (value, { name }) => {

                            name.errors = [];

                            name.value = value;

                            if (!value.length) name.errors.push("You must enter a name");
                            if (value.length > 50) name.errors.push("The name can't be more than 50 characters");
                        }
                    },
                    hostname: {
                        default: "",
                        input: (value, { hostname }) => hostname.value = value
                    },
                    port: {
                        default: 0,
                        input: (value, { port }) => port.value = value
                    },
                    srv: {
                        default: false,
                        input: (value, { srv }) => srv.value = !srv.value
                    },
                    authenticationEnabled: {
                        default: false,
                        input: (value, { authenticationEnabled }) => authenticationEnabled.value = !authenticationEnabled.value
                    },
                    username: {
                        default: "",
                        input: (value, { username }) => username.value = value
                    },
                    password: {
                        default: "",
                        input: (value, { password }) => password.value = value
                    },
                    authenticationDatabase: {
                        default: "",
                        input: (value, { authenticationDatabase }) => authenticationDatabase.value = value
                    }
                }}
                settings={(data, input) => (
                    <div>

                        <SettingsGroup>

                            <Setting
                                name="name"
                                title="Name"
                                type="textbox"
                                input={input}
                                value={data.name.value}
                                errors={data.name.errors}
                            />

                        </SettingsGroup>

                        <SettingsGroup inline={true}>

                            <Setting
                                name="hostname"
                                title="Hostname"
                                type="textbox"
                                placeholder="127.0.0.1"
                                input={input}
                                value={data.hostname.value}
                            />

                            {data.srv.value ?
                                (
                                    <Setting
                                        name="srv"
                                        title="Disable SRV"
                                        type="button"
                                        input={input}
                                    />
                                ) :
                                (
                                    <Setting
                                        name="port"
                                        title="Port"
                                        type="number"
                                        small={true}
                                        placeholder="27017"
                                        input={input}
                                        min={0}
                                        max={65535}
                                        value={data.port.value || ""}
                                        alternateOption={{
                                            name: "srv",
                                            title: "Use SRV",
                                            input,
                                            enabled: data.srv.value
                                        }}
                                    />
                                )
                            }

                        </SettingsGroup>

                        <div className="divider" />

                        <SettingsGroup
                            title="Authentication"
                            toggleData={{
                                name: "authenticationEnabled",
                                input,
                                enabled: data.authenticationEnabled.value
                            }}
                        >

                            <Setting
                                name="username"
                                title="Username"
                                type="textbox"
                                input={input}
                                value={data.username.value}
                                errors={data.username.errors}
                            />

                            <Setting
                                name="password"
                                title="Password"
                                type="textbox"
                                password={true}
                                input={input}
                                value={data.password.value}
                                errors={data.password.errors}
                            />

                            <Setting
                                name="authenticationDatabase"
                                title="Authentication Database"
                                type="textbox"
                                placeholder="admin"
                                input={input}
                                value={data.authenticationDatabase.value}
                                errors={data.authenticationDatabase.errors}
                            />

                        </SettingsGroup>

                    </div>
                )}
                save={this.save}
                alwaysDisplaySaveWarning={true}
                saveWarningCustomButton={{
                    icon: "flask",
                    tooltip: "Test Connection",
                    input: this.testConnection
                }}
            />

        </div>
    );

    save = async data => {

        //Get data
        const connections = store.get("connections") || [];
        const nextConnectionID = store.get("nextConnectionID") || 1;

        //Add connection
        connections.push(JSON.parse(JSON.stringify({
            id: nextConnectionID,
            name: data.name.value,
            hostname: data.hostname.value || "127.0.0.1",
            port: parseInt(data.port.value) || 27017,
            srv: data.srv.value || undefined,
            authentication: {
                enabled: data.authenticationEnabled.value || undefined,
                username: data.username.value || undefined,
                authenticationDatabase: data.authenticationDatabase.value || "admin"
            }
        })));

        //Save data
        if (data.password.value) await ipc.callMain("keytar", { keytarFunction: "setPassword", params: ["MongoGlass", nextConnectionID.toString(), data.password.value] });

        store.set("connections", connections);
        store.set("nextConnectionID", nextConnectionID + 1);

        //Set page
        this.props.setPage("/");
    };

    testConnection = async data => {

        //Generate testing connection ID
        const testingConnectionID = `${Date.now()}${Math.floor(Math.random() * 99) + 1}`;

        //Set testing connection
        await this.setState({ testingConnection: true, testingConnectionID });

        //Test connection
        const result = await ipc.callMain("connect", {
            hostname: data.hostname.value,
            port: data.port.value,
            srv: data.srv.value,
            authenticationEnabled: data.authenticationEnabled.value,
            username: data.username.value,
            password: data.password.value,
            authenticationDatabase: data.authenticationDatabase.value,
            testConnection: true
        });

        //Set testing connection result
        if (!this.canceledTestingConnections.includes(testingConnectionID)) this.setState({ testingConnectionResult: result });
    };

    cancelTestConnection = () => {

        //Add to canceled testing connections
        this.canceledTestingConnections.push(this.state.testingConnectionID);

        //Set testing connection
        this.setState({ testingConnection: false, testingConnectionID: null, testingConnectionResult: null });
    };
};