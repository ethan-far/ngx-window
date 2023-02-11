import { TestBed } from '@angular/core/testing';
import { ElementPositionService } from './element-position.service';

describe('ElementPositionService', () => {

    let elementPositionService: ElementPositionService;

    let elementMock: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ElementPositionService
            ]
        });

        elementPositionService = TestBed.inject(ElementPositionService);

        elementMock = document.createElement('div');
    });

    describe('getPosition', () => {

        let rectMock: DOMRect;

        beforeEach(() => {
            rectMock = { x: 34, y: 12, top: 12, left: 34, right: 90, bottom: 90, width: 56, height: 78, toJSON: () => { } }
        });

        it('returns the bounding client rectangle of the element', () => {
            jest.spyOn(elementMock, 'getBoundingClientRect').mockReturnValue(rectMock);

            let position = elementPositionService.getPosition(elementMock);

            expect(position).toEqual({ top: 12, left: 34, width: 56, height: 78 });
        });

        it('takes into account the scrolling of the window', () => {
            jest.spyOn(elementMock, 'getBoundingClientRect').mockReturnValue(rectMock);
            Object.defineProperty(window, 'scrollX', { value: 123 });
            Object.defineProperty(window, 'scrollY', { value: 456 });

            let position = elementPositionService.getPosition(elementMock);

            expect(position).toEqual({ top: 468, left: 157, width: 56, height: 78 });
        });

        it('falls back to document element scroll if window if window scroll is missing', () => {
            jest.spyOn(elementMock, 'getBoundingClientRect').mockReturnValue(rectMock);
            Object.defineProperty(window, 'scrollX', { value: undefined });
            Object.defineProperty(window, 'scrollY', { value: undefined });
            Object.defineProperty(document.documentElement, 'scrollLeft', { value: 987 });
            Object.defineProperty(document.documentElement, 'scrollTop', { value: 654 });

            let position = elementPositionService.getPosition(elementMock);

            expect(position).toEqual({ top: 666, left: 1021, width: 56, height: 78 });
        });
    });
});