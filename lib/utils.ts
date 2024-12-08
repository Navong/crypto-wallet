import { type ClassValue, clsx } from "clsx";
// import { twMerge } from "tailwind-merge";
import { formatEther, formatUnits, parseEther } from "viem";
import * as dn from "dnum";
import { Column } from "@tanstack/react-table";
import { CSSProperties } from "react";

export const isDev = process.env.NODE_ENV === "development";

// export function cn(...inputs: ClassValue[]) {
//     return twMerge(clsx(inputs));
// }

export function formatUsdComma(value: number, decimals: number = 2): string {
    return value.toLocaleString("en-US", {
        maximumFractionDigits: decimals,
        minimumFractionDigits: 2,
    });
}

export function formatBigIntToLocale(value?: bigint, decimals = 2, unit = 18, minFractionDigits = 2): string {
    return (+formatUnits(value || BigInt(0), unit)).toLocaleString("en-US", {
        maximumFractionDigits: decimals,
        minimumFractionDigits: minFractionDigits,
    });
}

export function formatToSignificantFigures(value: bigint, sigFigs = 8): string {
    const number = +formatUnits(value, 18);
    if (number === 0) {
        return '0'.padEnd(sigFigs, '0');
    }

    const sign = number < 0 ? '-' : '';
    const absNumber = Math.abs(number);
    const exponent = Math.floor(Math.log10(absNumber));
    const coefficient = absNumber / Math.pow(10, exponent);

    const roundedCoefficient = Number(coefficient.toFixed(sigFigs - 1));
    const finalNumber = roundedCoefficient * Math.pow(10, exponent);

    if (Math.abs(exponent) < sigFigs) {
        return sign + finalNumber.toPrecision(sigFigs);
    } else {
        return sign + finalNumber.toExponential(sigFigs - 1);
    }
}

export function formatToSignificantFiguresWithCommas(value: bigint, sigFigs = 8): string {
    const result = formatToSignificantFigures(value, sigFigs);
    let [integer, decimal = ''] = result.split('.');

    // Adjust decimal part based on length
    if (decimal.length > 4) {
        decimal = parseFloat(`0.${decimal}`).toFixed(4).split('.')[1]; // Round to 4 decimal places
    } else {
        decimal = decimal.padEnd(2, '0').slice(0, 2); // Ensure exactly 2 decimal places
    }

    return integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (decimal ? `.${decimal}` : '');
}


export function formatBigInt(value?: bigint, decimals = 8, unit = 18): string {
    const formatted = dn.from(+formatUnits(value || BigInt(0), unit));
    // const rounded = Math.round((formatted + Number.EPSILON) * 10 ** decimals) / 10 ** decimals;
    return dn.format(formatted, { digits: decimals });
}

export function bigIntToNumber(value?: bigint, unit = 18): number {
    return +formatUnits(value || BigInt(0), unit);
}

export function toEther(value: number): bigint {
    return parseEther(`${value}`);
}

export function rateToApy(rate: bigint): string {
    const ratePerBlock = Number(rate);
    const ethMantissa = 1e18;
    const blocksPerDay = 20 * 60 * 24; // 3 seconds per block on BSC
    const daysPerYear = 365;
    const apy = (Math.pow((ratePerBlock / ethMantissa) * blocksPerDay + 1, daysPerYear) - 1) * 100;
    return apy.toFixed(2);
}

export function totalRateToApy(rate: bigint, value: bigint): string {
    const totalRatePerBlock = Number(rate);
    const totalValue = Number(value);

    if (totalValue <= 0) {
        return "0.00";
    }

    const blocksPerDay = 20 * 60 * 24; // 3 seconds per block on BSC
    const daysPerYear = 365;
    const apy = (Math.pow((totalRatePerBlock / totalValue) * blocksPerDay + 1, daysPerYear) - 1) * 100;
    return apy.toFixed(8);
}

export const weightedAvgBigInt = (a: bigint, b: bigint, weight: number) => {
    return (a * BigInt(weight) + b * BigInt(100 - weight)) / BigInt(100);
};

export const weightedAvg = (a: number, b: number, weight: number) => {
    return (a * (100 - weight) + b * weight) / 100;
};

export function calculateToSubstractFromPoolAndP2P({ poolAmount, subAmount }: { poolAmount: bigint; subAmount: bigint }) {
    let toSubstractInP2P = BigInt(0);
    let toSubstractOnPool = BigInt(0);

    if (poolAmount > subAmount) {
        toSubstractOnPool = subAmount;
    } else {
        toSubstractOnPool = poolAmount;
        toSubstractInP2P = subAmount - poolAmount;
    }
    return { toSubstractOnPool, toSubstractInP2P };
}

export const bigIntMax = (...args: bigint[]) => args.reduce((m, e) => (e > m ? e : m));
export const bigIntMin = (...args: bigint[]) => args.reduce((m, e) => (e < m ? e : m));
export const bigIntFloorZero = (value: bigint) => bigIntMax(value, BigInt(0));


export function displayBigIntWithToken(amount?: bigint, token?: string) {
    return formatBigInt(amount || BigInt(0)) + " " + (token || "").toUpperCase();
}

export function displayBigIntWithUsd(amount?: bigint) {
    return "$" + formatBigIntToLocale(amount || BigInt(0));
}

export function displayApyWithPercentage(rate?: bigint) {
    return rate ? rateToApy(rate) + "%" : "0%";
}

export const getMaxAmountForInput = (amount?: bigint) => {
    const formatted = +formatEther(amount || BigInt(0));
    return (Math.round(formatted * 10 ** 8) / 10 ** 8).toFixed(8);
}

export function timestampToDate(timestamp: number) {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// export const getCommonPinningStyles = <TData,>(column: Column<TData, unknown>) => {
//     const isPinned = column.getIsPinned();
//     const isLastLeftPinnedColumn = isPinned === "left" && column.getIsLastColumn("left");

//     return cn(
//         "left-0",
//         `w-[${column.getSize()}px]`,
//         isPinned && "opacity-95",
//         isPinned ? "sticky" : "relative",
//         // Add 50px left padding for left-pinned columns
//         isPinned === "left" && "pl-[50px]",
//         // Add left padding
//         // isPinned === "left" && "pl-6",
//         isPinned && "z-10",
//         // isPinned && "bg-background",
//         // Add hover styles with the new specified color
//         // isPinned && "hover:bg-[rgba(255,255,255,0.1)] hover:z-20 transition-colors duration-200"
//     );
// };
