import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, ViewRef } from '@angular/core';
import { filter, map, mergeWith } from 'rxjs';
import { ElementPositionService } from './element-position.service';
import { WindowService } from './window.service';

export interface WindowOptions {
    alignment?: {
        alignToBottom?: boolean;
        alignToRight?: boolean;
        alignFromBottom?: boolean;
        alignFromRight?: boolean;
    }
};

@Component({
    selector: 'ngx-window',
    templateUrl: './window.component.html',
    styleUrls: ['./window.component.scss']
})
export class WindowComponent implements OnInit {

    @ViewChild('template', { static: true })
    private template!: TemplateRef<any>;

    @Input() width!: number;
    @Input() height!: number;
    @Input() topOffset: number = 0;
    @Input() leftOffset: number = 0;
    @Input() options: WindowOptions = {};
    @Input() refElement?: HTMLElement;

    @Output() visibleChange = new EventEmitter<boolean>();

    private _id?: number;
    get id() { return this._id; }

    // TODO: Replace this state with a call to the window service
    private _visible: boolean = false;
    get visible() { return this._visible };

    get top() {
        let top = this.topOffset;

        if (this.refElement) {
            const position = this.elementPositionService.getPosition(this.refElement);

            top += position.top +
                (this.options.alignment?.alignToBottom ? position.height : 0) -
                (this.options.alignment?.alignFromBottom ? this.height : 0);
        }

        return top;
    }

    get left() {
        let left = this.leftOffset;

        if (this.refElement) {
            const position = this.elementPositionService.getPosition(this.refElement);

            left += position.left +
                (this.options.alignment?.alignToRight ? position.width : 0) -
                (this.options.alignment?.alignFromRight ? this.width : 0);
        }

        return left;
    }

    constructor(private windowService: WindowService, private elementPositionService: ElementPositionService, private elementRef: ElementRef) { }

    ngOnInit() {
        this._id = this.windowService.registerWindow(this.elementRef, this.refElement);

        const opened$ = this.windowService.windowOpened$.pipe(filter(id => id === this._id), map(() => true));
        const closed$ = this.windowService.windowClosed$.pipe(filter(id => id === this._id), map(() => false));

        opened$.pipe(mergeWith(closed$)).subscribe(visible => this.visibleChange.emit(visible));
    }

    onClick(event: MouseEvent) {
        event.stopPropagation();
        event.preventDefault();
    }

    open() {
        if (!this._visible) {
            this._visible = true;
            this.windowService.open(this._id!, this.template);
            this.visibleChange.emit(this._visible);
        }
    }

    close() {
        if (this._visible) {
            this._visible = false;
            this.windowService.close(this._id!);
            this.visibleChange.emit(this._visible);
        }
    }

    toggle() {
        if (!this.visible) {
            this.open();
        } else {
            this.close();
        }
    }
}
