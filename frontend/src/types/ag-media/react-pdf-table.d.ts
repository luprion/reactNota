// ag-media-react-pdf-table.d.ts
declare module '@ag-media/react-pdf-table' {
  import * as React from 'react';

  export interface TableProps {
    children?: React.ReactNode;
    tdStyle?: React.CSSProperties;
    weightings?: number[];
    width?: string;
    style?: React.CSSProperties;
  }

  export interface TRProps {
    children?: React.ReactNode;
    style?: React.CSSProperties;
  }

  export interface THProps {
    children?: React.ReactNode;
    style?: React.CSSProperties;
  }

  export interface TDProps {
    children?: React.ReactNode;
    style?: React.CSSProperties;
  }

  export const Table: React.FC<TableProps>;
  export const TR: React.FC<TRProps>;
  export const TH: React.FC<THProps>;
  export const TD: React.FC<TDProps>;
}
