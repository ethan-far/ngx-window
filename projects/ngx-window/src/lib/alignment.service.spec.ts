import { TestBed } from '@angular/core/testing';
import { AlignmentService } from './alignment.service';
import { HorizontalAnchor, Position, VerticalAnchor } from './window.types';

function using<CASES extends Array<ARGS>, ARGS extends Array<any>>(parameters: CASES, testFn: (...args: ARGS) => void) {
    parameters.forEach((param) => { testFn.apply(null, param); });
}

describe('AlignmentService', () => {

    let alignmentService: AlignmentService;
    let windowPosition: Position;
    let referencePosition: Position;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AlignmentService
            ]
        });

        alignmentService = TestBed.inject(AlignmentService);

        windowPosition = { top: 123, left: 456, width: 100, height: 200 };
        referencePosition = { top: 765, left: 890, width: 500, height: 300 };

        window.innerWidth = 1920;
        window.innerHeight = 1080;
    });

    describe('align', () => {
        describe('if no reference alignment', () => {
            describe('and no reference position', () => {
                describe('and no window alignment', () => {
                    it('returns the offset from the screen top left (0, 0)', () => {
                        let alignedOffset = alignmentService.align(windowPosition);

                        expect(alignedOffset).toEqual({ top: 123, left: 456 });
                    });
                });

                describe('but there is a window alignment', () => {
                    using([[undefined, 456], ['left', 456], ['center', 406], ['right', 356]], (horizontal: HorizontalAnchor | undefined, expectedLeft: number) => {
                        using([[undefined, 123], ['top', 123], ['center', 23], ['bottom', -77]], (vertical: VerticalAnchor | undefined, expectedTop: number) => {
                            it(`for alignment: ${horizontal},${vertical} returns offset: ${expectedLeft},${expectedTop}`, () => {
                                let alignedOffset = alignmentService.align(windowPosition, { horizontal, vertical });

                                expect(alignedOffset).toEqual({ top: expectedTop, left: expectedLeft });
                            });
                        });
                    });
                });
            });

            describe('but there is a reference position', () => {
                describe('but no window alignment', () => {
                    it('returns the offset from the reference position', () => {
                        let alignedOffset = alignmentService.align(windowPosition, undefined, referencePosition);

                        expect(alignedOffset).toEqual({ top: 888, left: 1346 });
                    });
                });

                describe('and a window alignment', () => {
                    using([[undefined, 1346], ['left', 1346], ['center', 1296], ['right', 1246]], (horizontal: HorizontalAnchor | undefined, expectedLeft: number) => {
                        using([[undefined, 888], ['top', 888], ['center', 788], ['bottom', 688]], (vertical: VerticalAnchor | undefined, expectedTop: number) => {
                            it(`for alignment: ${horizontal},${vertical} returns offset: ${expectedLeft},${expectedTop}`, () => {
                                let alignedOffset = alignmentService.align(windowPosition, { horizontal, vertical }, referencePosition);

                                expect(alignedOffset).toEqual({ top: expectedTop, left: expectedLeft });
                            });
                        });
                    });
                });
            });
        });

        describe('if there is a reference alignment', () => {
            describe('but no reference position', () => {
                describe('and no window alignment', () => {
                    using([[undefined, 456], ['left', 456], ['center', 1416], ['right', 2376]], (horizontal: HorizontalAnchor | undefined, expectedLeft: number) => {
                        using([[undefined, 123], ['top', 123], ['center', 663], ['bottom', 1203]], (vertical: VerticalAnchor | undefined, expectedTop: number) => {
                            it(`for alignment: ${horizontal},${vertical} returns offset: ${expectedLeft},${expectedTop}`, () => {
                                let alignedOffset = alignmentService.align(windowPosition, undefined, undefined, { horizontal, vertical });

                                expect(alignedOffset).toEqual({ top: expectedTop, left: expectedLeft });
                            });
                        });
                    });
                });

                describe('but there is a window alignment', () => {
                    using([[undefined, 456], ['left', 456], ['center', 406], ['right', 356]], (windowHorizontal: HorizontalAnchor | undefined, windowLeft: number) => {
                        using([[undefined, 123], ['top', 123], ['center', 23], ['bottom', -77]], (windowVertical: VerticalAnchor | undefined, windowTop: number) => {
                            using([[undefined, windowLeft], ['left', windowLeft], ['center', windowLeft + 960], ['right', windowLeft + 1920]], (referenceHorizontal: HorizontalAnchor | undefined, expectedLeft: number) => {
                                using([[undefined, windowTop], ['top', windowTop], ['center', windowTop + 540], ['bottom', windowTop + 1080]], (referenceVertical: VerticalAnchor | undefined, expectedTop: number) => {
                                    it(`for window alignment: ${windowHorizontal},${windowVertical} and reference alignment: ${referenceHorizontal}, ${referenceVertical} returns offset: ${expectedLeft},${expectedTop}`, () => {
                                        let alignedOffset = alignmentService.align(windowPosition, { horizontal: windowHorizontal, vertical: windowVertical }, undefined, { horizontal: referenceHorizontal, vertical: referenceVertical });

                                        expect(alignedOffset).toEqual({ top: expectedTop, left: expectedLeft });
                                    });
                                });
                            });
                        });
                    });
                });
            });

            describe('and a reference position', () => {
                describe('but no window alignment', () => {
                    using([[undefined, 1346], ['left', 1346], ['center', 1596], ['right', 1846]], (horizontal: HorizontalAnchor | undefined, expectedLeft: number) => {
                        using([[undefined, 888], ['top', 888], ['center', 1038], ['bottom', 1188]], (vertical: VerticalAnchor | undefined, expectedTop: number) => {
                            it(`for alignment: ${horizontal},${vertical} returns offset: ${expectedLeft},${expectedTop}`, () => {
                                let alignedOffset = alignmentService.align(windowPosition, undefined, referencePosition, { horizontal, vertical });

                                expect(alignedOffset).toEqual({ top: expectedTop, left: expectedLeft });
                            });
                        });
                    });
                });

                describe('and a window alignment', () => {
                    using([[undefined, 456], ['left', 456], ['center', 406], ['right', 356]], (windowHorizontal: HorizontalAnchor | undefined, windowLeft: number) => {
                        using([[undefined, 123], ['top', 123], ['center', 23], ['bottom', -77]], (windowVertical: VerticalAnchor | undefined, windowTop: number) => {
                            using([[undefined, windowLeft + 890], ['left', windowLeft + 890], ['center', windowLeft + 1140], ['right', windowLeft + 1390]], (referenceHorizontal: HorizontalAnchor | undefined, expectedLeft: number) => {
                                using([[undefined, windowTop + 765], ['top', windowTop + 765], ['center', windowTop + 915], ['bottom', windowTop + 1065]], (referenceVertical: VerticalAnchor | undefined, expectedTop: number) => {
                                    it(`for window alignment: ${windowHorizontal},${windowVertical} and reference alignment: ${referenceHorizontal}, ${referenceVertical} returns offset: ${expectedLeft},${expectedTop}`, () => {
                                        let alignedOffset = alignmentService.align(windowPosition, { horizontal: windowHorizontal, vertical: windowVertical }, referencePosition, { horizontal: referenceHorizontal, vertical: referenceVertical });

                                        expect(alignedOffset).toEqual({ top: expectedTop, left: expectedLeft });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});