export type HorizontalAnchor = 'left' | 'center' | 'right';
export type VerticalAnchor = 'top' | 'center' | 'bottom';

export interface HorizontalAlignmentOptions {
    from?: HorizontalAnchor;
    to?: HorizontalAnchor;
}

export interface VerticalAlignmentOptions {
    from?: VerticalAnchor;
    to?: VerticalAnchor;
}

export interface AlignmentOptions {
    horizontal?: HorizontalAlignmentOptions;
    vertical?: VerticalAlignmentOptions;
}