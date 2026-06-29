function validateRegister(data){
    if(!data.name || !data.name.trim()) return "nama wajib diisi";
    if(!data.email) return "email wajib diisi";
    if(!data.password) return "password wajib diisi";
    if(data.password.length < 6) return "password minimal 6 karakter";
    return null;
}

function validateLogin(data){
    if(!data.email) return "email wajib diisi";
    if(!data.password) return "password wajib diisi";
    return null;
}

module.exports = { validateRegister, validateLogin };
