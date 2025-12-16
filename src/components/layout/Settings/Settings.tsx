import { useState } from "react";
import "./Settings.css";
import Account from "./Account";
import Personalization from "./Personalization";
import SettingPanel from "./SettingPanel";

export default function Settings() {
  const [tab, setTab] = useState("account");


  return (
    <div className="settings-container" >
      <div className="settings-left">
        <h2>Settings</h2>
        <div className="settings-tabs">
          <button
            className={tab === "account" ? "active" : ""}
            onClick={() => setTab("account")}
          >
            Account
          </button>

          <button
            className={tab === "personalization" ? "active" : ""}
            onClick={() => setTab("personalization")}
          >
            Personalization
          </button>
        </div>

        {tab === "account" && (
          <Account></Account>
        )}

        {tab === "personalization" && (
          <Personalization></Personalization>
        )}
      </div>

      <div className="settings-right">
       <SettingPanel></SettingPanel>
      </div>
    </div>
  );
}
