import React from "react";
import "./sidePanel.css";

export default class SidePanel extends React.Component {

    constructor(props) {
        super(props);
    };

    render = () => (
        <div id="side-panel" style={{ boxShadow: `25px ${this.props.boxShadowOffset || 0}px 0px 0px #152c1950, 50px ${this.props.boxShadowOffset || 0}px 0px 0px #152c1925` }}>

            <div className={`title-section ${!this.props.settings && "margin"}`}>

                <div className="side-panel-back-button" onClick={this.props.back} />

                <div className="name">
                    <p className="name-main">{this.props.title}</p>
                    {this.props.description && <p className="name-description">{this.props.description}</p>}
                </div>

                {this.props.settings && <img src="/gear.svg" className="settings-button" onClick={this.props.settings} />}

            </div>

            <div className="divider" />

            {this.props.name && <p className="items-name">{this.props.name}</p>}

            <div className="items">
                {this.props.items && this.props.items.map(i => (
                    <div className={`item ${!i.settings && "center"} ${i.selected && "selected"}`} onClick={() => this.props.setItem(i.id)}>

                        <p className="name">{i.name}</p>
                        <p className="item-description">{i.description}</p>

                        {i.settings && <img src="/gear.svg" className="settings-button" onClick={i.settings} />}

                    </div>
                ))}
            </div>

        </div>
    );
};