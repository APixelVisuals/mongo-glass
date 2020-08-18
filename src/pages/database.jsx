import React from "react";
import Tooltip from "react-tooltip";
import Background from "../components/Background";
import SidePanel from "../components/database/SidePanel";
import Popup from "../components/Popup";
import "./database.css";
const { ipcRenderer: ipc } = window.require("electron-better-ipc");
const store = new (window.require("electron-store"))();

export default class Database extends React.Component {

    constructor(props) {
        super(props);

        const connection = store.get("connections").find(c => c.id === this.props.data.connectionID);

        this.state = { connectionName: connection.name };
    };

    render = () => (
        <div id="databases">

            {/* <Background /> */}

            <Tooltip />

            <SidePanel
                setPage={this.props.setPage}
                connectionID={this.props.data.connectionID}
                connectionName={this.state.connectionName}
                database={this.props.data.database}
                setCollection={collection => this.setState({ collection })}
            />

            <div className="content">
                {this.state.collection && (
                    <div>



                    </div>
                )}
            </div>

        </div>
    );
};