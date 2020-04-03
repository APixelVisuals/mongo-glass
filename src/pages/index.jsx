import React from "react";
import Background from "../components/Background";
import "./index.css";
const store = new (window.require("electron-store"))();

export default class Index extends React.Component {

    constructor(props) {
        super(props);
        this.connections = store.get("connections") || [];
    };

    render = () => (
        <div id="index">

            <Background />

            <div className="title">
                <img src="/mongo-glass.svg" className="logo" />
                <h1 className="text">MongoGlass</h1>
            </div>

            <p className="description">Connections</p>

            <div className="connections">

                {this.connections.map(c => (
                    <div className="connection">

                        <div className="content">

                            <p className="name">{c.name}</p>

                            <p className="host">{c.hostname}<span className={c.srv ? "srv" : "port"}>{c.srv ? "SRV" : `:${c.port}`}</span></p>

                            {((c.authentication.enabled) && (c.authentication.username)) && (
                                <div className="user">
                                    <img src="/person.svg" className="icon" />
                                    <p className="text">{c.authentication.username}</p>
                                </div>
                            )}

                        </div>

                        <div className="buttons">
                            <p className="connect-button" onClick={() => this.props.setPage("/databases", { id: c.id })}>Connect</p>
                            <p className="edit-button" onClick={() => this.props.setPage("/edit-connection", { id: c.id })}>Edit Connection</p>
                        </div>

                    </div>
                ))}

                <div className="new-connection" onClick={() => this.props.setPage("/new-connection")}>

                    <div className="content">
                        <img src="/new.svg" className="icon" />
                        <p className="text">New Connection</p>
                    </div>

                </div>

            </div>

        </div>
    );
};