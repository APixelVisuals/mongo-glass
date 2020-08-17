import React from "react";
import Background from "../components/Background";
import Popup from "../components/Popup";
import Settings from "../components/settings/Settings";
import SettingsGroup from "../components/settings/SettingsGroup";
import Setting from "../components/settings/Setting";
import "./edit-connection.css";
const { ipcRenderer: ipc } = window.require("electron-better-ipc");
const store = new (window.require("electron-store"))();

export default class EditConnection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.canceledTestingConnections = [];
    };

    render = () => (
        <div id="edit-connection">

            <Background />

            <h1 className="title">Edit Connection</h1>

            <div className="back-button" onClick={() => this.setState({ cancelWarning: true })} />

            {this.state.cancelWarning && (
                <Popup
                    message="Are you sure you want to discard your changes?"
                    confirm={() => this.props.setPage("/")}
                    cancel={() => this.setState({ cancelWarning: false })}
                />
            )}

            {this.state.deleteWarning && (
                <Popup
                    message="Are you sure you want to delete this connection?"
                    confirm={this.delete}
                    cancel={() => this.setState({ deleteWarning: false })}
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

            <img src="/trash-can.svg" className="delete-button" onClick={() => this.setState({ deleteWarning: true })} />

            {this.state.render && (
                <Settings
                    parsers={{
                        name: {
                            initialValue: this.connection.name,
                            input: (value, { name }) => {

                                name.errors = [];

                                name.value = value;

                                if (!value.length) name.errors.push("You must enter a name");
                                if (value.length > 50) name.errors.push("The name can't be more than 50 characters");
                            }
                        },
                        hostname: {
                            initialValue: this.connection.hostname,
                            input: (value, { hostname }) => hostname.value = value
                        },
                        port: {
                            initialValue: this.connection.port,
                            input: (value, { port }) => port.value = value
                        },
                        srv: {
                            initialValue: this.connection.srv || false,
                            input: (value, { srv }) => srv.value = !srv.value
                        },
                        authenticationEnabled: {
                            initialValue: this.connection.authentication.enabled || false,
                            input: (value, { authenticationEnabled }) => authenticationEnabled.value = !authenticationEnabled.value
                        },
                        username: {
                            initialValue: this.connection.authentication.username || "",
                            input: (value, { username }) => username.value = value
                        },
                        password: {
                            initialValue: this.connection.authentication.password || "",
                            input: (value, { password }) => password.value = value
                        },
                        authenticationDatabase: {
                            initialValue: this.connection.authentication.authenticationDatabase || "",
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
                    saveWarningCustomButton={{
                        icon: "flask",
                        tooltip: "Test Connection",
                        input: this.testConnection
                    }}
                />
            )}

        </div>
    );

    componentDidMount = async () => {

        this.connection = store.get("connections").find(c => c.id === this.props.data.id);
        this.connection.authentication.password = await ipc.callMain("keytar", { keytarFunction: "getPassword", params: ["MongoGlass", this.props.data.id.toString()] });

        this.setState({ render: true });
    };

    save = async data => {

        //Get data
        const connections = store.get("connections");
        const connection = connections.find(c => c.id === this.props.data.id);

        //Set data
        connection.name = data.name.value;
        connection.hostname = data.hostname.value || "127.0.0.1";
        connection.port = parseInt(data.port.value) || 27017;
        connection.srv = data.srv.value || undefined;
        connection.authentication = JSON.parse(JSON.stringify({
            enabled: data.authenticationEnabled.value || undefined,
            username: data.username.value || undefined,
            authenticationDatabase: data.authenticationDatabase.value || "admin"
        }));

        //Save data
        await ipc.callMain("keytar", { keytarFunction: data.password.value ? "setPassword" : "deletePassword", params: ["MongoGlass", this.props.data.id.toString(), data.password.value] });
        store.set("connections", connections);

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

    delete = async () => {

        //Get data
        const connections = store.get("connections");

        //Delete connection
        connections.splice(connections.indexOf(connections.find(c => c.id === this.props.data.id)), 1);

        //Save data
        await ipc.callMain("keytar", { keytarFunction: "deletePassword", params: ["MongoGlass", this.props.data.id.toString()] });
        store.set("connections", connections);

        //Set page
        this.props.setPage("/");
    };
};