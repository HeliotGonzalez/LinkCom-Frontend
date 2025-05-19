export class TextSerializer {
    static serialize(text: string) {
        return btoa(String.fromCharCode(...new TextEncoder().encode(text)));
    }
}