import React from "react";
import ReactDOM from "react-dom";
import Index from "./pages/index";
import NewConnection from "./pages/new-connection";
import EditConnection from "./pages/edit-connection";
import "./index.css";
const { ipcRenderer: ipc } = window.require("electron-better-ipc");
const store = new (window.require("electron-store"))();

(async () => {

    const DEV = await ipc.callMain("isDev");

    class Wrapper extends React.Component {

        constructor(props) {
            super(props);

            this.pages = {
                "/": Index,
                "/new-connection": NewConnection,
                "/edit-connection": EditConnection
            };

            const lastPage = ((DEV && store.get("lastPage")) || { path: "/" });

            this.state = { page: this.pages[lastPage.path], data: lastPage.data };
        };

        render = () => (
            <this.state.page setPage={this.setPage} data={this.state.data} />
        );

        setPage = (path, data) => {

            //Set data
            this.setState({ page: this.pages[path], data });

            //Set last page
            if (DEV) store.set("lastPage", JSON.parse(JSON.stringify({ path, data })));
        };
    };

    ReactDOM.render(<Wrapper />, document.getElementById("root"));
})();