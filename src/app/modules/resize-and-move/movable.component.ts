import { Component, ElementRef, ViewChild } from '@angular/core';
import { WindowOptions } from '../../../../projects/ngx-window/src/public-api';

@Component({
    selector: 'ngx-test-movable',
    templateUrl: './movable.component.html',
    styleUrls: ['./movable.component.scss']
})
export class MovableComponent {

    @ViewChild('movable') element!: ElementRef<HTMLElement>;

    private _coordinates?: [number, number];
    private _offset?: [number, number];

    topWindowOptions: WindowOptions = {
        visibility: {
            startOpen: true,
            keepOpen: {
                onClickOutside: true,
                onIntersection: true
            }
        },
        alignment: {
            window: { vertical: 'bottom', horizontal: 'center' },
            reference: { horizontal: 'center' }
        }
    };

    leftWindowOptions: WindowOptions = {
        visibility: {
            startOpen: true,
            keepOpen: {
                onClickOutside: true,
                onIntersection: true
            }
        },
        alignment: {
            window: { horizontal: 'right', vertical: 'center' },
            reference: { vertical: 'center' }
        }
    };

    rightWindowOptions: WindowOptions = {
        visibility: {
            startOpen: true,
            keepOpen: {
                onClickOutside: true,
                onIntersection: true
            }
        },
        alignment: {
            reference: { horizontal: 'right', vertical: 'center' },
            window: { vertical: 'center' }
        }
    };

    bottomWindowOptions: WindowOptions = {
        visibility: {
            startOpen: true,
            keepOpen: {
                onClickOutside: true,
                onIntersection: true
            }
        },
        alignment: {
            reference: { vertical: 'bottom', horizontal: 'center' },
            window: { horizontal: 'center' }
        }
    };

    constructor(private elementRef: ElementRef<HTMLElement>) { }

    onDragStart(event: DragEvent) {
        this._coordinates = [event.x, event.y];
        this._offset = [this.element.nativeElement.offsetLeft, this.element.nativeElement.offsetTop];
    }

    onDrag(event: DragEvent) {
        this.element.nativeElement.style.left = `${this._offset![0] + (event.x - this._coordinates![0])}px`;
        this.element.nativeElement.style.top = `${this._offset![1] + (event.y - this._coordinates![1])}px`;
    }
}