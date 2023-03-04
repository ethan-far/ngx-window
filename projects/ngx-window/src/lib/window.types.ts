export type HorizontalAnchor = 'left' | 'center' | 'right';
export type VerticalAnchor = 'top' | 'center' | 'bottom';

export interface Alignment {
    horizontal?: HorizontalAnchor;
    vertical?: VerticalAnchor;
}

export interface Position {
    top: number,
    left: number,
    width: number,
    height: number
}

export interface Offset {
    top: number,
    left: number
}

export interface WindowAlignmentOptions {
    window?: Alignment;
    reference?: Alignment;
}

export interface WindowOptions {
    startOpen?: boolean;
    alignment?: WindowAlignmentOptions
};
