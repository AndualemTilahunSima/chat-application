import { useState, useRef } from "react";
import { CameraIcon } from "../../../components/Icons/CameraIcon";
import { Button } from "../../../components/ui/Button/Button";
import { TextInput } from "../../../components/ui/TextInput/TextInput";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { selectAuthProfile, uploadProfileImage } from "../../../store/slices/authSlice";

export default function Account() {
    const [name, setName] = useState("You");
    const [status, setStatus] = useState("Available");
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const profile = useAppSelector(selectAuthProfile);
    const dispatch = useAppDispatch();

    const handleCameraClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !profile?.token) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (e.g., max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        setUploading(true);
        try {
            await dispatch(uploadProfileImage({ file, token: profile.token })).unwrap();
        } catch (error) {
            console.error('Failed to upload profile image:', error);
            alert('Failed to upload profile image. Please try again.');
        } finally {
            setUploading(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const profileImageUrl = profile?.profileImageUrl || profile?.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop";

    return (
        <section className="settings-panel">
            <h3 className="settings-panel-title">Profile Information</h3>

            <div className="profile-photo-section">
                <div className="profile-photo-box">
                    <img
                        src={profileImageUrl}
                        className="profile-photo"
                        alt="Profile"
                    />
                    <button
                        type="button"
                        className="camera-icon"
                        aria-label="Change profile picture"
                        onClick={handleCameraClick}
                        disabled={uploading}
                    >
                        <CameraIcon size={20} color="#ffffff" />
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </div>
                <p className="profile-desc">
                    {uploading ? 'Uploading...' : 'Click the camera icon to change your profile picture'}
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

