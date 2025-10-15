'use client'
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAllUsers, getUserById } from '@/lib/actions/user.actions';
import UserList from '@/components/shared/UserList';
import { IUser } from '@/lib/database/models/user.model';
import { getAllTransactions } from '@/lib/actions/transaction.action';
import TransactionList from '@/components/shared/TransactionList';
import { ITransaction } from '@/lib/database/models/transaction.model';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const AdminPage = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<IUser | null>(null);
  const [users, setUsers] = useState<IUser[]>([]);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState('');
  const [transactionSearch, setTransactionSearch] = useState('');
  const [userPage, setUserPage] = useState(1);
  const [transactionPage, setTransactionPage] = useState(1);

  useEffect(() => {
    // FIX: Cast the session user to include the 'id' property.
    // NOTE: A more permanent solution is to augment the 'next-auth' module in a `next-auth.d.ts` file.
    const typedUser = session?.user as { id: string; name?: string | null; email?: string | null; image?: string | null; };

    if (status === 'authenticated' && typedUser?.id) {
      const fetchData = async () => {
        try {
          setLoading(true);
          // FIX: Use the 'id' from the correctly typed user object.
          const fetchedUser = await getUserById(typedUser.id);
          setUser(fetchedUser);

          if (fetchedUser.role !== 'admin') {
            redirect('/');
          }

          const fetchedUsers = await getAllUsers({ page: userPage, searchQuery: userSearch });
          const fetchedTransactions = await getAllTransactions({ page: transactionPage, searchQuery: transactionSearch });

          // FIX: Check if the fetched data exists before setting the state to avoid runtime errors.
          if (fetchedUsers) {
            setUsers(fetchedUsers.data);
          }
          if (fetchedTransactions) {
            setTransactions(fetchedTransactions.data);
          }
        } catch (err) {
          setError('Failed to fetch data');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else if (status === 'unauthenticated') {
      redirect('/sign-in');
    }
    // FIX: Add session to the dependency array to ensure the effect re-runs on login/logout.
  }, [session, status, userPage, transactionPage, userSearch, transactionSearch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <div className="mt-8">
        <h2 className="text-xl font-bold">User Management</h2>
        <div className="my-4">
          <Input
            type="text"
            placeholder="Search users..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <UserList users={users} />
        <div className="mt-4 flex justify-between">
          <Button onClick={() => setUserPage(userPage - 1)} disabled={userPage === 1}>Previous</Button>
          <Button onClick={() => setUserPage(userPage + 1)}>Next</Button>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold">Transaction Monitoring</h2>
        <div className="my-4">
          <Input
            type="text"
            placeholder="Search transactions..."
            value={transactionSearch}
            onChange={(e) => setTransactionSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <TransactionList transactions={transactions} />
        <div className="mt-4 flex justify-between">
          <Button onClick={() => setTransactionPage(transactionPage - 1)} disabled={transactionPage === 1}>Previous</Button>
          <Button onClick={() => setTransactionPage(transactionPage + 1)}>Next</Button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
