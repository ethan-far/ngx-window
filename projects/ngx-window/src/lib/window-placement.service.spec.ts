import { TestBed } from '@angular/core/testing';
import { AlignmentService } from './alignment.service';
import { Position } from './window.types';
import { WindowPlacementService } from './window-placement.service';

describe('WindowPlacementService', () => {

    let service: WindowPlacementService;
    let referencePosition: Position;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AlignmentService,
                WindowPlacementService
            ]
        });

        service = TestBed.inject(WindowPlacementService);
        referencePosition = { top: 400, left: 500, width: 100, height: 40 };

        window.innerWidth = 1200;
        window.innerHeight = 900;
        Object.defineProperty(window, 'scrollX', { value: 0, configurable: true });
        Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
    });

    describe('getBestFit', () => {
        it('reports a primary placement that fits without adaptive configuration', () => {
            const result = service.getBestFit({ width: 300, height: 200, topOffset: 20, leftOffset: 20 });

            expect(result).toEqual({
                offset: { top: 20, left: 20 }, placementIndex: 0, source: 'primary',
                alignment: undefined, topOffset: 20, leftOffset: 20, fitsViewport: true
            });
        });

        it('reports a fitting fallback when the primary placement overflows', () => {
            const result = service.getBestFit({
                width: 300, height: 200, topOffset: 20, leftOffset: 20,
                referencePosition: { top: 700, left: 500, width: 100, height: 40 },
                alignment: { reference: { vertical: 'bottom' } },
                adaptivePlacements: [{ alignment: { reference: { vertical: 'top' }, window: { vertical: 'bottom' } } }]
            });

            expect(result.fitsViewport).toBe(true);
            expect(result.placementIndex).toBe(1);
            expect(result.offset).toEqual({ top: 480, left: 520 });
        });

        it('reports the least-overflowing placement when none fits', () => {
            const result = service.getBestFit({
                width: 500, height: 500, topOffset: 24, leftOffset: 24,
                referencePosition: { top: 700, left: 1120, width: 80, height: 80 },
                alignment: { reference: { horizontal: 'right', vertical: 'bottom' } },
                adaptivePlacements: [{ alignment: { reference: { horizontal: 'left', vertical: 'bottom' }, window: { horizontal: 'right' } } }]
            });

            expect(result.fitsViewport).toBe(false);
            expect(result.placementIndex).toBe(1);
            expect(result.offset).toEqual({ top: 804, left: 596 });
        });

        it.each([
            [12, 12, 1176, 876, true],
            [11, 12, 1176, 876, false],
            [12, 11, 1176, 876, false],
            [12, 12, 1177, 876, false],
            [12, 12, 1176, 877, false],
            [12, 12, 1200, 900, false]
        ])('evaluates all viewport edges including exact padding boundaries (%s, %s, %s, %s)', (leftOffset, topOffset, width, height, fitsViewport) => {
            const result = service.getBestFit({ width, height, topOffset, leftOffset, viewportPadding: 12 });

            expect(result.fitsViewport).toBe(fitsViewport);
        });

        it('uses document coordinates when the page is scrolled', () => {
            Object.defineProperty(window, 'scrollX', { value: 210, configurable: true });
            Object.defineProperty(window, 'scrollY', { value: 160, configurable: true });

            const result = service.getBestFit({
                width: 300, height: 200, topOffset: 12, leftOffset: 12, viewportPadding: 12,
                referencePosition: { top: 160, left: 210, width: 100, height: 100 }
            });

            expect(result.fitsViewport).toBe(true);
            expect(result.offset).toEqual({ top: 172, left: 222 });
        });

        it('preserves configuration order when multiple placements fit', () => {
            const result = service.getBestFit({
                width: 100, height: 100, topOffset: 20, leftOffset: 20,
                referencePosition,
                adaptivePlacements: [{ leftOffset: 30 }, { leftOffset: 40 }]
            });

            expect(result.placementIndex).toBe(0);
            expect(result.fitsViewport).toBe(true);
        });
    });

    it('returns the primary placement when adaptive positioning is omitted', () => {
        const offset = service.resolve({
            alignment: {
                reference: { vertical: 'bottom' }
            },
            height: 200,
            leftOffset: 20,
            referencePosition,
            topOffset: 10,
            width: 300
        });

        expect(offset).toEqual({ top: 450, left: 520 });
    });

    it('keeps the primary placement when it fits', () => {
        const offset = service.resolve({
            alignment: {
                reference: { vertical: 'bottom' }
            },
            adaptivePlacements: [
                {
                    alignment: {
                        reference: { vertical: 'top' },
                        window: { vertical: 'bottom' }
                    }
                }
            ],
            height: 200,
            leftOffset: 0,
            referencePosition,
            topOffset: 8,
            width: 250
        });

        expect(offset).toEqual({ top: 448, left: 500 });
    });

    it('reports primary placement metadata when the primary placement fits', () => {
        const placement = service.resolvePlacement({
            alignment: {
                reference: { vertical: 'bottom' }
            },
            adaptivePlacements: [
                {
                    alignment: {
                        reference: { vertical: 'top' },
                        window: { vertical: 'bottom' }
                    }
                }
            ],
            height: 200,
            leftOffset: 0,
            referencePosition,
            topOffset: 8,
            width: 250
        });

        expect(placement).toEqual({
            offset: { top: 448, left: 500 },
            placementIndex: 0,
            source: 'primary',
            alignment: {
                reference: { vertical: 'bottom' }
            },
            topOffset: 8,
            leftOffset: 0
        });
    });

    it('selects the first fallback placement that fits in the viewport', () => {
        const offset = service.resolve({
            alignment: {
                reference: { vertical: 'bottom' }
            },
            adaptivePlacements: [
                {
                    alignment: {
                        reference: { vertical: 'top' },
                        window: { vertical: 'bottom' }
                    }
                }
            ],
            height: 350,
            leftOffset: 0,
            referencePosition: { ...referencePosition, top: 700 },
            topOffset: 12,
            width: 250
        });

        expect(offset).toEqual({ top: 338, left: 500 });
    });

    it('reports fallback placement metadata when an adaptive placement is selected', () => {
        const placement = service.resolvePlacement({
            alignment: {
                reference: { vertical: 'bottom' }
            },
            adaptivePlacements: [
                {
                    alignment: {
                        reference: { vertical: 'top' },
                        window: { vertical: 'bottom' }
                    }
                }
            ],
            height: 350,
            leftOffset: 0,
            referencePosition: { ...referencePosition, top: 700 },
            topOffset: 12,
            width: 250
        });

        expect(placement).toEqual({
            offset: { top: 338, left: 500 },
            placementIndex: 1,
            source: 'adaptive',
            alignment: {
                reference: { vertical: 'top' },
                window: { vertical: 'bottom' }
            },
            topOffset: -12,
            leftOffset: 0
        });
    });

    it('mirrors inherited offsets when the placement flips to the opposite side', () => {
        const offset = service.resolve({
            alignment: {
                reference: { horizontal: 'right', vertical: 'bottom' },
                window: { horizontal: 'left', vertical: 'top' }
            },
            adaptivePlacements: [
                {
                    alignment: {
                        reference: { horizontal: 'left', vertical: 'top' },
                        window: { horizontal: 'right', vertical: 'bottom' }
                    }
                }
            ],
            height: 200,
            leftOffset: 16,
            referencePosition: { ...referencePosition, left: 1100, top: 820 },
            topOffset: 10,
            width: 300
        });

        expect(offset).toEqual({ top: 610, left: 784 });
    });

    it('uses explicitly provided fallback offsets instead of mirrored inherited values', () => {
        const offset = service.resolve({
            alignment: {
                reference: { vertical: 'bottom' }
            },
            adaptivePlacements: [
                {
                    alignment: {
                        reference: { vertical: 'top' },
                        window: { vertical: 'bottom' }
                    },
                    topOffset: -24
                }
            ],
            height: 350,
            leftOffset: 0,
            referencePosition: { ...referencePosition, top: 700 },
            topOffset: 12,
            width: 250
        });

        expect(offset).toEqual({ top: 326, left: 500 });
    });

    it('chooses the least-overflowing placement when none fit fully', () => {
        const offset = service.resolve({
            alignment: {
                reference: { horizontal: 'right', vertical: 'bottom' }
            },
            adaptivePlacements: [
                {
                    alignment: {
                        reference: { horizontal: 'left', vertical: 'bottom' },
                        window: { horizontal: 'right' }
                    }
                }
            ],
            height: 500,
            leftOffset: 24,
            referencePosition: { top: 700, left: 1120, width: 80, height: 80 },
            topOffset: 24,
            width: 500
        });

        expect(offset).toEqual({ top: 804, left: 596 });
    });

    it('reports the least-overflowing candidate metadata when no placement fits fully', () => {
        const placement = service.resolvePlacement({
            alignment: {
                reference: { horizontal: 'right', vertical: 'bottom' }
            },
            adaptivePlacements: [
                {
                    alignment: {
                        reference: { horizontal: 'left', vertical: 'bottom' },
                        window: { horizontal: 'right' }
                    }
                }
            ],
            height: 500,
            leftOffset: 24,
            referencePosition: { top: 700, left: 1120, width: 80, height: 80 },
            topOffset: 24,
            width: 500
        });

        expect(placement).toEqual({
            offset: { top: 804, left: 596 },
            placementIndex: 1,
            source: 'adaptive',
            alignment: {
                reference: { horizontal: 'left', vertical: 'bottom' },
                window: { horizontal: 'right' }
            },
            topOffset: 24,
            leftOffset: -24
        });
    });

    it('takes viewport padding into account when evaluating fit', () => {
        const offset = service.resolve({
            alignment: {
                reference: { horizontal: 'right' }
            },
            adaptivePlacements: [
                {
                    alignment: {
                        reference: { horizontal: 'left' },
                        window: { horizontal: 'right' }
                    }
                }
            ],
            height: 100,
            leftOffset: 20,
            referencePosition: { ...referencePosition, left: 1035 },
            topOffset: 0,
            viewportPadding: 24,
            width: 150
        });

        expect(offset).toEqual({ top: 400, left: 865 });
    });

    it('handles fallback placements without alignment overrides when the primary alignment is also undefined', () => {
        const offset = service.resolve({
            adaptivePlacements: [{}],
            height: 1000,
            leftOffset: 15,
            topOffset: 25,
            width: 1200
        });

        expect(offset).toEqual({ top: 25, left: 15 });
    });

    it('keeps inherited offsets when the fallback changes to a center-based alignment instead of flipping sides', () => {
        const offset = service.resolve({
            alignment: {
                reference: { horizontal: 'right' },
                window: { horizontal: 'left' }
            },
            adaptivePlacements: [
                {
                    alignment: {
                        reference: { horizontal: 'center' },
                        window: { horizontal: 'left' }
                    }
                }
            ],
            height: 150,
            leftOffset: 18,
            referencePosition: { ...referencePosition, left: 1130, width: 60 },
            topOffset: 0,
            width: 260
        });

        expect(offset).toEqual({ top: 400, left: 1178 });
    });

    it('falls back to the original offsets if no placement candidates are available', () => {
        jest.spyOn(service as any, 'buildCandidates').mockReturnValue([]);

        const offset = service.resolve({
            height: 100,
            leftOffset: 33,
            topOffset: 22,
            width: 120
        });

        expect(offset).toEqual({ top: 22, left: 33 });
    });

    it('uses document element scroll offsets when window scroll offsets are unavailable', () => {
        Object.defineProperty(window, 'scrollX', { value: undefined, configurable: true });
        Object.defineProperty(window, 'scrollY', { value: undefined, configurable: true });
        Object.defineProperty(document.documentElement, 'scrollLeft', { value: 210, configurable: true });
        Object.defineProperty(document.documentElement, 'scrollTop', { value: 160, configurable: true });
        window.innerWidth = 300;
        window.innerHeight = 240;

        const offset = service.resolve({
            alignment: {
                reference: { horizontal: 'right', vertical: 'bottom' }
            },
            adaptivePlacements: [
                {
                    alignment: {
                        reference: { horizontal: 'left', vertical: 'top' },
                        window: { horizontal: 'right', vertical: 'bottom' }
                    }
                }
            ],
            height: 120,
            leftOffset: 8,
            referencePosition: { top: 170, left: 220, width: 30, height: 20 },
            topOffset: 8,
            width: 120
        });

        expect(offset).toEqual({ top: 198, left: 258 });
    });
});
