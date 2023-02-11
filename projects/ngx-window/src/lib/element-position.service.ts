import { Injectable } from '@angular/core';

export interface Position {
    top: number,
    left: number,
    width: number,
    height: number
}

@Injectable()
export class ElementPositionService {

    first = true;

    getPosition(element: HTMLElement): Position {
        let rect = element.getBoundingClientRect();
        let offsetX = window.scrollX ?? document.documentElement.scrollLeft;
        let offsetY = window.scrollY ?? document.documentElement.scrollTop;

        return {
            top: rect.y + offsetY,
            left: rect.x + offsetX,
            width: rect.width,
            height: rect.height
        };
    }
}