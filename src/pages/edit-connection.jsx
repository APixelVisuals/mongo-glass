import React from "react";
import ToggleSwitch from "react-switch";
import Background from "../components/Background";
import Popup from "../components/Popup";
import "./edit-connection.css";
const { ipcRenderer: ipc } = window.require("electron-better-ipc");
const store = new (window.require("electron-store"))();

export default class EditConnection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.canceledTestingConnections = [];
        this.authenticationRef = React.createRef();

        this.id = parseInt(this.props.path.split("?id=")[1]);
        const connection = store.get("connections").find(c => c.id === this.id);

        this.state.name = connection.name;
        this.state.hostname = connection.hostname;
        this.state.port = connection.port;
        this.state.srv = connection.srv;
        this.state.authenticationEnabled = connection.authentication.enabled;
        this.state.username = connection.authentication.username;
        this.state.authenticationDatabase = connection.authentication.authenticationDatabase;

        (async () => this.setState({ password: await ipc.callMain("keytar", { keytarFunction: "getPassword", params: ["MongoGlass", this.id.toString()] }) }))();
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

            <div className="settings">

                <div className="setting">
                    <p className="name">Name</p>
                    <input type="text" className={`textbox ${this.state.nameError && "error"}`} onInput={e => this.setState({ name: e.target.value, nameError: false })} value={this.state.name} />
                    {this.state.nameError && <p className="name-error">You must provide a name</p>}
                </div>

                <div className="host">

                    <div className="setting">
                        <p className="name">Hostname</p>
                        <input type="text" className="textbox" onInput={e => this.setState({ hostname: e.target.value })} value={this.state.hostname} placeholder="127.0.0.1" />
                    </div>

                    <div className="setting small">
                        {this.state.srv ?
                            (
                                <p className="disable-srv-button" onClick={() => this.setState({ srv: false })}>Disable SRV</p>
                            ) :
                            (
                                <div>
                                    <p className="name">Port <span onClick={() => this.setState({ srv: true })}>Use SRV</span></p>
                                    <input type="text" className="textbox" onInput={e => this.setState({ port: e.target.value.replace(/[^0-9]/g, "") })} value={this.state.port} placeholder="27017" />
                                </div>
                            )
                        }
                    </div>

                </div>

                <div className="divider" />

                <div className="authentication" style={{ height: ((this.state.authenticationEnabled) && (this.authenticationRef.current)) ? this.authenticationRef.current.scrollHeight : "33px" }} ref={this.authenticationRef}>

                    <div className="setting-title">
                        <p className="text">Authentication</p>
                        <ToggleSwitch
                            checked={this.state.authenticationEnabled}
                            onChange={() => this.setState({ authenticationEnabled: !this.state.authenticationEnabled })}
                            onColor="#24a03c"
                            offColor="#262f28"
                            width={55}
                            height={25}
                            checkedIcon={false}
                            uncheckedIcon={false}
                            activeBoxShadow={null}
                            className="toggle-switch"
                        />
                    </div>

                    <div className="setting">
                        <p className="name">Username</p>
                        <input type="text" className="textbox" tabIndex={this.state.authenticationEnabled ? "0" : "-1"} onInput={e => this.setState({ username: e.target.value })} value={this.state.username} />
                    </div>

                    <div className="setting">
                        <p className="name">Password</p>
                        <input type="password" className="textbox" tabIndex={this.state.authenticationEnabled ? "0" : "-1"} onInput={e => this.setState({ password: e.target.value })} value={this.state.password} />
                    </div>

                    <div className="setting">
                        <p className="name">Authentication Database</p>
                        <input type="text" className="textbox" tabIndex={this.state.authenticationEnabled ? "0" : "-1"} onInput={e => this.setState({ authenticationDatabase: e.target.value })} value={this.state.authenticationDatabase} placeholder="admin" />
                    </div>

                </div>

            </div>

            <div className="save-test-buttons">
                <p className={`save-button ${this.state.nameError && "error"}`} onClick={this.save}>Save</p>
                <img
                    src="/flask.svg"
                    data-tip="Test Connection"
                    data-effect="solid"
                    data-class="tooltip"
                    className="test-button"
                    onClick={this.testConnection}
                />
            </div>
            <p className="cancel-button" onClick={() => this.setState({ cancelWarning: true })}>Cancel</p>

        </div>
    );

    componentDidMount = () => this.forceUpdate();

    save = async () => {

        //Get data
        const connections = store.get("connections");
        const connection = connections.find(c => c.id === this.id);

        //No name
        if (!this.state.name) return this.setState({ nameError: true });

        //Set data
        connection.name = this.state.name;
        connection.hostname = this.state.hostname || "127.0.0.1";
        connection.port = parseInt(this.state.port) || 27017;
        connection.srv = this.state.srv || undefined;
        connection.authentication = JSON.parse(JSON.stringify({
            enabled: this.state.authenticationEnabled || undefined,
            username: this.state.username || undefined,
            authenticationDatabase: this.state.authenticationDatabase || "admin"
        }));

        //Save data
        await ipc.callMain("keytar", { keytarFunction: this.state.password ? "setPassword" : "deletePassword", params: ["MongoGlass", this.id.toString(), this.state.password] });
        store.set("connections", connections);

        //Set page
        this.props.setPage("/");
    };

    testConnection = async () => {

        //Generate testing connection ID
        const testingConnectionID = `${Date.now()}${Math.floor(Math.random() * 99) + 1}`;

        //Set testing connection
        await this.setState({ testingConnection: true, testingConnectionID });

        //Test connection
        const result = await ipc.callMain("testConnection", {
            hostname: this.state.hostname,
            port: this.state.port,
            srv: this.state.srv,
            authenticationEnabled: this.state.authenticationEnabled,
            username: this.state.username,
            password: this.state.password,
            authenticationDatabase: this.state.authenticationDatabase
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
        connections.splice(connections.indexOf(connections.find(c => c.id === this.id)), 1);

        //Save data
        await ipc.callMain("keytar", { keytarFunction: "deletePassword", params: ["MongoGlass", this.id.toString()] });
        store.set("connections", connections);

        //Set page
        this.props.setPage("/");
    };
};