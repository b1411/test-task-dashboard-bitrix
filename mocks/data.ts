export interface Order {
  id: number;
  title: string;
  description: string;
  status: string;
  date: string;
}

export interface Payment {
  id: number;
  name: string;
  status: string;
  amount: number;
  date: string;
  action: string;
  employee?: string;
  progress?: number;
  accountNumber?: string;
}

export const mockOrders: Order[] = [
  {
    id: 1,
    title: 'Заказ 1',
    description: 'Описание заказа 1',
    status: 'В обработке',
    date: '2023-10-01',
  },
  {
    id: 2,
    title: 'Заказ 2',
    description: 'Описание заказа 2',
    status: 'Выполнен',
    date: '2023-09-28',
  },
  {
    id: 3,
    title: 'Заказ 3',
    description: 'Описание заказа 3',
    status: 'Отменен',
    date: '2023-09-25',
  },
  {
    id: 4,
    title: 'Заказ 4',
    description: 'Описание заказа 4',
    status: 'В обработке',
    date: '2023-10-02',
  },
  {
    id: 5,
    title: 'Заказ 5',
    description: 'Описание заказа 5',
    status: 'Выполнен',
    date: '2023-09-30',
  },
  {
    id: 6,
    title: 'Заказ 6',
    description: 'Описание заказа 6',
    status: 'В обработке',
    date: '2023-10-03',
  },
  {
    id: 7,
    title: 'Заказ 7',
    description: 'Описание заказа 7',
    status: 'Выполнен',
    date: '2023-09-27',
  },
  {
    id: 8,
    title: 'Заказ 8',
    description: 'Описание заказа 8',
    status: 'Отменен',
    date: '2023-09-24',
  },
];

export const mockPayments: Payment[] = [
  {
    id: 1,
    name: 'Платеж 1',
    status: 'Оплачен',
    amount: 1000,
    date: '2023-10-01',
    action: 'Просмотр',
    employee: 'Иванов И.И.',
    progress: 100,
    accountNumber: 'KZ1234567890',
  },
  {
    id: 2,
    name: 'Платеж 2',
    status: 'Не оплачен',
    amount: 500,
    date: '2023-09-28',
    action: 'Отменить',
    employee: 'Петров П.П.',
    progress: 50,
    accountNumber: 'KZ0987654321',
  },
  {
    id: 3,
    name: 'Платеж 3',
    status: 'Оплачен',
    amount: 2000,
    date: '2023-09-25',
    action: 'Просмотр',
    employee: 'Сидоров С.С.',
    progress: 100,
    accountNumber: 'KZ1122334455',
  },
  {
    id: 4,
    name: 'Платеж 4',
    status: 'Не оплачен',
    amount: 750,
    date: '2023-10-02',
    action: 'Подтвердить',
    employee: 'Кузнецов К.К.',
    progress: 75,
    accountNumber: 'KZ5566778899',
  },
];