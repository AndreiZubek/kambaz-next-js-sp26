"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PeopleTable from "../Table";
import * as usersClient from "../../../../account/client";
import * as enrollmentsClient from "../../../../enrollments/client";

type Enrollment = {
  _id: string;
  user: string;
  course: string;
};

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

  const fetchUsers = useCallback(async () => {
    if (!cid || Array.isArray(cid)) {
      return;
    }

    try {
      const [enrollments, allUsers]: [Enrollment[], User[]] = await Promise.all(
        [
          enrollmentsClient.fetchEnrollmentsForCourse(cid),
          usersClient.findAllUsers(),
        ],
      );

      const enrolledUserIds = new Set(
        enrollments.map((enrollment) => enrollment.user),
      );
      const enrolledUsers = allUsers.filter((user) =>
        enrolledUserIds.has(user._id),
      );
      setUsers(enrolledUsers);
    } catch (error) {
      console.error(error);
      setUsers([]);
    }
  }, [cid]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  return (
    <div id="wd-people-table">
      <PeopleTable users={users} fetchUsers={fetchUsers} />
    </div>
  );
}
