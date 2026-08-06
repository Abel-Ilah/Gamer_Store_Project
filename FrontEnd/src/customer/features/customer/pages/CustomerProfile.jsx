import "./CustomerProfile.css";
import { ProfileInfo } from "../../../../common/components/ProfileInfo";

import Container from "@mui/material/Container";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import { useSelector } from "react-redux";

export function CustomerProfile() {
  const { customer } = useSelector((state) => state.customerAuth);
  return (
    <div className="customer-profile shared">
      <Container maxWidth="xl">
        <div className="head">
          <ManageAccountsOutlinedIcon className="icon" />
          <h2 className="s-title">Profile</h2>
        </div>
        <div className="content">
          <ProfileInfo user={customer} />
        </div>
      </Container>
    </div>
  );
}
