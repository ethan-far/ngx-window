import { Injectable } from '@angular/core';

export interface Position {
    top: number,
    left: number,
    width: number,
    height: number
}

@Injectable()
export class ElementPositionService {
    getPosition(element: HTMLElement): Position {
        let rect = element.getBoundingClientRect();

        return {
            top: rect.y,
            left: rect.x,
            width: rect.width,
            height: rect.height
        };
    }
}