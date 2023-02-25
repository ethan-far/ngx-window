import { Component, Input } from '@angular/core';

@Component({
    selector: 'ngx-test-link',
    templateUrl: './link.component.html',
    styleUrls: ['./link.component.scss']
})
export class LinkComponent {
    @Input() title!: string;
    @Input() url!: string;
}