"use client"

import React, { useEffect } from "react";
import { useUserStore } from "../../../store/useUserStore";

export default function AdminUsers() {
  const { users, fetchAllUsers, loading, error, updateUserRole, deleteUser } = useUserStore();

  useEffect(() => {
    fetchAllUsers().catch(console.error);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div>
      <h1>Users</h1>
      <table>
        <thead>
          <tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => updateUserRole(user.id, user.role === "user" ? "owner" : "user")}>
                  Toggle Role
                </button>
                <button onClick={() => deleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
