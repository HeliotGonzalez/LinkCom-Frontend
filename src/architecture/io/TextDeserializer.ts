export class TextDeserializer {
    static deserialize(text: string) {
        return new TextDecoder().decode(Uint8Array.from(atob(text), c => c.charCodeAt(0)));
    }
}