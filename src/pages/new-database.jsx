import React from "react";
import ToggleSwitch from "react-switch";
import Background from "../components/Background";
import Popup from "../components/Popup";
import Dropdown from "../components/Dropdown";
import Slider from "../components/Slider";
import "./new-database.css";
const { ipcRenderer: ipc } = window.require("electron-better-ipc");
const store = new (window.require("electron-store"))();

export default class NewDatabase extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.customCollationRef = React.createRef();
        this.cappedCollectionRef = React.createRef();
    };

    render = () => (
        <div id="new-database">

            <Background />

            <h1 className="title">New Database</h1>

            {this.state.databases && (
                <div>

                    <div className="back-button" onClick={() => this.setState({ cancelWarning: true })} />

                    {this.state.cancelWarning && (
                        <Popup
                            message="Are you sure you want to discard this database?"
                            confirm={() => this.props.setPage("/databases", { connectionID: this.props.data.connectionID })}
                            cancel={() => this.setState({ cancelWarning: false })}
                        />
                    )}

                    {this.state.createDatabaseError && (
                        <Popup
                            message={this.state.createDatabaseError}
                            codeblock={true}
                            confirm={() => this.setState({ createDatabaseError: null })}
                            confirmText="Close"
                        />
                    )}

                    <div className="settings">

                        <div className="setting">
                            <p className="name">Database Name</p>
                            <input type="text" className={`textbox ${this.state.data.name.errors.length && "errors"}`} onInput={e => this.input("name", e.target.value)} value={this.state.data.name.value} />
                            {this.state.data.name.errors.map(e => (
                                <div className="error">
                                    <img src="/cross.svg" />
                                    <p>{e}</p>
                                </div>
                            ))}
                        </div>

                        <div className="divider" />

                        <div className="setting">
                            <p className="name">Collection Name</p>
                            <input type="text" className={`textbox ${this.state.data.collectionName.errors.length && "errors"}`} onInput={e => this.input("collectionName", e.target.value)} value={this.state.data.collectionName.value} />
                            {this.state.data.collectionName.errors.map(e => (
                                <div className="error">
                                    <img src="/cross.svg" />
                                    <p>{e}</p>
                                </div>
                            ))}
                        </div>

                        <div className="divider" />

                        <div className="custom-collation" style={{ height: ((this.state.cappedCollectionEnabled) && (this.cappedCollectionRef.current)) ? this.cappedCollectionRef.current.scrollHeight : "33px" }} ref={this.cappedCollectionRef}>

                            <div className="setting-title">
                                <p className="text">Capped Collection</p>
                                <ToggleSwitch
                                    checked={this.state.cappedCollectionEnabled}
                                    onChange={() => this.setState({ cappedCollectionEnabled: !this.state.cappedCollectionEnabled })}
                                    onColor="#24a03c"
                                    offColor="#262f28"
                                    width={55}
                                    height={25}
                                    checkedIcon={false}
                                    uncheckedIcon={false}
                                    activeBoxShadow={null}
                                    className="toggle-switch"
                                />
                            </div>

                            <div className="setting">
                                <p className="name">Maximum Size (Bytes)</p>
                                <input type="text" className="textbox" onInput={e => this.input("cappedCollectionMaximumSize", e.target.value)} value={this.state.data.cappedCollectionMaximumSize.value || ""} />
                            </div>

                            <div className="setting">
                                <p className="name">Maximum Documents</p>
                                <input type="text" className="textbox" onInput={e => this.input("cappedCollectionMaximumDocuments", e.target.value)} value={this.state.data.cappedCollectionMaximumDocuments.value || ""} />
                            </div>

                        </div>

                        <div className="divider" />

                        <div className="custom-collation" style={{ height: ((this.state.customCollationEnabled) && (this.customCollationRef.current)) ? this.customCollationRef.current.scrollHeight : "33px" }} ref={this.customCollationRef}>

                            <div className="setting-title">
                                <p className="text">Custom Collation</p>
                                <ToggleSwitch
                                    checked={this.state.customCollationEnabled}
                                    onChange={() => this.setState({ customCollationEnabled: !this.state.customCollationEnabled })}
                                    onColor="#24a03c"
                                    offColor="#262f28"
                                    width={55}
                                    height={25}
                                    checkedIcon={false}
                                    uncheckedIcon={false}
                                    activeBoxShadow={null}
                                    className="toggle-switch"
                                />
                            </div>

                            <div className="locale-settings">

                                <div className="setting">
                                    <p className="name">Locale</p>
                                    <Dropdown
                                        options={this.locales.map(l => ({ value: l.code, label: l.name }))}
                                        value={this.state.data.locale.value}
                                        input={value => this.input("locale", value)}
                                    />
                                </div>

                                {this.locales.find(l => l.code === this.state.data.locale.value).variants && (
                                    <div className="setting">
                                        <p className="name">Locale Variant</p>
                                        <Dropdown
                                            options={[{ value: null, label: "None", className: "none" }, ...this.locales.find(l => l.code === this.state.data.locale.value).variants]}
                                            value={this.state.data.localeVariant.value}
                                            input={value => this.input("localeVariant", value)}
                                            placeholder="None"
                                        />
                                    </div>
                                )}

                            </div>

                            <div className="setting">
                                <p className="name">Strength</p>
                                <Slider
                                    value={this.state.data.strength.value}
                                    input={value => this.input("strength", value)}
                                    min={1}
                                    max={5}
                                />
                            </div>

                            <div className="setting setting-toggle-switch">
                                <p className="name">Case Level</p>
                                <ToggleSwitch
                                    checked={this.state.data.caseLevel.value}
                                    onChange={() => this.input("caseLevel")}
                                    onColor="#24a03c"
                                    offColor="#262f28"
                                    width={55}
                                    height={25}
                                    checkedIcon={false}
                                    uncheckedIcon={false}
                                    activeBoxShadow={null}
                                    className="toggle-switch"
                                />
                            </div>

                            <div className="setting-wrapper">
                                <div className="setting">
                                    <p className="name">Case First</p>
                                    <Dropdown
                                        options={["off", "upper", "lower"]}
                                        value={this.state.data.caseFirst.value}
                                        input={value => this.input("caseFirst", value)}
                                    />
                                </div>
                            </div>

                            <div className="setting setting-toggle-switch">
                                <p className="name">Numeric Ordering</p>
                                <ToggleSwitch
                                    checked={this.state.data.numericOrdering.value}
                                    onChange={() => this.input("numericOrdering")}
                                    onColor="#24a03c"
                                    offColor="#262f28"
                                    width={55}
                                    height={25}
                                    checkedIcon={false}
                                    uncheckedIcon={false}
                                    activeBoxShadow={null}
                                    className="toggle-switch"
                                />
                            </div>

                            <div className="setting-wrapper">
                                <div className="setting">
                                    <p className="name">Alternate</p>
                                    <Dropdown
                                        options={["non-ignorable", "shifted"]}
                                        value={this.state.data.alternate.value}
                                        input={value => this.input("alternate", value)}
                                    />
                                </div>
                            </div>

                            <div className="setting-wrapper">
                                <div className="setting">
                                    <p className="name">Max Variable</p>
                                    <Dropdown
                                        options={["punct", "space"]}
                                        value={this.state.data.maxVariable.value}
                                        input={value => this.input("maxVariable", value)}
                                    />
                                </div>
                            </div>

                            <div className="setting setting-toggle-switch">
                                <p className="name">Backwards</p>
                                <ToggleSwitch
                                    checked={this.state.data.backwards.value}
                                    onChange={() => this.input("backwards")}
                                    onColor="#24a03c"
                                    offColor="#262f28"
                                    width={55}
                                    height={25}
                                    checkedIcon={false}
                                    uncheckedIcon={false}
                                    activeBoxShadow={null}
                                    className="toggle-switch"
                                />
                            </div>

                            <div className="setting setting-toggle-switch">
                                <p className="name">Normalization</p>
                                <ToggleSwitch
                                    checked={this.state.data.normalization.value}
                                    onChange={() => this.input("normalization")}
                                    onColor="#24a03c"
                                    offColor="#262f28"
                                    width={55}
                                    height={25}
                                    checkedIcon={false}
                                    uncheckedIcon={false}
                                    activeBoxShadow={null}
                                    className="toggle-switch"
                                />
                            </div>

                        </div>

                    </div>

                    <p className={`save-button ${this.state.nameError && "error"}`} onClick={this.save}>Save</p>
                    <p className="cancel-button" onClick={() => this.setState({ cancelWarning: true })}>Cancel</p>

                </div>
            )}

        </div>
    );

    componentDidMount = async () => {

        //Get databases
        const databases = await ipc.callMain("getDatabases", { namesOnly: true });

        //Set locales
        this.locales = [
            { code: "af", name: "Afrikaans" },
            { code: "sq", name: "Albanian" },
            { code: "am", name: "Amharic" },
            { code: "ar", name: "Arabic", variants: ["compat"] },
            { code: "hy", name: "Armenian" },
            { code: "as", name: "Assamese" },
            { code: "az", name: "Azeri", variants: ["search"] },
            { code: "bn", name: "Bengali", variants: ["traditional"] },
            { code: "be", name: "Belarusian" },
            { code: "bs", name: "Bosnian", variants: ["search"] },
            { code: "bs_Cyrl", name: "Bosnian (Cyrillic)" },
            { code: "bg", name: "Bulgarian" },
            { code: "my", name: "Burmese" },
            { code: "ca", name: "Catalan", variants: ["search"] },
            { code: "chr", name: "Cherokee" },
            { code: "zh", name: "Chinese", variants: ["big5han", "gb2312han", "unihan", "zhuyin"] },
            { code: "zh_Hant", name: "Chinese (Traditional)" },
            { code: "hr", name: "Croatian", variants: ["search"] },
            { code: "cs", name: "Czech", variants: ["search"] },
            { code: "da", name: "Danish", variants: ["search"] },
            { code: "nl", name: "Dutch" },
            { code: "dz", name: "Dzongkha" },
            { code: "en", name: "English" },
            { code: "en_US", name: "English (United States)" },
            { code: "en_US_POSIX", name: "English (United States, Computer)	" },
            { code: "eo", name: "Esperanto" },
            { code: "et", name: "Estonian" },
            { code: "ee", name: "Ewe" },
            { code: "fo", name: "Faroese" },
            { code: "fil", name: "Filipino" },
            { code: "fi", name: "Finnish", variants: ["search", "traditional"] },
            { code: "fr", name: "French" },
            { code: "fr_CA", name: "French (Canada)" },
            { code: "gl", name: "Galician", variants: ["search"] },
            { code: "ka", name: "Georgian" },
            { code: "de", name: "German", variants: ["search", "eor", "phonebook"] },
            { code: "de_AT", name: "German (Austria)", variants: ["phonebook"] },
            { code: "el", name: "Greek" },
            { code: "gu", name: "Gujarati" },
            { code: "ha", name: "Hausa" },
            { code: "haw", name: "Hawaiian" },
            { code: "he", name: "Hebrew", variants: ["search"] },
            { code: "hi", name: "Hindi" },
            { code: "hu", name: "Hungarian" },
            { code: "is", name: "Icelandic", variants: ["search"] },
            { code: "ig", name: "Igbo" },
            { code: "smn", name: "Inari Sami", variants: ["search"] },
            { code: "id", name: "Indonesian" },
            { code: "ga", name: "Irish" },
            { code: "it", name: "Italian" },
            { code: "ja", name: "Japanese", variants: ["unihan"] },
            { code: "kl", name: "Kalaallisut", variants: ["search"] },
            { code: "kn", name: "Kannada", variants: ["traditional"] },
            { code: "kk", name: "Kazakh" },
            { code: "km", name: "Khmer" },
            { code: "kok", name: "Konkani" },
            { code: "ko", name: "Korean", variants: ["search", "searchjl", "unihan"] },
            { code: "ky", name: "Kyrgyz" },
            { code: "lkt", name: "Lakota" },
            { code: "lo", name: "Lao" },
            { code: "lv", name: "Latvian" },
            { code: "ln", name: "Lingala", variants: ["phonetic"] },
            { code: "lt", name: "Lithuanian" },
            { code: "dsb", name: "Lower Sorbian" },
            { code: "lb", name: "Luxembourgish" },
            { code: "mk", name: "Macedonian" },
            { code: "ms", name: "Malay" },
            { code: "ml", name: "Malayalam" },
            { code: "mt", name: "Maltese" },
            { code: "mr", name: "Marathi" },
            { code: "mn", name: "Mongolian" },
            { code: "ne", name: "Nepali" },
            { code: "se", name: "Northern Sami", variants: ["search"] },
            { code: "nb", name: "Norwegian Bokmål", variants: ["search"] },
            { code: "nn", name: "Norwegian Nynorsk", variants: ["search"] },
            { code: "or", name: "Oriya" },
            { code: "om", name: "Oromo" },
            { code: "ps", name: "Pashto" },
            { code: "fa", name: "Persian" },
            { code: "fa_AF", name: "Persian (Afghanistan)" },
            { code: "pl", name: "Polish" },
            { code: "pt", name: "Portuguese" },
            { code: "pa", name: "Punjabi" },
            { code: "ro", name: "Romanian" },
            { code: "ru", name: "Russian" },
            { code: "sr", name: "Serbian" },
            { code: "sr_Latn", name: "Serbian (Latin)", variants: ["search"] },
            { code: "si", name: "Sinhala", variants: ["dictionary"] },
            { code: "sk", name: "Slovak", variants: ["search"] },
            { code: "sl", name: "Slovenian" },
            { code: "es", name: "Spanish", variants: ["traditional"] },
            { code: "sw", name: "Swahili" },
            { code: "sv", name: "Swedish", variants: ["search"] },
            { code: "ta", name: "Tamil" },
            { code: "te", name: "Telugu" },
            { code: "th", name: "Thai" },
            { code: "bo", name: "Tibetan" },
            { code: "to", name: "Tongan" },
            { code: "tr", name: "Turkish", variants: ["search"] },
            { code: "uk", name: "Ukrainian" },
            { code: "hsb", name: "Upper Sorbian" },
            { code: "ur", name: "Urdu" },
            { code: "ug", name: "Uyghur" },
            { code: "vi", name: "Vietnamese", variants: ["traditional"] },
            { code: "wae", name: "Walser" },
            { code: "cy", name: "Welsh" },
            { code: "yi", name: "Yiddish", variants: ["search"] },
            { code: "yo", name: "Yoruba" },
            { code: "zu", name: "Zulu" }
        ];

        //Set data
        this.setState({
            databases,
            data: {
                name: { value: null, errors: [] },
                collectionName: { value: null, errors: [] },
                cappedCollectionMaximumSize: { value: null },
                cappedCollectionMaximumDocuments: { value: null },
                locale: { value: "en" },
                localeVariant: { value: null },
                strength: { value: 3 },
                caseLevel: { value: false },
                caseFirst: { value: "off" },
                numericOrdering: { value: false },
                alternate: { value: "non-ignorable" },
                maxVariable: { value: "punct" },
                backwards: { value: false },
                normalization: { value: false }
            }
        });
    };

    input = (type, value) => {

        //Get data
        const data = this.state.data[type];
        data.errors = [];

        //Parse data
        if (type === "name") {

            data.value = value;

            if (/[/\\."$ ]/.test(value)) data.errors.push("The name can't contain invalid characters");
            if (this.state.databases.find(d => d.toLowerCase() === value.toLowerCase())) data.errors.push("That name is taken");
        }
        else if (type === "collectionName") {

            data.value = value;

            if ((value) && (!/^[A-Za-z_]/.test(value))) data.errors.push("The name must start with a letter or underscore");
            if (value.includes("$")) data.errors.push("The name can't contain invalid characters");
            if (value.startsWith("system.")) data.errors.push("The name can't start with system.");
        }
        else if (type === "locale") {
            data.value = value;
            this.state.data.localeVariant.value = null;
        }
        else if (type === "cappedCollectionMaximumSize") data.value = parseInt(value) || null;
        else if (type === "cappedCollectionMaximumDocuments") data.value = parseInt(value) || null;
        else if (type === "localeVariant") data.value = value;
        else if (type === "strength") data.value = value;
        else if (type === "caseLevel") data.value = !data.value;
        else if (type === "caseFirst") data.value = value;
        else if (type === "numericOrdering") data.value = !data.value;
        else if (type === "alternate") data.value = value;
        else if (type === "maxVariable") data.value = value;
        else if (type === "backwards") data.value = !data.value;
        else if (type === "normalization") data.value = !data.value;

        //Force update
        this.forceUpdate();
    };

    save = async () => {

        //No name
        if (!this.state.data.name.value) return this.setState({ nameError: true });

        //Create database
        const error = await ipc.callMain("createDatabase", {
            database: this.state.data.name.value,
            collectionData: {
                name: this.state.data.collectionName.value,
                cappedCollection: this.state.data.cappedCollectionEnabled && {
                    maximumSize: this.state.data.cappedCollectionMaximumSize.value,
                    maximumDocuments: this.state.data.cappedCollectionMaximumDocuments.value
                },
                customCollation: this.state.data.customCollationEnabled && {
                    locale: this.state.data.locale.value,
                    localeVariant: this.state.data.localeVariant.value,
                    strength: this.state.data.strength.value,
                    caseLevel: this.state.data.caseLevel.value,
                    caseFirst: this.state.data.caseFirst.value,
                    numericOrdering: this.state.data.numericOrdering.value,
                    alternate: this.state.data.alternate.value,
                    maxVariable: this.state.data.maxVariable.value,
                    backwards: this.state.data.backwards.value,
                    normalization: this.state.data.normalization.value
                }
            }
        });

        //Error
        if (error) return this.setState({ createDatabaseError: error });

        //Set page
        this.props.setPage("/databases", { connectionID: this.props.data.connectionID });
    };
};