import React from "react";
import ReactDOM from "react-dom";
import Index from "./pages/index";
import "./index.css";
const { ipcRenderer: ipc } = window.require("electron-better-ipc");
const store = new (window.require("electron-store"))();

(async () => {

    const DEV = await ipc.callMain("isDev");

    class Wrapper extends React.Component {

        constructor(props) {
            super(props);

            this.pages = {
                "/": Index
            };

            const path = ((DEV) && (store.get("lastPage"))) || "/";

            this.state = { page: this.pages[path.split("?")[0]], path };
        };

        render = () => (
            <this.state.page setPage={this.setPage} path={this.state.path} />
        );

        setPage = path => {

            //Set page
            this.setState({ page: this.pages[path.split("?")[0]], path });

            //Set last page
            if (DEV) store.set("lastPage", path);
        };
    };

    ReactDOM.render(<Wrapper />, document.getElementById("root"));
})();