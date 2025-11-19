import { useState } from "react";
import { CameraIcon } from "../../components/Icons/CameraIcon";
import { Button } from "../../components/ui/Button/Button";
import { TextInput } from "../../components/ui/TextInput/TextInput";

export default function Account() {
    const [name, setName] = useState("You");
    const [status, setStatus] = useState("Available");

    return (<>
        <style>
            {`
.profile-section {
  width:
  margin-top: 1rem;
}

.profile-photo-section{
  display: flex;
  gap:1rem;
  font-size: 0.85rem;
  color: #929292;
}

.profile-photo-box {
  position: relative;
  width: 5rem;
}

.profile-photo {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
}

.camera-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 0;
  right: 0;
  background: #23c7a7;
  color: white;
  font-size: 14px;
  padding: 0.3rem;
  border-radius: 50%;
  cursor: pointer;
}

.profile-desc{
  text-wrap:auto;
  width: 10rem;
}

label {
  display: block;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #555;
}

input {
  width: 90%;
  padding: 0.7rem;
  margin-top: 0.3rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  outline: 0;
  border: 0;
}


.note {
  margin-top: 0.4rem;
  font-size: 0.85rem;
  color: #929292;
}

.save-btn {
  margin-top: 1.5rem;
  width: 100%;
  padding: 0.8rem;
  background: #23c7a7;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
}

.input-div{
  width: 90%;
}`}
        </style>
        <div className="profile-section">
            <h3>Profile Information</h3>

            <div className="profile-photo-section">
                <div className="profile-photo-box">
                    <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" className="profile-photo" />
                    <div className="camera-icon">
                        <CameraIcon color="#ffffff"></CameraIcon>
                    </div>
                </div>
                <p className="profile-desc">Click the camera icon to change your profile picture</p>
            </div>

            <label>Display Name</label>
            <div className="input-div">
                <TextInput
                    required={true}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <label>Status Message</label>

            <div className="input-div">
                <TextInput
                    required={true}
                    type="text"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                />
            </div>


            <label>Email</label>

            <div className="input-div">
                <TextInput
                    required={true}
                    type="email"
                    value={"user@example.com"}
                    disabled={true}
                />
            </div>

            <p className="note">Email cannot be changed</p>

            <Button>Save Change</Button>

            {/* <button className="save-btn">s</button> */}
        </div>
    </>)
}