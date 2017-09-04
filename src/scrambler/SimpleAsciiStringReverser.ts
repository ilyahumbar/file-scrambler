import { IStringReverser } from "./interfaces";

/** Simple string reverser.
 * Does not takes into account unicode characters. If your string contains unicode characters you will have unexpected
 * results.
 *
 * @example
 * const reverser = new SimpleAsciiStringReverser();
 * console.log(reverser.reverse('test')); // tset
 */
export class SimpleAsciiStringReverser implements IStringReverser {
    public reverse(str: string): string {
        return str.split("").reverse().join("");
    }
}