import { AfterContentChecked, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild, ViewRef } from '@angular/core';
import { filter, map, mergeWith, Subscription, tap } from 'rxjs';
import { ElementPositionService } from './element-position.service';
import { WindowService } from './window.service';

export interface WindowAlignmentOptions {
    alignToBottom?: boolean;
    alignToRight?: boolean;
    alignFromBottom?: boolean;
    alignFromRight?: boolean;
}

export interface WindowOptions {
    startOpen?: boolean;
    alignment?: WindowAlignmentOptions
};

@Component({
    selector: 'ngx-window',
    templateUrl: './window.component.html',
    styleUrls: ['./window.component.scss']
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
        let top = this.topOffset;

        if (this.refElement) {
            const position = this.elementPositionService.getPosition(this.refElement);

            top += position.top +
                (this.options.alignment?.alignToBottom ? position.height : 0) -
                (this.options.alignment?.alignFromBottom ? this.height : 0);
        }

        return Math.round((top + Number.EPSILON) * 100) / 100;
    }

    get left() {
        let left = this.leftOffset;

        if (this.refElement) {
            const position = this.elementPositionService.getPosition(this.refElement);

            left += position.left +
                (this.options.alignment?.alignToRight ? position.width : 0) -
                (this.options.alignment?.alignFromRight ? this.width : 0);
        }

        return Math.round((left + Number.EPSILON) * 100) / 100;
    }

    constructor(private windowService: WindowService, private elementPositionService: ElementPositionService, private elementRef: ElementRef, private changeDetectorRef: ChangeDetectorRef) { }

    ngOnInit() {
        this._id = this.windowService.registerWindow(this.elementRef, this.refElement);

        const opened$ = this.windowService.windowOpened$.pipe(filter(id => id === this._id), map(() => true));
        const closed$ = this.windowService.windowClosed$.pipe(filter(id => id === this._id), map(() => false));
        const moved$ = this.windowService.windowMoved$.pipe(filter(id => id === this._id), map(() => true));

        this._openSubscription = opened$.pipe(
            tap(() => { this._openedAtLeastOnce = true; }),
            mergeWith(closed$)
        ).subscribe(visible => this.visibleChange.emit(visible));
        this._moveSubscription = moved$.subscribe(() => {
            if (this.windowService.isOpen(this._id!)) {
                this.changeDetectorRef.detectChanges();
            }
        });
    }

    ngAfterContentChecked() {
        if (this.options.startOpen && !this._openedAtLeastOnce) {
            this.open();
        }
    }

    ngOnDestroy() {
        this._openSubscription?.unsubscribe();
        this._moveSubscription?.unsubscribe();
    }

    @HostListener('window:resize', ['$event'])
    onWindowResize() {
        if (this.windowService.isOpen(this._id!)) {
            this.changeDetectorRef.detectChanges();
        }
    }

    onClick(event: MouseEvent) {
        event.stopPropagation();
        event.preventDefault();
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
