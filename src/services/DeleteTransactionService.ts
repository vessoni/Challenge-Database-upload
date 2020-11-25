import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute({ id }: any): Promise<void> {
    const transaction = getRepository(Transaction);
    try {
      transaction.delete({ id });
    } catch (err) {
      throw new AppError(err);
    }
  }
}

export default DeleteTransactionService;
