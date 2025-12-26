import "./CustomerProfile.css";
import { ProfileInfo } from "../Common/ProfileInfo";
import Container from "@mui/material/Container";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
export function CustomerProfile() {
  return (
    <div className="customer-profile shared">
      <Container maxWidth="xl">
        <div className="head">
          <ManageAccountsOutlinedIcon className="icon" />
          <h2 className="s-title">Profile</h2>
        </div>
        <div className="content">
          <ProfileInfo />
        </div>
      </Container>
    </div>
  );
}
