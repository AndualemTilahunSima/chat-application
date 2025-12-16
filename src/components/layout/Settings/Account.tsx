import { useState } from "react";
import { CameraIcon } from "../../../components/Icons/CameraIcon";
import { Button } from "../../../components/ui/Button/Button";
import { TextInput } from "../../../components/ui/TextInput/TextInput";
import { useAppSelector } from "../../../store/hooks";
import { selectAuthProfile } from "../../../store/slices/authSlice";

export default function Account() {
    const [name, setName] = useState("You");
    const [status, setStatus] = useState("Available");
    const profile = useAppSelector(selectAuthProfile);

    return (
        <section className="settings-panel">
            <h3 className="settings-panel-title">Profile Information</h3>

            <div className="profile-photo-section">
                <div className="profile-photo-box">
                    <img
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
                        className="profile-photo"
                        alt="Profile"
                    />
                    <button
                        type="button"
                        className="camera-icon"
                        aria-label="Change profile picture"
                    >
                        <CameraIcon size={20} color="#ffffff" />
                    </button>
                </div>
                <p className="profile-desc">
                    Click the camera icon to change your profile picture
                </p>
            </div>

            <div className="settings-input-group">
                <label htmlFor="displayName">Display Name</label>
                <TextInput
                    required
                    type="text"
                    id="displayName"
                    value={profile?.displayName || name}
                    onChange={(event) => setName(event.target.value)}
                />
            </div>

            <div className="settings-input-group">
                <label htmlFor="statusMessage">Status Message</label>
                <TextInput
                    required
                    type="text"
                    id="statusMessage"
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                />
            </div>

            <div className="settings-input-group">
                <label htmlFor="emailAddress">Email</label>
                <TextInput
                    required
                    type="email"
                    id="emailAddress"
                    value={profile?.email || name}
                    disabled
                />
                <p className="settings-note">Email cannot be changed</p>
            </div>

            <Button type="button" className="settings-submit-btn">
                Save Changes
            </Button>
        </section>
    );
}

