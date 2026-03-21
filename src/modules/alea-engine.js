export const ALEA_DATA = {
    pw: {
        charset: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}|;:,.<>?',
        preview: 'Zeichen: a-z, A-Z, 0-9, !@#$%^&*()-_=+...'
    },
    file: {
        charset: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._-',
        preview: 'Zeichen: a-z, A-Z, 0-9, . _ -'
    },
    lotto: {
        preview: 'Zahlen: 1 bis 49 (kryptografisch einzigartig)'
    }
};

function isValid(str) {
    return (
        /[a-z]/.test(str) &&
        /[A-Z]/.test(str) &&
        /[0-9]/.test(str) &&
        /[!@#$%^&*()\-_=+[\]{}|;:,.<>?]/.test(str)
    );
}

function generateSecureString(length, charset) {
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, (n) => charset[n % charset.length]).join('');
}

export function generatePassword(length = 16) {
    if (length < 4) return generateSecureString(length, ALEA_DATA.pw.charset);

    let pw = '';
    let attempts = 0;
    do {
        pw = generateSecureString(length, ALEA_DATA.pw.charset);
        attempts++;
    } while (!isValid(pw) && attempts < 50);

    return pw;
}

export function getStrength(pw) {
    if (pw.length < 10) return 'red';
    if (pw.length >= 12 && isValid(pw)) return 'green';
    return 'yellow';
}

export function generateFileName(length = 12) {
    let name = generateSecureString(length, ALEA_DATA.file.charset);
    if (/^[.\-_]/.test(name)) name = 'a' + name.slice(1);
    if (name.endsWith('.')) name = name.slice(0, -1) + 'z';
    return name;
}

export function generateLotto() {
    const numbers = new Set();

    while (numbers.size < 6) {
        const array = new Uint32Array(12);
        window.crypto.getRandomValues(array);
        for (const val of array) {
            if (numbers.size >= 6) break;
            numbers.add((val % 49) + 1);
        }
    }

    return Array.from(numbers).sort((a, b) => a - b).join(', ');
}