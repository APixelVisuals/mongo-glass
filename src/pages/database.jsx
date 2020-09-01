import React from "react";
import Tooltip from "react-tooltip";
import Background from "../components/Background";
import SidePanel from "../components/SidePanel";
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
                title={this.state.connectionName}
                description={this.props.data.database}
                back={() => this.props.setPage("/databases", { connectionID: this.props.data.connectionID })}
                settings={() => this.props.setPage("/connection-settings", { connectionID: this.props.data.connectionID })}
                name="Collections"
                items={this.state.collections && this.state.collections.sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : 0)).map(c => ({
                    id: c.name,
                    name: c.name,
                    description: c.size < 1000000 ? `${(c.size / 1000).toFixed(2)} KB` : (c.size < 1000000000 ? `${(c.size / 1000000).toFixed(2)} MB` : `${(c.size / 1000000000).toFixed(2)} GB`),
                    settings: () => this.props.setPage("/connection-settings", { connectionID: this.props.data.connectionID })
                }))}
                setItem={item => this.setState({ collection: item })}
            />

            <div className="content">
                {this.state.collection && (
                    <div>



                    </div>
                )}
            </div>

        </div>
    );

    componentDidMount = async () => {

        //Get collections
        const collections = await ipc.callMain("getCollections", { database: this.props.data.database });

        //Set data
        this.setState({ collections });
    };
};