
//validasi data yang diakses harus angka
const validateId = (id) => {
    if(!id || isNaN(id)) return 'ID harus berupa angka';
    return null;
};

const ROLES = ['admin', 'staff', 'sales'];

const validateStore = ({ name, email, password, role } = {}) => {
    const errors = [];
    if (!name || !name.trim()) errors.push('name wajib diisi');
    if (!email || !email.trim()) errors.push('email wajib diisi');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('format email tidak valid');
    if (!password || password.length < 6) errors.push('password minimal 6 karakter');
    if (!ROLES.includes(role)) errors.push(`role harus: ${ROLES.join(', ')}`);
    return errors.length ? errors : null;
};

const validateUpdate = ({ name, email, password, role } = {}) => {
    const errors = validateStore({ name, email, password: password || '******', role }) || [];
    if (password && password.length < 6) errors.push('password minimal 6 karakter');
    return errors.length ? [...new Set(errors)] : null;
};

module.exports = { validateId, validateStore, validateUpdate, ROLES };
