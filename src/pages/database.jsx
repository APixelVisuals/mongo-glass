import React from "react";
import Tooltip from "react-tooltip";
import { Editor, EditorState, ContentState } from "draft-js";
import Background from "../components/Background";
import SidePanel from "../components/SidePanel";
import Popup from "../components/Popup";
import parseSize from "../scripts/parseSize";
import "./database.css";
const { ipcRenderer: ipc } = window.require("electron-better-ipc");
const store = new (window.require("electron-store"))();

export default class Database extends React.Component {

    constructor(props) {

        super(props);

        const connection = store.get("connections").find(c => c.id === this.props.data.connectionID);

        this.state = { connectionName: connection.name, editorState: EditorState.createWithContent(ContentState.createFromText("{\n    \n}")) };
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
                boxShadowOffset={50}
                name="Collections"
                items={this.state.collections && this.state.collections.map(c => ({
                    id: c.name,
                    name: c.name,
                    description: parseSize(c.size),
                    settings: () => this.props.setPage("/connection-settings", { connectionID: this.props.data.connectionID }),
                    selected: c.name === this.state.selectedCollection.name
                }))}
                setItem={item => this.setState({ collection: item })}
            />

            <div className="content">

                <div className="title-bar">
                    {this.state.collections && (
                        <>

                            <p className="name">{this.props.data.database}.{this.state.selectedCollection.name}</p>

                            <p className="title-bar-description">{parseSize(this.state.selectedCollection.size)} <span>&bull;</span> {this.state.selectedCollection.documents} Document{this.state.selectedCollection.documents === 1 ? "" : "s"}</p>

                            <img src="/gear.svg" className="settings-button" onClick={() => this.props.setPage("/connection-settings", { connectionID: this.props.data.connectionID })} />

                        </>
                    )}
                </div>

                {this.state.collections && (
                    <div>

                        <div className="header">
                            <img src="edit.svg" className="icon" />
                            <p className="text">Query</p>
                        </div>

                        <div className="query-editor">
                            <Editor
                                editorState={this.state.editorState}
                                onChange={editorState => this.setState({ editorState })}
                                blockStyleFn={contentBlock => ({ unstyled: "query-text" }[contentBlock.getType()])}
                                onFocus={e => e.target.parentElement.classList.add("focused")}
                                onBlur={e => e.target.parentElement.classList.remove("focused")}
                            />
                        </div>

                    </div>
                )}

            </div>

        </div>
    );

    componentDidMount = async () => {

        //Get collections
        let collections = await ipc.callMain("getCollections", { database: this.props.data.database });
        collections = collections.sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : 0));

        //Set data
        await this.setState({ collections, selectedCollection: collections[0] });
    };

};