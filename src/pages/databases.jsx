import React from "react";
import Tooltip from "react-tooltip";
import Background from "../components/Background";
import Popup from "../components/Popup";
import "./databases.css";
const { ipcRenderer: ipc } = window.require("electron-better-ipc");
const store = new (window.require("electron-store"))();

export default class Databases extends React.Component {

    constructor(props) {
        super(props);

        const connection = store.get("connections").find(c => c.id === this.props.data.connectionID);

        this.state = { connectionName: connection.name };
    };

    render = () => (
        <div id="databases">

            <Background />

            <Tooltip />

            <h1 className="title">{this.state.connectionName}</h1>

            <div className="back-button" onClick={() => this.props.setPage("/")} />

            {this.state.deleteDatabase && (
                <Popup
                    jsx={(
                        <div className="delete-database">

                            <h1 className="name">Delete Database</h1>

                            <p className="delete-database-description">To delete <span>{this.state.deleteDatabase}</span>, enter its name</p>

                            <input type="text" className="textbox" onInput={e => this.setState({ deleteDatabaseConfirmText: e.target.value })} value={this.state.deleteDatabaseConfirmText} />

                        </div>
                    )}
                    confirm={this.deleteDatabase}
                    confirmDisabled={this.state.deleteDatabase !== this.state.deleteDatabaseConfirmText}
                    cancel={() => this.setState({ deleteDatabase: null, deleteDatabaseConfirmText: null })}
                />
            )}

            {this.state.deleteDatabaseError && (
                <Popup
                    message={this.state.deleteDatabaseError}
                    codeblock={true}
                    confirm={() => this.setState({ deleteDatabaseError: null })}
                    confirmText="Close"
                />
            )}

            <p className="description">Databases</p>

            {this.state.databases && (
                <div className="databases">

                    <img
                        src="/admin.svg"
                        data-tip="Admin Database"
                        data-effect="solid"
                        data-class="tooltip"
                        className="admin-database-button"
                        onMouseOver={Tooltip.rebuild}
                        onClick={() => this.props.setPage("/database", { connectionID: this.props.data.connectionID, database: "admin" })}
                    />

                    <img
                        src="/replication.svg"
                        data-tip="Local Database"
                        data-effect="solid"
                        data-class="tooltip"
                        className="local-database-button"
                        onClick={() => this.props.setPage("/database", { connectionID: this.props.data.connectionID, database: "local" })}
                    />

                    {this.state.databases.map(d => (
                        <div className="database">

                            <div className="content">

                                <div className="name">
                                    <div className="icon">
                                        <img src="/database.svg" className="image" />
                                        <img src="/new.svg" className="new" />
                                    </div>
                                    <p className="text">{d.name}</p>
                                </div>

                                <p className="size">{d.size < 1000000 ? `${(d.size / 1000).toFixed(2)} KB` : (d.size < 1000000000 ? `${(d.size / 1000000).toFixed(2)} MB` : `${(d.size / 1000000000).toFixed(2)} GB`)}</p>

                                <div className="collections">
                                    <img src="/document-collection.svg" className="icon" />
                                    <p className="text">{d.collections} Collection{d.collections === 1 ? "" : "s"}</p>
                                </div>

                            </div>

                            <div className="buttons">
                                <p className="view-button" onClick={() => this.props.setPage("/database", { connectionID: this.props.data.connectionID, database: d.name })}>View</p>
                                <p className="delete-button" onClick={() => this.setState({ deleteDatabase: d.name })}>Delete Database</p>
                            </div>

                        </div>
                    ))}

                    <div className="new-database" onClick={() => this.props.setPage("/new-database", { connectionID: this.props.data.connectionID })}>

                        <div className="content">
                            <img src="/new.svg" className="icon" />
                            <p className="text">New Database</p>
                        </div>

                    </div>

                </div>
            )}

        </div>
    );

    componentDidMount = async () => {

        //Get databases
        const databases = await ipc.callMain("getDatabases");

        //Set data
        this.setState({ databases });
    };

    deleteDatabase = async () => {

        //Delete database
        const error = await ipc.callMain("deleteDatabase", { database: this.state.deleteDatabase });

        //Error
        if (error) return this.setState({ deleteDatabaseError: error, deleteDatabase: null, deleteDatabaseConfirmText: null });

        //Set data
        this.state.databases.splice(this.state.databases.indexOf(this.state.databases.find(d => d.name === this.state.deleteDatabase)), 1);
        this.setState({ deleteDatabase: null, deleteDatabaseConfirmText: null });
    };
};