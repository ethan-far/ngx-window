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
        it('returns the bounding client rectangle of the element', () => {
            const rectMock: DOMRect = { x: 34, y: 12, top: 12, left: 34, right: 90, bottom: 90, width: 56, height: 78, toJSON: () => { } }
            jest.spyOn(elementMock, 'getBoundingClientRect').mockReturnValue(rectMock);

            let position = elementPositionService.getPosition(elementMock);

            expect(position).toEqual({ top: 12, left: 34, width: 56, height: 78 });
        });
    });
});