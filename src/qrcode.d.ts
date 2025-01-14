declare module 'qrcode.react' {
  import React from 'react';

  export interface QRCodeSVGProps {
    value: string;
    size?: number;
    bgColor?: string;
    fgColor?: string;
    level?: 'L' | 'M' | 'Q' | 'H';
    includeMargin?: boolean;
    className?: string;
  }

  export const QRCodeSVG: React.FC<QRCodeSVGProps>;
}
