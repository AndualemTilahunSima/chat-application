import { Button } from "../../components/ui/Button/Button";
import { Select } from "../../components/ui/Select/Select";

export default function Personalization() {
    return (<>
        <style>
            {`
            .profile-section{
            }
            Select{
            margin-bottom:2rem;
            }
        `}
        </style>
        <div className="profile-section">
            <h5>Apperance</h5>
            <h5>Theme</h5>
            <Select></Select>
            <Button>Save Change</Button>
        </div>
    </>)
}