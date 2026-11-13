import { AfterContentChecked, AfterRenderRef, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Inject, Injector, Input, NgZone, OnDestroy, OnInit, Output, TemplateRef, ViewChild, afterNextRender } from '@angular/core';
import { filter, map, mergeWith, Subscription, tap } from 'rxjs';
import { ElementPositionService } from './element-position.service';
import { WindowService } from './window.service';
import { WindowPlacementRequest, WindowPlacementService } from './window-placement.service';
import { ResolvedWindowPlacement, WindowBestFit, WindowOptions } from './window.types';

@Component({
    selector: 'ngx-window',
    templateUrl: './window.component.html',
    styleUrls: ['./window.component.scss'],
    standalone: false
})
export class WindowComponent implements OnInit, AfterContentChecked, OnDestroy {

    @ViewChild('template', { static: true })
    private template!: TemplateRef<any>;

    @Input() width?: number;
    @Input() height?: number;
    @Input() topOffset: number = 0;
    @Input() leftOffset: number = 0;
    @Input() options: WindowOptions = {};
    @Input() refElement?: HTMLElement;

    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() placementChange = new EventEmitter<ResolvedWindowPlacement>();

    private _openSubscription?: Subscription;
    private _moveSubscription?: Subscription;

    private _lastEmittedPlacement?: ResolvedWindowPlacement;
    private _placementSyncRef?: AfterRenderRef;
    private _openedAtLeastOnce: boolean = false;
    private _measuredHeight?: number;
    private _measuredWidth?: number;
    private _measureOnOpen: boolean = false;
    private _windowResizeObserver?: ResizeObserver;

    private _destroyed: boolean = false;
    private _bestFitRequests = new Map<AfterRenderRef, (reason: Error) => void>();

    private _id?: number;
    get id() { return this._id; }

    get top() {
        return this.round(this.resolvePlacement().offset.top);
    }

    get left() {
        return this.round(this.resolvePlacement().offset.left);
    }

    get visibility() {
        return this._measureOnOpen ? 'hidden' : null;
    }

    constructor(private windowService: WindowService, private elementPositionService: ElementPositionService,
        private windowPlacementService: WindowPlacementService, private elementRef: ElementRef,
        private changeDetectorRef: ChangeDetectorRef, private ngZone: NgZone,
        @Inject(Injector) private injector: Injector) { }

    ngOnInit() {
        this._id = this.windowService.registerWindow(this.elementRef, this.refElement, this.options.visibility?.keepOpen);

        const opened$ = this.windowService.windowOpened$.pipe(filter(id => id === this._id), map(() => true));
        const closed$ = this.windowService.windowClosed$.pipe(filter(id => id === this._id), map(() => false));
        const moved$ = this.windowService.windowMoved$.pipe(filter(id => id === this._id), map(() => true));

        this._openSubscription = opened$.pipe(
            tap(() => {
                this._openedAtLeastOnce = true;
                this.onWindowOpened();
            }),
            mergeWith(closed$)
        ).subscribe(visible => {
            if (!visible) {
                this.onWindowClosed();
            }

            this.visibleChange.emit(visible);
        });
        this._moveSubscription = moved$.subscribe(() => {
            if (this.windowService.isOpen(this._id!)) {
                this.ngZone.run(() => {
                    this.measureWindow();
                    this.emitPlacementChangeIfNeeded();
                    this.changeDetectorRef.detectChanges();
                });
            }
        });
    }

    ngAfterContentChecked() {
        if (this.options.visibility?.startOpen && !this._openedAtLeastOnce) {
            this.open();
        }

        if (this._openedAtLeastOnce && this._id !== undefined && this.windowService.isOpen(this._id)) {
            this.queuePlacementChangeSync();
        }
    }

    ngOnDestroy() {
        this._destroyed = true;
        this.cancelBestFitRequests();
        this._openSubscription?.unsubscribe();
        this._moveSubscription?.unsubscribe();
        this.clearPlacementChangeSync();
        this.disconnectWindowResizeObserver();
    }

    @HostListener('window:resize')
    onWindowResize() {
        if (this.windowService.isOpen(this._id!)) {
            this.measureWindow();
            this.emitPlacementChangeIfNeeded();
            this.changeDetectorRef.detectChanges();
        }
    }

    /**
     * Measures the current content after the next render without changing the open state.
     * Returns the first fitting placement, or the least-overflowing one with fitsViewport set to false.
     * Pending checks reject with AbortError when the window is closed or destroyed.
     */
    getBestFit(): Promise<WindowBestFit> {
        if (this._destroyed) {
            return Promise.reject(new DOMException('The window has been destroyed.', 'AbortError'));
        }

        return new Promise((resolve, reject) => {
            const renderRef = afterNextRender(() => {
                this._bestFitRequests.delete(renderRef);

                try {
                    if (this._id === undefined) {
                        throw new Error('The window must be initialized before measuring.');
                    }

                    let request = this.createPlacementRequest();

                    if (this.width === undefined || this.height === undefined) {
                        request = this.windowService.measure(this._id, this.template, element => {
                            const rect = element.getBoundingClientRect();

                            return {
                                ...request,
                                width: this.width ?? rect.width,
                                height: this.height ?? rect.height
                            };
                        });
                    }

                    resolve(this.windowPlacementService.getBestFit(request));
                } catch (error) {
                    reject(error);
                }
            }, { injector: this.injector });

            this._bestFitRequests.set(renderRef, reject);
            this.changeDetectorRef.markForCheck();
        });
    }

    open() {
        this._measureOnOpen = this.width === undefined || this.height === undefined;

        if (!this._measureOnOpen) {
            this.measureWindow();
        }

        this.windowService.open(this._id!, this.template);
    }

    close() {
        this.cancelBestFitRequests();
        this.windowService.close(this._id!);
    }

    toggle() {
        if (!this.windowService.isOpen(this._id!)) {
            this.open();
        } else {
            this.close();
        }
    }

    private onWindowOpened() {
        this.measureWindow();
        this.startWindowResizeObserver();
        this.queuePlacementChangeSync();
        this.changeDetectorRef.detectChanges();
    }

    private onWindowClosed() {
        this.cancelBestFitRequests();
        this._measureOnOpen = false;
        this._lastEmittedPlacement = undefined;
        this.clearPlacementChangeSync();
        this.disconnectWindowResizeObserver();
    }

    private cancelBestFitRequests() {
        for (const [renderRef, reject] of this._bestFitRequests) {
            renderRef.destroy();
            reject(new DOMException('Window measurement was cancelled.', 'AbortError'));
        }

        this._bestFitRequests.clear();
    }

    private resolvePlacement(): ResolvedWindowPlacement {
        return this.windowPlacementService.resolvePlacement(this.createPlacementRequest());
    }

    private createPlacementRequest(): WindowPlacementRequest {
        return {
            alignment: this.options.alignment,
            adaptivePlacements: this.options.adaptivePosition?.placements,
            height: this.height ?? this._measuredHeight ?? 0,
            leftOffset: this.leftOffset,
            referencePosition: this.refElement ? this.elementPositionService.getPosition(this.refElement) : undefined,
            topOffset: this.topOffset,
            viewportPadding: this.options.adaptivePosition?.viewportPadding,
            width: this.width ?? this._measuredWidth ?? 0
        };
    }

    private emitPlacementChangeIfNeeded() {
        const placement = this.resolvePlacement();

        if (this.samePlacement(this._lastEmittedPlacement, placement)) {
            return;
        }

        this._lastEmittedPlacement = placement;
        this.placementChange.emit(placement);
    }

    private queuePlacementChangeSync() {
        if (this._placementSyncRef) {
            return;
        }

        this._placementSyncRef = afterNextRender(() => {
            this._placementSyncRef = undefined;

            if (this._id === undefined || !this.windowService.isOpen(this._id)) {
                return;
            }

            this.emitPlacementChangeIfNeeded();
        }, {
            injector: this.injector
        });
    }

    private clearPlacementChangeSync() {
        if (this._placementSyncRef) {
            this._placementSyncRef.destroy();
            this._placementSyncRef = undefined;
        }
    }

    private samePlacement(left?: ResolvedWindowPlacement, right?: ResolvedWindowPlacement): boolean {
        return left?.placementIndex === right?.placementIndex
            && left?.source === right?.source
            && left?.topOffset === right?.topOffset
            && left?.leftOffset === right?.leftOffset
            && left?.alignment?.window?.horizontal === right?.alignment?.window?.horizontal
            && left?.alignment?.window?.vertical === right?.alignment?.window?.vertical
            && left?.alignment?.reference?.horizontal === right?.alignment?.reference?.horizontal
            && left?.alignment?.reference?.vertical === right?.alignment?.reference?.vertical;
    }

    private round(value: number) {
        return Math.round((value + Number.EPSILON) * 100) / 100;
    }

    private measureWindow() {
        const windowElement = this._id !== undefined ? this.windowService.getWindowElement(this._id) : undefined;

        if (!windowElement) {
            return;
        }

        const rect = windowElement.getBoundingClientRect();

        if (this.width === undefined) {
            this._measuredWidth = rect.width;
        }

        if (this.height === undefined) {
            this._measuredHeight = rect.height;
        }

        if ((this.width !== undefined || this._measuredWidth !== undefined)
            && (this.height !== undefined || this._measuredHeight !== undefined)) {
            this._measureOnOpen = false;
        }
    }

    private startWindowResizeObserver() {
        if (this.width !== undefined && this.height !== undefined) {
            return;
        }

        const windowElement = this._id !== undefined ? this.windowService.getWindowElement(this._id) : undefined;

        if (!windowElement || typeof ResizeObserver === 'undefined') {
            return;
        }

        this.disconnectWindowResizeObserver();
        this._windowResizeObserver = new ResizeObserver(() => {
            this.ngZone.run(() => {
                this.measureWindow();
                this.emitPlacementChangeIfNeeded();
                this.changeDetectorRef.detectChanges();
            });
        });
        this._windowResizeObserver.observe(windowElement);
    }

    private disconnectWindowResizeObserver() {
        this._windowResizeObserver?.disconnect();
        this._windowResizeObserver = undefined;
    }
}
