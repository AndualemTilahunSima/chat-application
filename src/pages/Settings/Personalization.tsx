import { useState } from "react";
import { Button } from "../../components/ui/Button/Button";
import { Select } from "../../components/ui/Select/Select";

export default function Personalization() {
    const [theme, setTheme] = useState("light");

    return (
        <section className="settings-panel">
            <h3 className="settings-panel-title">Appearance</h3>
            <p className="settings-panel-description">
                Choose how ChatApp looks on your device.
            </p>

            <div className="settings-input-group">
                <label htmlFor="themeSelect">Theme</label>
                <Select
                    value={theme}
                    onChange={setTheme}
                    id="themeSelect"
                    name="theme"
                />
            </div>

            <Button type="button" className="settings-submit-btn">
                Save Changes
            </Button>
        </section>
    );
}