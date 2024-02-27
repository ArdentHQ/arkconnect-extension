import { it, describe, expect } from 'vitest';
import { errorParser, errorTitleParser } from './errorParser';

describe('errorParser', () => {
    it.each([
        ['ark.devnet', 'Testnet'],
        ['ark.mainnet', 'Mainnet'],
    ])(
        'extracts the super wallet and the network and creates a formatted value',
        (network, networkName) => {
            const text = `The super wallet [DERMYKx3RhgjMfyGvwadUE8ZVXt7HucuIj] with duper network [${network}] already exists.`;

            const expected = `The super wallet <strong>DERMYKx3RhgjMfyGvwadUE8ZVXt7HucuIj</strong> with duper network <strong>${networkName}</strong> already exists.`;

            expect(errorParser(text)).toEqual(expected);
        },
    );

    it('works without network mapping', () => {
        const text = 'The super wallet [DERMYKx3RhgjMfyGvwadUE8ZVXt7HucuIj] already exists.';

        const expected =
            'The super wallet <strong>DERMYKx3RhgjMfyGvwadUE8ZVXt7HucuIj</strong> already exists.';

        expect(errorParser(text)).toEqual(expected);
    });

    it('works without dynamic values', () => {
        const text = 'The super wallet already exists.';

        const expected = 'The super wallet already exists.';

        expect(errorParser(text)).toEqual(expected);
    });

    it('escapes HTML tags to prevent XSS', () => {
        const textWithXssAttempt =
            'The super wallet [DERMYKx3RhgjMfyGvwadUE8ZVXt7HucuIj] with duper network [<script>alert("XSS")</script>] already exists.';
        const expected =
            'The super wallet <strong>DERMYKx3RhgjMfyGvwadUE8ZVXt7HucuIj</strong> with duper network <strong></strong> already exists.';
        expect(errorParser(textWithXssAttempt)).toEqual(expected);
    });

    it('does not allow any other HTML tags', () => {
        const textWithHtmlTags = 'The super wallet [<em>DERMYKx3RhgjMfy</em>] already exists.';
        const expected = 'The super wallet <strong>DERMYKx3RhgjMfy</strong> already exists.';
        expect(errorParser(textWithHtmlTags)).toEqual(expected);
    });

    it('replaces wallet already exists message with a hardcoded one', () => {
        const text =
            'The wallet [DERMYKx3RhgjMfyGvwadUE8ZVXt7HucuIj] with network [ark.devnet] already exists.';

        const expected =
            'You have already imported the wallet <strong>DERMYKx3RhgjMfyGvwadUE8ZVXt7HucuIj</strong> on <strong>Testnet</strong>.';

        expect(errorParser(text)).toEqual(expected);
    });
});

describe('errorTitleParser', () => {
    it('returns custom title for known pattern', () => {
        const errorMessage = 'The wallet [ABC123] with network [ark.devnet] already exists.';
        expect(errorTitleParser(errorMessage)).toBe('Wallet Already Exists');
    });

    it('returns default title for unknown pattern', () => {
        const errorMessage = 'An unknown error occurred.';
        expect(errorTitleParser(errorMessage)).toBe('Something went wrong...');
    });

    it('returns default title for null', () => {
        expect(errorTitleParser(null)).toBe('Something went wrong...');
    });
});
