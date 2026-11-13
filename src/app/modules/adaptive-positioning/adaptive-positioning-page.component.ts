import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { ResolvedWindowPlacement, WindowComponent, WindowOptions } from '../../../../projects/ngx-window/src/public-api';

@Component({
    selector: 'ngx-test-adaptive-positioning-page',
    templateUrl: './adaptive-positioning-page.component.html',
    styleUrls: ['./adaptive-positioning-page.component.scss'],
    standalone: false
})
export class AdaptivePositioningPageComponent {
    @ViewChild('reference', { static: true }) reference!: ElementRef<HTMLElement>;
    @ViewChild(WindowComponent) demoWindow!: WindowComponent;

    private _coordinates?: [number, number];
    private _offset?: [number, number];
    readonly placementLabels = ['Below trigger', 'Above trigger', 'Left of trigger', 'Right of trigger'];
    currentPlacementLabel = 'Resolving...';
    fitStatus = 'Check the fit without showing the window.';
    checkingFit = false;

    windowOptions: WindowOptions = {
        visibility: {
            startOpen: true,
            keepOpen: {
                onClickOutside: true,
                onIntersection: true
            }
        },
        alignment: {
            reference: {
                horizontal: 'left',
                vertical: 'bottom'
            },
            window: {
                horizontal: 'left'
            }
        },
        adaptivePosition: {
            viewportPadding: 24,
            placements: [
                {
                    alignment: {
                        reference: {
                            vertical: 'top'
                        },
                        window: {
                            vertical: 'bottom'
                        }
                    }
                },
                {
                    alignment: {
                        reference: {
                            vertical: 'center'
                        },
                        window: {
                            horizontal: 'right',
                            vertical: 'center'
                        }
                    },
                    leftOffset: -18,
                    topOffset: 0
                },
                {
                    alignment: {
                        reference: {
                            horizontal: 'right',
                            vertical: 'center'
                        },
                        window: {
                            vertical: 'center'
                        }
                    },
                    leftOffset: 18,
                    topOffset: 0
                }
            ]
        }
    };

    constructor(private changeDetectorRef: ChangeDetectorRef) {}

    async checkBestFit(): Promise<void> {
        this.demoWindow.close();
        this.checkingFit = true;

        try {
            const fit = await this.demoWindow.getBestFit();
            this.onPlacementChange(fit);
            this.fitStatus = fit.fitsViewport
                ? 'A placement fits within the viewport padding. The window is still closed.'
                : 'No placement fits within the viewport padding. The window is still closed.';
        } catch {
            this.fitStatus = 'The fit check was cancelled or could not be completed.';
        } finally {
            this.checkingFit = false;
            this.changeDetectorRef.markForCheck();
        }
    }

    onDragOver(event: DragEvent) {
        event.preventDefault();
    }

    onDragStart(event: DragEvent) {
        this._coordinates = [event.x, event.y];
        this._offset = [this.reference.nativeElement.offsetLeft, this.reference.nativeElement.offsetTop];
    }

    onDrag(event: DragEvent) {
        if (!this._coordinates || !this._offset || !event.x || !event.y) {
            return;
        }

        this.reference.nativeElement.style.left = `${this._offset[0] + (event.x - this._coordinates[0])}px`;
        this.reference.nativeElement.style.top = `${this._offset[1] + (event.y - this._coordinates[1])}px`;
    }

    onPlacementChange(placement: ResolvedWindowPlacement) {
        this.currentPlacementLabel = this.placementLabels[placement.placementIndex] ?? `Placement ${placement.placementIndex}`;
    }
}
