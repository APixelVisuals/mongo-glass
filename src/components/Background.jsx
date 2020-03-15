import React from "react";
import "./background.scss";

export default class Background extends React.Component {

    render = () => (
        <div id="background">

            <img src="/wave.svg" className="wave" />

            <div className="top-left-corner" />
            <div className="bottom-right-corner" />

        </div>
    );
};