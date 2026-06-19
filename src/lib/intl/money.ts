import { dinero, toDecimal } from 'dinero.js';

export class Money {
    readonly #amount: number;
    readonly #ticker: string;
    readonly #locale?: string;

    private constructor(amount: number, ticker: string, locale?: string) {
        this.#amount = amount;
        this.#ticker = ticker;
        this.#locale = locale;
    }

    public static make(amount: number, ticker: string): Money {
        return new Money(amount, ticker);
    }

    public setLocale(locale: string): Money {
        return new Money(this.#amount, this.#ticker, locale);
    }

    public format(): string {
        const code = this.#ticker.toUpperCase();
        const currency = { code, base: 10, exponent: 2 } as const;
        const decimal = Number(toDecimal(dinero({ amount: this.#amount, currency })));

        return new Intl.NumberFormat(this.#locale ?? 'en-US', {
            style: 'currency',
            currency: code,
        }).format(decimal);
    }
}
