import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const balance: Balance = {
      income: 0,
      outcome: 0,
      total: 0,
    };

    transactions.forEach(element => {
      if (element.type === 'income') {
        balance.income += element.value;
        balance.total += element.value;
      }
      if (element.type === 'outcome') {
        balance.outcome += element.value;
        balance.total -= element.value;
      }
    });

    return balance;
  }
}

export default TransactionsRepository;
