import React from "react";
import ReactDOM from "react-dom";
import Index from "./pages/index";

class Wrapper extends React.Component {

    constructor(props) {
        super(props);
        this.state = { page: Index };

        this.pages = {
            "/": Index
        };
    };

    render = () => (
        <this.state.page setPage={this.setPage} />
    );

    setPage = path => this.setState({ page: this.pages[path] });
};

ReactDOM.render(<Wrapper />, document.getElementById("root"));