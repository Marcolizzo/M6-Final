export const convertPrice = (price) => {
    return new Intl
        .NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })
        .format(Number(price));
}
