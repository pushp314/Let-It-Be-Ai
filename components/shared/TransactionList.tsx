
'use client'

import { ITransaction } from "@/lib/database/models/transaction.model";

const TransactionList = ({ transactions }: { transactions: ITransaction[] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer ID</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td className="px-6 py-4 whitespace-nowrap">{transaction._id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{transaction.amount}</td>
              <td className="px-6 py-4 whitespace-nowrap">{transaction.credits}</td>
              <td className="px-6 py-4 whitespace-nowrap">{transaction.plan}</td>
              <td className="px-6 py-4 whitespace-nowrap">{transaction.buyer.toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;
