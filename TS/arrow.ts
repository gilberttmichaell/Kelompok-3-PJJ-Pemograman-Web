interface Customer {
    id: number;
    name: string;
    isActive: boolean;
}

//1. filtering: mengambil customer yang aktif saja

const filterActive = (
    arr: Customer[],
    fn: (c: Customer) => boolean
): Customer[] => {
    return arr.filter(fn);
};

//2. arrow function mengambil data yang string saja atau dalam hal ini nama
const getNames = (
    arr: Customer[],
    fn: (c: Customer) => string
): string[] => {
    return arr.map(fn);
};

const data: Customer[] = [
    { id: 1, name: 'Budi', isActive: true },
    { id: 2, name: 'Susi', isActive: false }
];

const activeCustomers = filterActive(data, (c) => c.isActive);

const customerNames = getNames(data, (c) => c.name);