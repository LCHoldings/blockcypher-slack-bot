export const dateToLink = (date: string): string => {

    if (date === "" || date === undefined) {
        return "";
    }

    const dateArray = date.split("T");
    const dateArray2 = dateArray[0].split("-");
    const dateArray3 = dateArray[1].split(":");
    const year = dateArray2[0];
    const month = dateArray2[1];
    const day = dateArray2[2];
    const hour = dateArray3[0];
    const minute = dateArray3[1];
    const second = dateArray3[2].split(".")[0];
    return `https://time.cs50.io/${year}${month}${day}T${hour}${minute}${second}-0000`;
}