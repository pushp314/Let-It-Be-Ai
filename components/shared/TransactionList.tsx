
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ITransaction } from "@/lib/database/models/transaction.model";

const TransactionList = ({ transactions }: { transactions: ITransaction[] }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Transactions</h2>
      <Table>
        <TableCaption>A list of all transactions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Plan</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Buyer</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction._id}>
              <TableCell>{transaction.plan}</TableCell>
              <TableCell>{transaction.amount}</TableCell>
              <TableCell>{transaction.buyer.username}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionList;
