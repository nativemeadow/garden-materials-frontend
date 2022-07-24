
const CalculateQuantityCost = () => {

    const dollarUSLocale = Intl.NumberFormat('en-US');

    function calculateCost(
        quantity: number,
        price: number,
        fixedDec: boolean
    ): number;
    function calculateCost(quantity: number, price: number): string;
    function calculateCost(
        quantity: number,
        price: number,
        fixedDec: boolean = false
    ): string | number {
        const total: number = quantity * price;
        return fixedDec ? total.toFixed(2) : total;
    }

    return {dollarUSLocale, calculateCost}
}

export default CalculateQuantityCost
