export function copyText(value: string) {
    const copied = document.createElement("input");
    copied.setAttribute("value", value);
    document.body.appendChild(copied);
    copied.select();
    document.execCommand("copy");
    document.body.removeChild(copied);
    // message.success('Copied')
}
