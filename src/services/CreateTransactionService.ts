// import AppError from '../errors/AppError';
import { getRepository } from 'typeorm';
import Category from '../models/Category';
import Transaction from '../models/Transaction';

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
    const transactionRepository = getRepository(Transaction);

    const checkCategoryExists = await categoriesRepository.findOne({
      title: category,
    });

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
