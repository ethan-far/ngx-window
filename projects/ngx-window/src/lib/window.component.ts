import { AfterContentChecked, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, NgZone, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { filter, map, mergeWith, Subscription, tap } from 'rxjs';
import { AlignmentService } from './alignment.service';
import { ElementPositionService } from './element-position.service';
import { WindowService } from './window.service';
import { WindowOptions } from './window.types';

@Component({
    selector: 'ngx-window',
    templateUrl: './window.component.html',
    styleUrls: ['./window.component.scss'],
    standalone: false
})
export class WindowComponent implements OnInit, AfterContentChecked, OnDestroy {

    @ViewChild('template', { static: true })
    private template!: TemplateRef<any>;

    @Input() width!: number;
    @Input() height!: number;
    @Input() topOffset: number = 0;
    @Input() leftOffset: number = 0;
    @Input() options: WindowOptions = {};
    @Input() refElement?: HTMLElement;

    @Output() visibleChange = new EventEmitter<boolean>();

    private _openSubscription?: Subscription;
    private _moveSubscription?: Subscription;

    private _openedAtLeastOnce: boolean = false;

    private _id?: number;
    get id() { return this._id; }

    get top() {
        let offset = this.alignmentService.align(
            { top: (this.topOffset as number), left: (this.leftOffset as number), width: this.width, height: this.height },
            this.options.alignment?.window,
            this.refElement ? this.elementPositionService.getPosition(this.refElement) : undefined,
            this.options.alignment?.reference)

        return Math.round((offset.top + Number.EPSILON) * 100) / 100;
    }

    get left() {
        let offset = this.alignmentService.align(
            { top: (this.topOffset as number), left: (this.leftOffset as number), width: this.width, height: this.height },
            this.options.alignment?.window,
            this.refElement ? this.elementPositionService.getPosition(this.refElement) : undefined,
            this.options.alignment?.reference)

        return Math.round((offset.left + Number.EPSILON) * 100) / 100;
    }

    constructor(private windowService: WindowService, private elementPositionService: ElementPositionService,
        private alignmentService: AlignmentService, private elementRef: ElementRef,
        private changeDetectorRef: ChangeDetectorRef, private ngZone: NgZone) { }

    ngOnInit() {
        this._id = this.windowService.registerWindow(this.elementRef, this.refElement, this.options.visibility?.keepOpen);

        const opened$ = this.windowService.windowOpened$.pipe(filter(id => id === this._id), map(() => true));
        const closed$ = this.windowService.windowClosed$.pipe(filter(id => id === this._id), map(() => false));
        const moved$ = this.windowService.windowMoved$.pipe(filter(id => id === this._id), map(() => true));

        this._openSubscription = opened$.pipe(
            tap(() => { this._openedAtLeastOnce = true; }),
            mergeWith(closed$)
        ).subscribe(visible => this.visibleChange.emit(visible));
        this._moveSubscription = moved$.subscribe(() => {
            if (this.windowService.isOpen(this._id!)) {
                this.ngZone.run(() => {
                    this.changeDetectorRef.detectChanges();
                });
            }
        });
    }

    ngAfterContentChecked() {
        if (this.options.visibility?.startOpen && !this._openedAtLeastOnce) {
            this.open();
        }
    }

    ngOnDestroy() {
        this._openSubscription?.unsubscribe();
        this._moveSubscription?.unsubscribe();
    }

    @HostListener('window:resize')
    onWindowResize() {
        if (this.windowService.isOpen(this._id!)) {
            this.changeDetectorRef.detectChanges();
        }
    }

    open() {
        this.windowService.open(this._id!, this.template);
    }

    close() {
        this.windowService.close(this._id!);
    }

    toggle() {
        if (!this.windowService.isOpen(this._id!)) {
            this.open();
        } else {
            this.close();
        }
    }
}
