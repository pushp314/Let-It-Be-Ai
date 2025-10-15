
'use client'

import { IUser } from "@/lib/database/models/user.model";
import { Button } from "@/components/ui/button";
import { deleteUser, updateUser } from "@/lib/actions/user.actions";

const UserList = ({ users }: { users: IUser[] }) => {

  const handleRoleChange = (userId: string, newRole: string) => {
    updateUser(userId, { role: newRole })
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.googleId}>
              <td className="px-6 py-4 whitespace-nowrap">{user.firstName} {user.lastName}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.googleId, e.target.value)}
                  className="border-gray-300 rounded-md"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{user.creditBalance}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Button onClick={() => deleteUser(user.googleId)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
