const passwordValidation = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()\-_=+])[a-zA-Z0-9!@#$%^&*()\-_=+]+$/;
    return regex.test(password);
};

export default passwordValidation;
