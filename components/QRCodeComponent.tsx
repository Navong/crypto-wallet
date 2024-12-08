'use client';

import { QRCodeCanvas } from 'qrcode.react';

interface QRCodeComponentProps {
    value: string;
    size?: number;
}

export default function QRCodeComponent({ value, size = 192 }: QRCodeComponentProps) {
    return (
        <QRCodeCanvas
            value={value}
            size={size}
            bgColor="#FFFFFF"
            fgColor="#000000"
            level="Q"
            marginSize={1}
            className="rounded-lg"
        />
    );
}
