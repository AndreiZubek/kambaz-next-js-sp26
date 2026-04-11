"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PeopleTable from "../Table";
import * as coursesClient from "../../../client";
import * as usersClient from "../../../../account/client";
import * as enrollmentsClient from "../../../../enrollments/client";
import { useSelector } from "react-redux";

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  loginId: string;
  section?: string;
  role?: string;
  lastActivity?: string;
  totalActivity?: string;
};

export default function PeopleTableCourses() {
  const { cid } = useParams();
  const [users, setUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const currentUserRole = useSelector(
    (state) =>
      (state as { accountReducer?: { currentUser?: { role?: unknown } } })
        .accountReducer?.currentUser?.role,
  );
  const isFaculty =
    currentUserRole === "FACULTY" ||
    currentUserRole === "ADMIN" ||
    currentUserRole === "TA";

  const fetchUsers = async () => {
    if (!cid || Array.isArray(cid)) {
      return;
    }

    try {
      const enrolledUsers: User[] = await coursesClient.findUsersForCourse(cid);
      setUsers(enrolledUsers);
    } catch (error) {
      console.error(error);
      setUsers([]);
    }
  };

  useEffect(() => {
    if (!cid || Array.isArray(cid)) {
      return;
    }

    coursesClient
      .findUsersForCourse(cid)
      .then((enrolledUsers: User[]) => {
        setUsers(enrolledUsers);
      })
      .catch((error) => {
        console.error(error);
        setUsers([]);
      });
  }, [cid]);

  useEffect(() => {
    usersClient
      .findAllUsers()
      .then((data: User[]) => setAllUsers(data))
      .catch((error) => {
        console.error(error);
        setAllUsers([]);
      });
  }, []);

  const nonEnrolledUsers = allUsers.filter(
    (u) => !users.some((enrolledUser) => enrolledUser._id === u._id),
  );

  const handleEnrollPerson = async () => {
    if (!cid || Array.isArray(cid) || !selectedUserId) {
      return;
    }
    try {
      await enrollmentsClient.enrollUserInCourse(selectedUserId, cid);
      setSelectedUserId("");
      await fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div id="wd-people-table">
      {isFaculty && (
        <div className="d-flex align-items-center gap-2 mb-3">
          <select
            className="form-select w-auto"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            <option value="">Select user to enroll</option>
            {nonEnrolledUsers.map((user) => (
              <option key={user._id} value={user._id}>
                {user.firstName} {user.lastName} ({user.loginId})
              </option>
            ))}
          </select>
          <button
            className="btn btn-primary"
            onClick={handleEnrollPerson}
            disabled={!selectedUserId}
            id="wd-enroll-person"
          >
            Enroll People
          </button>
        </div>
      )}
      <PeopleTable users={users} fetchUsers={fetchUsers} />
    </div>
  );
}
