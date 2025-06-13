import { ChangeDetectionStrategy, Directive, input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appTfsCell]',})
export class TfsCellDirective {
  columnName =  input.required<string>();

  constructor(public template: TemplateRef<any>) {
    console.log("Directive TfsCellDirective initialized with columnName:", template);

  }

}
