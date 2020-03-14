import React from "react";
import ReactDOM from "react-dom";
import Index from "./pages/index";
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

            this.state = { page: this.pages[(((DEV) && (store.get("lastPage"))) || "/").split("?")[0]] };
        };

        render = () => (
            <this.state.page setPage={this.setPage} />
        );

        setPage = path => {

            //Set page
            this.setState({ page: this.pages[path.split("?")[0]] });

            //Set last page
            if (DEV) store.set("lastPage", path);
        };
    };

    ReactDOM.render(<Wrapper />, document.getElementById("root"));
})();