import React from "react";
import "./sidePanel.css";
const { ipcRenderer: ipc } = window.require("electron-better-ipc");

export default class SidePanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    };

    render = () => (
        <div id="side-panel">

            <div className="title-section">

                <div className="side-panel-back-button" onClick={() => this.props.setPage("/databases", { connectionID: this.props.connectionID })} />

                <div className="name">
                    <p className="connection">{this.props.connectionName}</p>
                    <p className="database">{this.props.database}</p>
                </div>

                <img src="/gear.svg" className="settings-button" onClick={() => this.props.setPage("/connection-settings", { connectionID: this.props.connectionID })} />

            </div>

            <div className="divider" />

            <p className="collections-name">Collections</p>

            <div className="collections">
                {this.state.collections && this.state.collections.sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : 0)).map(c => (
                    <div className="collection">

                        <p className="name">{c.name}</p>
                        <p className="size">{c.size < 1000000 ? `${(c.size / 1000).toFixed(2)} KB` : (c.size < 1000000000 ? `${(c.size / 1000000).toFixed(2)} MB` : `${(c.size / 1000000000).toFixed(2)} GB`)}</p>

                        <img src="/gear.svg" className="settings-button" onClick={() => this.props.setPage("/connection-settings", { connectionID: this.props.connectionID })} />

                    </div>
                ))}
            </div>

        </div>
    );

    componentDidMount = async () => {

        //Get collections
        const collections = await ipc.callMain("getCollections", { database: this.props.database });

        //Set data
        this.setState({ collections });
    };
};