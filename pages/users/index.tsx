import { useEffect, useState } from 'react';

// Define the User type
interface User {
  _id: string;
  F_name: string;
  L_name: string;
}

export default function UsersPage() {
  // Use the User type for the state
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
    }
    fetchData();
  }, []);

  return (
    <ul>
      {users.map(user => (
        <li key={user._id}>
          {user.F_name} {user.L_name}
        </li>
      ))}
    </ul>
  );
}
