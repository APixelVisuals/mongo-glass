import React from "react";
import Background from "../components/Background";
import Popup from "../components/Popup";
import Settings from "../components/settings/Settings";
import SettingsGroup from "../components/settings/SettingsGroup";
import Setting from "../components/settings/Setting";
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

                    <Settings
                        parsers={{
                            name: {
                                default: "",
                                defaultErrors: ["You must enter a name"],
                                input: (value, { name }) => {

                                    name.errors = [];

                                    name.value = value;

                                    if (!value.length) name.errors.push("You must enter a name");
                                    if (/[/\\."$ ]/.test(value)) name.errors.push("The name can't contain invalid characters");
                                    if (this.state.databases.find(d => d.toLowerCase() === value.toLowerCase())) name.errors.push("That name is taken");
                                }
                            },
                            collectionName: {
                                default: "",
                                defaultErrors: ["You must enter a name"],
                                input: (value, { collectionName }) => {

                                    collectionName.errors = [];

                                    collectionName.value = value;

                                    if (!value.length) collectionName.errors.push("You must enter a name");
                                    if ((value) && (!/^[A-Za-z_]/.test(value))) collectionName.errors.push("The name must start with a letter or underscore");
                                    if (value.includes("$")) collectionName.errors.push("The name can't contain invalid characters");
                                    if (value.startsWith("system.")) collectionName.errors.push(`The name can't start with "system."`);
                                }
                            },
                            cappedCollectionEnabled: {
                                default: false,
                                input: (value, { cappedCollectionEnabled }) => cappedCollectionEnabled.value = !cappedCollectionEnabled.value
                            },
                            maximumSize: {
                                default: 0,
                                input: (value, { maximumSize }) => maximumSize.value = value
                            },
                            maximumDocuments: {
                                default: 0,
                                input: (value, { maximumDocuments }) => maximumDocuments.value = value
                            },
                            customCollationEnabled: {
                                default: false,
                                input: (value, { customCollationEnabled }) => customCollationEnabled.value = !customCollationEnabled.value
                            },
                            locale: {
                                default: "en",
                                input: (value, { locale, localeVariant }) => {
                                    locale.value = value;
                                    localeVariant.value = null;
                                }
                            },
                            localeVariant: {
                                default: null,
                                input: (value, { localeVariant }) => localeVariant.value = value
                            },
                            strength: {
                                default: 3,
                                input: (value, { strength }) => strength.value = value
                            },
                            caseLevel: {
                                default: false,
                                input: (value, { caseLevel }) => caseLevel.value = !caseLevel.value
                            },
                            caseFirst: {
                                default: "off",
                                input: (value, { caseFirst }) => caseFirst.value = value
                            },
                            numericOrdering: {
                                default: false,
                                input: (value, { numericOrdering }) => numericOrdering.value = !numericOrdering.value
                            },
                            alternate: {
                                default: "non-ignorable",
                                input: (value, { alternate }) => alternate.value = value
                            },
                            maxVariable: {
                                default: "punct",
                                input: (value, { maxVariable }) => maxVariable.value = value
                            },
                            backwards: {
                                default: false,
                                input: (value, { backwards }) => backwards.value = !backwards.value
                            },
                            normalization: {
                                default: false,
                                input: (value, { normalization }) => normalization.value = !normalization.value
                            }
                        }}
                        settings={(data, input) => (
                            <div>

                                <SettingsGroup>

                                    <Setting
                                        name="name"
                                        title="Name"
                                        type="textbox"
                                        input={input}
                                        value={data.name.value}
                                        errors={data.name.errors}
                                    />

                                </SettingsGroup>

                                <div className="divider" />

                                <SettingsGroup>

                                    <Setting
                                        name="collectionName"
                                        title="Collection Name"
                                        type="textbox"
                                        input={input}
                                        value={data.collectionName.value}
                                        errors={data.collectionName.errors}
                                    />

                                </SettingsGroup>

                                <div className="divider" />

                                <SettingsGroup
                                    title="Capped Collection"
                                    toggleData={{
                                        name: "cappedCollectionEnabled",
                                        input,
                                        enabled: data.cappedCollectionEnabled.value
                                    }}
                                >

                                    <Setting
                                        name="maximumSize"
                                        title="Maximum Size (Bytes)"
                                        type="number"
                                        input={input}
                                        min={0}
                                        max={65535}
                                        value={data.maximumSize.value || ""}
                                    />

                                    <Setting
                                        name="maximumDocuments"
                                        title="Maximum Documents"
                                        type="number"
                                        input={input}
                                        min={0}
                                        max={65535}
                                        value={data.maximumDocuments.value || ""}
                                    />

                                </SettingsGroup>

                                <div className="divider" />

                                <SettingsGroup
                                    title="Custom Collation"
                                    toggleData={{
                                        name: "customCollationEnabled",
                                        input,
                                        enabled: data.customCollationEnabled.value
                                    }}
                                >

                                    <Setting
                                        name="locale"
                                        title="Locale"
                                        type="dropdown"
                                        input={input}
                                        options={this.locales.map(l => ({ value: l.code, label: l.name }))}
                                        value={data.locale.value}
                                    />

                                    {this.locales.find(l => l.code === data.locale.value).variants && (
                                        <Setting
                                            name="localeVariant"
                                            title="Locale Variant"
                                            type="dropdown"
                                            input={input}
                                            options={[{ value: null, label: "None", className: "none" }, ...this.locales.find(l => l.code === data.locale.value).variants]}
                                            value={data.localeVariant.value}
                                        />
                                    )}

                                    <Setting
                                        name="strength"
                                        title="Strength"
                                        type="slider"
                                        input={input}
                                        min={1}
                                        max={5}
                                        value={data.strength.value}
                                    />

                                    <Setting
                                        name="caseLevel"
                                        title="Case Level"
                                        type="toggle"
                                        input={input}
                                        value={data.caseLevel.value}
                                    />

                                    <Setting
                                        name="caseFirst"
                                        title="Case First"
                                        type="dropdown"
                                        input={input}
                                        options={["off", "upper", "lower"]}
                                        value={data.caseFirst.value}
                                    />

                                    <Setting
                                        name="numericOrdering"
                                        title="Numeric Ordering"
                                        type="toggle"
                                        input={input}
                                        value={data.numericOrdering.value}
                                    />

                                    <Setting
                                        name="alternate"
                                        title="Alternate"
                                        type="dropdown"
                                        input={input}
                                        options={["non-ignorable", "shifted"]}
                                        value={data.alternate.value}
                                    />

                                    <Setting
                                        name="maxVariable"
                                        title="Max Variable"
                                        type="dropdown"
                                        input={input}
                                        options={["punct", "space"]}
                                        value={data.maxVariable.value}
                                    />

                                    <Setting
                                        name="backwards"
                                        title="Backwards"
                                        type="toggle"
                                        input={input}
                                        value={data.backwards.value}
                                    />

                                    <Setting
                                        name="normalization"
                                        title="Normalization"
                                        type="toggle"
                                        input={input}
                                        value={data.normalization.value}
                                    />

                                </SettingsGroup>

                            </div>
                        )}
                        save={this.save}
                        alwaysDisplaySaveWarning={true}
                    />

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

        //Set databases
        this.setState({ databases });
    };

    save = async data => {

        //Create database
        const error = await ipc.callMain("createDatabase", {
            database: data.name.value,
            collectionData: {
                name: data.collectionName.value,
                cappedCollection: data.cappedCollectionEnabled.value && {
                    maximumSize: data.maximumSize.value,
                    maximumDocuments: data.maximumDocuments.value
                },
                customCollation: data.customCollationEnabled.value && {
                    locale: data.locale.value,
                    localeVariant: data.localeVariant.value,
                    strength: data.strength.value,
                    caseLevel: data.caseLevel.value,
                    caseFirst: data.caseFirst.value,
                    numericOrdering: data.numericOrdering.value,
                    alternate: data.alternate.value,
                    maxVariable: data.maxVariable.value,
                    backwards: data.backwards.value,
                    normalization: data.normalization.value
                }
            }
        });

        //Error
        if (error) return this.setState({ createDatabaseError: error });

        //Set page
        this.props.setPage("/databases", { connectionID: this.props.data.connectionID });
    };
};