import React from "react";
import ReactDOM from "react-dom";
import Index from "./pages/index";
import NewConnection from "./pages/new-connection";
import EditConnection from "./pages/edit-connection";
import Databases from "./pages/databases";
import "./index.css";
const { ipcRenderer: ipc } = window.require("electron-better-ipc");
const store = new (window.require("electron-store"))();

(async () => {

    const DEV = await ipc.callMain("isDev");

    class Wrapper extends React.Component {

        constructor(props) {
            super(props);
            this.state = {};

            this.pages = {
                "/": Index,
                "/new-connection": NewConnection,
                "/edit-connection": EditConnection,
                "/databases": Databases
            };

            const lastPage = ((DEV && store.get("lastPage")) || { path: "/" });

            this.setPage(lastPage.path, lastPage.data);
        };

        render = () => this.state.page ? <this.state.page setPage={this.setPage} data={this.state.data} /> : null;

        setPage = async (path, data) => {

            //Set connection
            if ((data) && (data.connectionID) && ((data.connectionID !== this.lastConnectionID))) {

                //Set last connection ID
                this.lastConnectionID = data.connectionID;

                //Close connection
                ipc.callMain("closeConnection");

                //Get connection data
                const connection = store.get("connections").find(c => c.id === data.connectionID);
                const password = await ipc.callMain("keytar", { keytarFunction: "getPassword", params: ["MongoGlass", data.connectionID.toString()] });

                //Connect
                await ipc.callMain("connect", {
                    hostname: connection.hostname,
                    port: connection.port,
                    srv: connection.srv,
                    authenticationEnabled: connection.authentication.enabled,
                    username: connection.authentication.username,
                    password,
                    authenticationDatabase: connection.authentication.authenticationDatabase
                });
            }
            else if ((!data) || (!data.connectionID)) {

                //Set last connection ID
                this.lastConnectionID = undefined;

                //Close connection
                await ipc.callMain("closeConnection");
            }

            //Since state gets updated so quickly, react gets a little confused, awaiting something fixes it
            await (() => new Promise(resolve => resolve()))();

            //Set data
            this.setState({ page: this.pages[path], data });

            //Set last page
            if (DEV) store.set("lastPage", JSON.parse(JSON.stringify({ path, data })));
        };
    };

    ReactDOM.render(<Wrapper />, document.getElementById("root"));
})();