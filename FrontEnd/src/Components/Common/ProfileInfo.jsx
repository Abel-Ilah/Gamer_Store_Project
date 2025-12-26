import "./ProfileInfo.css";
import Avatar from "@mui/material/Avatar";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import DoneIcon from "@mui/icons-material/Done";
import Button from "@mui/material/Button";

const user = {
  firstName: "Ibrahim",
  lastName: "Saadani",
  email: "ibrahimsaadani12@gmail.com",
  address:
    "Douar Ezzaouia Lagfifat Ouled Teima ain sbaa sebta beni mellal morocco africa earth",
  phoneNumber: "0696252364",
  role: "Admin",
  createdAt: "2025-07-25",
  isEmailConfirmed: false,
};
export function ProfileInfo() {
  return (
    <div className="profile-info">
      <header className="mt-4">
        <div className="row">
          <div className="left col-12 col-md-8 d-flex flex-column flex-md-row gap-3 align-items-center text-center text-md-start">
            <Avatar className="avatar" />
            <div className="details">
              <h3 className="name">{user.firstName + " " + user.lastName}</h3>
              <p className="user-type ">
                <span>{user.role}</span> | <time>{user.createdAt}</time>
              </p>
            </div>
          </div>
          <div className="right col-12 col-md-4 d-flex justify-content-md-end justify-content-center align-items-start mt-3 mt-md-0">
            <Button
              startIcon={<DeleteOutlineOutlinedIcon />}
              variant="outlined"
              className="delete-btn"
            >
              Delete Account
            </Button>
          </div>
        </div>
      </header>

      <section className="personal-info d-flex flex-column flex-md-row gap-3 justify-content-between text-start mt-4">
        <div className="left">
          <h5 className="section-title mb-4">Personal Information</h5>
          <div className="info row ">
            <div className="item col-12 col-md-6  mb-3">
              <p className="label">First Name</p>
              <p className="value">{user.firstName}</p>
            </div>
            <div className="item col-12 col-md-6 mb-3">
              <p className="label">Last Name</p>
              <p className="value">{user.lastName}</p>
            </div>
            <div className="item col-12 col-md-6 mb-3">
              <p className="label">Address</p>
              <p className="value">{user.address}</p>
            </div>
            <div className="item col-12 col-md-6 mb-3">
              <p className="label">Phone</p>
              <p className="value">{user.phoneNumber}</p>
            </div>
          </div>
        </div>

        <div className="right">
          <Button
            className="edit-btn"
            startIcon={<EditOutlinedIcon />}
            variant="outlined"
          >
            Edit
          </Button>
        </div>
      </section>

      <section className="login-info mt-4 text-start">
        <h5 className="section-title  mb-4">Login Information</h5>
        <div className="item email">
          <p className="label">Email</p>
          <div className="d-flex flex-wrap align-items-center column-gap-4">
            <p className="value d-flex align-items-end gap-3">
              {user.email}
              {user.isEmailConfirmed ? (
                <span title="email verified">
                  <DoneIcon className="icon verified" />
                </span>
              ) : (
                <span title="email not verified">
                  <WarningAmberIcon className="icon unverified" />
                </span>
              )}
            </p>
            {!user.isEmailConfirmed && (
              <Button className="button verify mt-1 d-block text-start">
                verify
              </Button>
            )}
          </div>
        </div>
        <div className="item mt-3">
          <p className="label">Password</p>
          <div className="d-flex flex-wrap align-items-center column-gap-4">
            <p className="value mt-1">**************</p>
            <Button className="button change-password  ">
              Change Password
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
