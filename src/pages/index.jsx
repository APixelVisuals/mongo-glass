import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
const store = new (window.require("electron-store"))();

class Index extends React.Component {

    constructor(props) {
        super(props);
        this.connections = store.get("connections") || [];
    };

    render = () => (
        <div id="index">

            <div className="background">

                <img src="/wave.svg" className="left-wave" />

                <div className="top-left-corner" />
                <div className="bottom-right-corner" />

            </div>

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

                            <p className="host">{c.host}<span>:{c.port}</span></p>

                            {c.authentication && (
                                <div className="user">
                                    <img src="/person.svg" className="icon" />
                                    <p className="text">{c.authentication.username}</p>
                                </div>
                            )}

                        </div>

                        <div className="buttons">
                            <a href={`/database?id=${c.id}`} className="connect-button">Connect</a>
                            <a href={`/edit-connection?id=${c.id}`} className="edit-button">Edit Connection</a>
                        </div>

                    </div>
                ))}

                <a href="/new-connection" className="new-connection">

                    <div className="content">
                        <img src="/new.svg" className="icon" />
                        <p className="text">New Connection</p>
                    </div>

                </a>

            </div>

        </div>
    );
};

ReactDOM.render(<Index />, document.getElementById("root"));