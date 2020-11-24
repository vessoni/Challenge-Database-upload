import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: Type;
  category: string;
}

export enum Type {
  income = 'income',
  outcome = 'outcome',
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    // Create Category -> Return ID.
    const categoriesRepository = getRepository(Category);
    const transactionRepository = getCustomRepository(TransactionsRepository);

    const checkCategoryExists = await categoriesRepository.findOne({
      title: category,
    });

    const getBalance = await transactionRepository.getBalance();

    if (type === 'outcome') {
      const newBalance = getBalance.total - value;
      if (newBalance < 0) {
        throw new AppError('Sorry, your balance will be negative');
      }
    }

    if (checkCategoryExists) {
      const newTransaction = transactionRepository.create({
        title,
        value,
        type,
        category_id: checkCategoryExists.id,
      });

      await transactionRepository.save(newTransaction);

      return newTransaction;
    }
    const newCategory = categoriesRepository.create({
      title: category,
    });

    await categoriesRepository.save(newCategory);

    const newTransaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: newCategory.id,
    });

    await transactionRepository.save(newTransaction);

    return newTransaction;
  }
}

export default CreateTransactionService;
