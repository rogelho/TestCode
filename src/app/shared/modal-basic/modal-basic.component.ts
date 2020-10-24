import {Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-modal-basic',
  templateUrl: './modal-basic.component.html',
  styleUrls: ['./modal-basic.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalBasicComponent implements OnInit {
  @Input() dialogClass: string;
  @Input() hideHeader = false;
  @Input() hideFooter = false;
  @Output() onContainerClickedModal = new EventEmitter();
  public visible = false;
  public visibleAnimate = false;

  constructor() {}

  ngOnInit() {

  }

  public show(): void {
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 100);
  }

  public hide(): void {
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }

  public onContainerClicked(event: MouseEvent): void {
    this.onContainerClickedModal.emit(event);
    if ((<HTMLElement>event.target).classList.contains('modal')) {
      this.hide();
    }
  }

}
