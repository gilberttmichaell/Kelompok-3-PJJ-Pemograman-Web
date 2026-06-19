//validasi data yang diakses harus angka

const validateId = (id) => {
    if(!id || isNaN(id)) return 'ID harus berupa angka';
    return null;
};

module.exports = {validateId};