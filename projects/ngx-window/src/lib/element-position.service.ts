import { Injectable } from '@angular/core';
import { Position } from './window.types';

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