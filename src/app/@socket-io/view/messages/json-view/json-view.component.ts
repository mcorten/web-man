import {Component, ElementRef, Input, OnChanges} from '@angular/core';
import JSONFormatter from "json-formatter-js";

@Component({
  selector: 'app-json-view',
  templateUrl: './json-view.component.html',
  styleUrls: ['./json-view.component.css']
})
export class JsonViewComponent implements OnChanges {
  @Input() data: unknown;

  constructor(private element: ElementRef) {
  }

  ngOnChanges() {
    if (typeof this.data === 'string') {
      try {
        const parsedData = JSON.parse(this.data);

        const formatter = new JSONFormatter(parsedData, Infinity);
        this.element.nativeElement.appendChild(formatter.render());
      } catch (e) {
        this.element.nativeElement.innerHTML = `<pre>${this.data}</pre>`
      }
    }

  }
}
