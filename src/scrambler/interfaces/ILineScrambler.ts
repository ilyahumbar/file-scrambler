/**
 * Interface that provides methods for processing strings.
 *
 * @interface
 */
export interface ILineScrambler {
    /**
     * Scrambles multiple strings.
     * @see MirrorQuoteStringLineScrambler
     * @param {string[]} lines - Lines to process (should not include line breaks).
     * @returns {string[]} Processed strings
     */
    scrambleMulti(lines: Array<string>): Array<string>;

    /**
     * Scrambles single line.
     * @see MirrorQuoteStringLineScrambler
     * @param {string} line - Line to process (should not include line break).
     * @returns {string} Processed string
     */
    scrambleSingle(line: string): string;
}