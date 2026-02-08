import Link from "next/link";
import { FormControl, FormSelect } from "react-bootstrap";
export default function Profile() {
  return (
    <div id="wd-profile-screen">
      <h3 className="mb-2 w-75 ms-2">Profile</h3>
      <FormControl
        id="wd-username"
        defaultValue="alice"
        placeholder="username"
        className="mb-2 w-75 ms-2"
      />
      <FormControl
        id="wd-password"
        defaultValue="123"
        placeholder="password"
        type="password"
        className="mb-2 w-75 ms-2"
      />
      <FormControl
        id="wd-firstname"
        defaultValue="Alice"
        placeholder="First Name"
        className="mb-2 w-75 ms-2"
      />
      <FormControl
        id="wd-lastname"
        defaultValue="Wonderland"
        placeholder="Last Name"
        className="mb-2 w-75 ms-2"
      />
      <FormControl id="wd-dob" type="date" className="mb-2 w-75 ms-2" />
      <FormControl
        id="wd-email"
        defaultValue="alice@wonderland.com"
        type="email"
        className="mb-2 w-75 ms-2"
      />
      <FormSelect
        defaultValue="USER"
        id="wd-role"
        className="form-control mb-2 w-75 ms-2"
      >
        <option value="USER">User</option>
        <option value="FACULTY">Faculty</option>
        <option value="STUDENT">Student</option>
      </FormSelect>
      <Link
        href="signin"
        className="btn btn-danger btn-lg w-75 ms-2 text-white text-decoration-none"
        id="wd-signout-btn"
      >
        Signout
      </Link>
    </div>
  );
}
