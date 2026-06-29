// data/customers.ts
// Data statis pengganti database untuk latihan

import { Customer, CustomerStatus } from '../model/Customer';

const customers: Customer[] = [
    {
        id: 1,
        name: 'PT Maju Jaya',
        email: 'info@maju.com',
        company: 'Maju Jaya',
        status: CustomerStatus.Active
    },
    {
        id: 2,
        name: 'CV Kreatif',
        email: 'hi@kreatif.com',
        company: 'Kreatif',
        status: CustomerStatus.Inactive
    },
    {
        id: 3,
        name: 'PT Sejahtera',
        email: 'cs@sejahtera.com',
        company: 'Sejahtera',
        status: CustomerStatus.Active
    },
    {
        id: 4,
        name: 'UD Berkah',
        email: 'ud@berkah.com',
        company: 'Berkah',
        status: CustomerStatus.Active
    }
];

export default customers;