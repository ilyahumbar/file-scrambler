/**
 * @interface
 */
export interface IFileScrambler {
    /**
     * Scrambles entire file. Saves result to the output directory specified in the parameter under original file name.
     * @see FileScrambler for implementation details
     * @param {string} filePath - Path to a file to be scrambled.
     * @param {string} outputDir - Output directory for resulting file. Will be created if it does not exist.
     * @returns {Promise.<string>} Promise, resolved with output file path if everything is ok.
     */
    scramble(filePath: string, outputDir: string): Promise<string>;
}