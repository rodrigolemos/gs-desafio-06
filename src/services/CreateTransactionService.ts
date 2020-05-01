import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';

import CreateCategoryService from './CreateCategoryService';

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

    const balance = await transactionRepository.getBalance();

    if (type === 'outcome' && balance.total - value <= 0) {
      throw new AppError(
        'Outcome transaction is not possible due to total balance.',
      );
    }

    const categoryService = new CreateCategoryService();

    const categoryRegistered = await categoryService.execute({
      title: category,
    });

    const category_id = categoryRegistered.id;

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
