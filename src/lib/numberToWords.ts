
export const numberToFrenchWords = (n: number): string => {
    const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
    const tens = ['', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];
    const specials = {
        11: 'onze', 12: 'douze', 13: 'treize', 14: 'quatorze', 15: 'quinze', 16: 'seize',
        71: 'soixante-onze', 72: 'soixante-douze', 73: 'soixante-treize', 74: 'soixante-quatorze', 75: 'soixante-quinze', 76: 'soixante-seize',
        91: 'quatre-vingt-onze', 92: 'quatre-vingt-douze', 93: 'quatre-vingt-treize', 94: 'quatre-vingt-quatorze', 95: 'quatre-vingt-quinze', 96: 'quatre-vingt-seize'
    };

    if (n === 0) return 'zéro';
    if (n < 0) return 'moins ' + numberToFrenchWords(Math.abs(n));

    let words = '';

    if (n >= 1000000) {
        const millions = Math.floor(n / 1000000);
        words += (millions === 1 ? 'un million' : numberToFrenchWords(millions) + ' millions') + ' ';
        n %= 1000000;
    }

    if (n >= 1000) {
        const thousands = Math.floor(n / 1000);
        words += (thousands === 1 ? 'mille' : numberToFrenchWords(thousands) + ' mille') + ' ';
        n %= 1000;
    }

    if (n >= 100) {
        const hundreds = Math.floor(n / 100);
        words += (hundreds === 1 ? 'cent' : numberToFrenchWords(hundreds) + ' cents') + ' ';
        n %= 100;
        // Fix for "cent" singular/plural
        if (words.endsWith('cents ') && n === 0) words = words.trim() + 's ';
        else if (words.endsWith('cents ')) words = words.slice(0, -2) + ' ';
    }

    if (n > 0) {
        if (specials[n as keyof typeof specials]) {
            words += specials[n as keyof typeof specials];
        } else if (n < 10) {
            words += units[n];
        } else {
            const t = Math.floor(n / 10);
            const u = n % 10;
            if (t === 7 || t === 9) {
                words += tens[t - 1] + '-' + specials[(10 + u) as keyof typeof specials];
            } else {
                words += tens[t] + (u === 1 ? '-et-un' : (u > 0 ? '-' + units[u] : ''));
            }
        }
    }

    return words.trim();
};

export const formatAmountToWords = (amount: number, currency: string = 'USD'): string => {
    const integerPart = Math.floor(amount);
    const decimalPart = Math.round((amount - integerPart) * 100);

    let result = numberToFrenchWords(integerPart);

    if (currency === 'USD') {
        result += integerPart > 1 ? ' dollars' : ' dollar';
    } else if (currency === 'CDF') {
        result += integerPart > 1 ? ' francs congolais' : ' franc congolais';
    } else {
        result += ' ' + currency;
    }

    if (decimalPart > 0) {
        result += ' et ' + numberToFrenchWords(decimalPart);
        result += decimalPart > 1 ? ' cents' : ' cent';
    } else {
        result += ' pile';
    }

    return result.charAt(0).toUpperCase() + result.slice(1);
};
