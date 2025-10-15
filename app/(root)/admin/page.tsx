
import React from 'react';
import { getAllUsers } from '../../../lib/actions/user.actions';
import { getAllTransactions } from '../../../lib/actions/transaction.action';
import UserList from '../../../components/shared/UserList';
import TransactionList from '../../../components/shared/TransactionList';

const AdminPage = async () => {
  const users = await getAllUsers();
  const transactionData = await getAllTransactions({});
  const transactions = transactionData ? transactionData.data : [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
         {users && <UserList users={users} />}
        </div>
        <div>
          {transactions && <TransactionList transactions={transactions} />}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
