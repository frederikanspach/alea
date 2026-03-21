'use strict';

export const ALEA_DATA = {
    pw: {
        charset: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}|;:,.<>?",
        preview: "Zeichen: a-z, A-Z, 0-9, !@#$%^&*()-_=+..."
    },
    file: {
        charset: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._-",
        preview: "Zeichen: a-z, A-Z, 0-9, . _ -"
    },
    lotto: { preview: "Zahlen: 1 bis 49 (kryptografisch einzigartig)" }
};

function isValid(str) {
    return /[a-z]/.test(str) &&
        /[A-Z]/.test(str) &&
        /[0-9]/.test(str) &&
        /[!@#$%^&*()-_=+\[\]{}|;:,.<>?]/.test(str);
}

function generateSecureString(length, charset) {
    let result = "";
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
        result += charset[array[i] % charset.length];
    }
    return result;
}

export function generatePassword(length = 16) {
    let pw = "";
    let attempts = 0;

    do {
        pw = generateSecureString(length, ALEA_DATA.pw.charset);
        attempts++;
    } while (!isValid(pw) && attempts < 50);

    return pw;
}

export function getStrength(pw) {
    if (pw.length < 10) return "red";
    if (pw.length >= 12 && isValid(pw)) return "green";
    return "yellow";
}

export function generateFileName(length = 12) {
    let name = generateSecureString(length, ALEA_DATA.file.charset);

    if (/^[.\-_]/.test(name)) name = 'a' + name.slice(1);
    if (name.endsWith('.')) name = name.slice(0, -1) + 'z';

    return name;
}

export function generateLotto() {
    const numbers = new Set();
    const array = new Uint32Array(1);
    while (numbers.size < 6) {
        window.crypto.getRandomValues(array);
        const num = (array[0] % 49) + 1;
        numbers.add(num);
    }
    return Array.from(numbers).sort((a, b) => a - b).join(', ');
}
