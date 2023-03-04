import { Injectable } from '@angular/core';
import { Alignment, HorizontalAnchor, Offset, Position, VerticalAnchor } from './window.types';

@Injectable()
export class AlignmentService {
    align(windowPosition: Position, windowAlignment?: Alignment, referencePosition?: Position, referenceAlignment?: Alignment): Offset {
        referencePosition ??= { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };

        let referenceTop = referencePosition.top;
        let referenceLeft = referencePosition.left;

        let topReferenceCorrection = this.verticalCorrection(referencePosition, referenceAlignment?.vertical);
        let leftReferenceCorrection = this.horizontalCorrection(referencePosition, referenceAlignment?.horizontal);

        let topWindowCorrection = this.verticalCorrection(windowPosition, windowAlignment?.vertical);
        let leftWindowCorrection = this.horizontalCorrection(windowPosition, windowAlignment?.horizontal);

        return {
            top: referenceTop + topReferenceCorrection + windowPosition.top - topWindowCorrection,
            left: referenceLeft + leftReferenceCorrection + windowPosition.left - leftWindowCorrection
        };
    }

    private horizontalCorrection(position: Position, anchor?: HorizontalAnchor): number {
        switch (anchor) {
            case 'center':
                return position.width / 2;
            case 'right':
                return position.width;
            default:
                return 0;
        }
    }

    private verticalCorrection(position: Position, anchor?: VerticalAnchor): number {
        switch (anchor) {
            case 'center':
                return position.height / 2;
            case 'bottom':
                return position.height;
            default:
                return 0;
        }
    }
}