import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Filter} from "../../../../model/shared/filter";

@Component({
    selector: 'app-filtro',
    templateUrl: './filtro.component.html',
    styleUrls: ['./filtro.component.scss']
})
export class FiltroComponent implements OnInit {

    @ViewChild('modalFilter') modalFilter;

    @Input() titleModal = 'Filtros';
    @Input() filters: Filter[] = new Array<Filter>();
    @Input() filtersSelected: Filter[] = new Array<Filter>();

    @Output() filter = new EventEmitter();
    @Output() remove = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
    }

    onOpenFilter() {
        this.modalFilter.show();
    }

    onFilter() {
        this.modalFilter.hide();
        this.filter.emit(this.filters);
    }

    onRemove(filter: Filter) {
        this.remove.emit(filter);
    }
}
