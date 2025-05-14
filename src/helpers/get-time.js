export default function getBGTime() {
    const now = new Date();

    const date = now.toLocaleDateString('bg-BG', {
        timeZone: 'Europe/Sofia'
    });

    const time = now.toLocaleTimeString('bg-BG', {
        timeZone: 'Europe/Sofia'
    });

    return `[${date} ${time}]`;
}
