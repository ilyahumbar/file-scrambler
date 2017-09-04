import { ILineScrambler, IStringReverser } from "./interfaces";

/**
 * Implementation of ILineScrambler that scrambles lines by reversing all strings in double quotes.
 */
export class MirrorQuoteStringLineScrambler implements ILineScrambler {
    constructor(private stringReverser: IStringReverser) {

    }


    public scrambleMulti(lines: Array<string>): Array<string> {
        return lines.map((l) => this.scrambleSingle(l))
    }

    public scrambleSingle(line: string): string {
        let currentIndex = 0;
        let re = /".*?"/g;
        let match: RegExpExecArray;
        let result = "";

        while (match = re.exec(line)) {
            result += line.substr(currentIndex, match.index - currentIndex);
            result += this.stringReverser.reverse(match[0]);
            currentIndex = match.index + match[0].length;
        }

        result += line.substr(currentIndex);

        return result;
    }
}