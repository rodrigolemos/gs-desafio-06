import { getRepository, getCustomRepository } from 'typeorm';
// import AppError from '../errors/AppError';

import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getRepository(Category);

    const categoryExists = await categoryRepository.findOne({
      where: { title: category },
    });

    if (categoryExists) {
      const category_id = categoryExists.id;
    } else {
      const newCategory = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(newCategory);
      const category_id = newCategory.id;
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
