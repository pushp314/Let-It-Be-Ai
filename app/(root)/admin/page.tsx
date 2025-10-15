
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getAllUsers, getUserById } from '@/lib/actions/user.actions';
import UserList from '@/components/shared/UserList';
import { IUser } from '@/lib/database/models/user.model';
import { getAllTransactions } from '@/lib/actions/transaction.action';
import TransactionList from '@/components/shared/TransactionList';
import { ITransaction } from '@/lib/database/models/transaction.model';

const AdminPage = async () => {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/sign-in');
  }

  const user = await getUserById(session.user.id);

  if (user.role !== 'admin') {
    redirect('/');
  }

  const users = await getAllUsers();
  const transactions = await getAllTransactions();

  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <div className="mt-8">
        <h2 className="text-xl font-bold">User Management</h2>
        <UserList users={users as IUser[]} />
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold">Transaction Monitoring</h2>
        <TransactionList transactions={transactions as ITransaction[]} />
      </div>
    </div>
  );
};

export default AdminPage;
