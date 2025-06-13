import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ContentChild,
  contentChild,
  ContentChildren,
  effect,
  input,
  QueryList,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckbox } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { TfsCellDirective } from './tfs-cell.directive';

/**
 * @title Table with expandable rows
 */
@Component({
  selector: 'tfs-table',
  styleUrl: 'table.css',
  templateUrl: 'table.html',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCheckbox,
    MatSortModule,
    CommonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class tableComponent<T = any>
  implements AfterViewInit, AfterContentInit
{
  @ContentChild('actionsTemplate', { read: TemplateRef })
  actionsTemplate!: TemplateRef<any>;
  @ContentChild('expandedRow', { read: TemplateRef })
  expandedRowTemplate!: TemplateRef<any>;
  @ContentChildren(TfsCellDirective)
  cellTemplates!: QueryList<TfsCellDirective>;

  //user inputs
  tableData = input.required<T[]>();
  columns = input.required<string[]>();
  sortableColumns = input<string[]>([]);
  expandable = input<boolean>(false);
  selectable = input<boolean>(false);

  // table features
  sort = viewChild<MatSort>(MatSort);
  expandedElement: T | null | undefined;
  expandedContent = contentChild(TemplateRef);
  selection = new SelectionModel<T>(true, []);
  dataSource = new MatTableDataSource<T>();
  cellTemplateMap = new Map<string, TemplateRef<any>>();

  isSortableColumn(columnName: string): boolean {
    return !this.sortableColumns().includes(columnName);
  }

  // Compute totalColumns
  totalColumns = computed(() => {
    let cols = [...this.columns()];
    if (this.selectable()) {
      cols = ['select', ...cols];
    }
    if (this.expandable()) {
      cols = ['expand', ...cols];
    }

    return cols;
  });

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort()!;
  }

  ngAfterContentInit(): void {
    this.cellTemplates.forEach((dir) => {
      this.cellTemplateMap.set(dir.columnName(), dir.template);
    });
  }

  getCellTemplate(column: string): TemplateRef<any> | null {
    // console.log("getCellTemplate called with column:", this.cellTemplateMap);

    return this.cellTemplateMap.get(column) ?? null;
  }

  constructor() {
    effect(() => {
      this.dataSource.data = this.tableData();
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: T): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
  }

  /** Checks whether an element is expanded. */
  isExpanded(element: T) {
    return this.expandedElement === element;
  }

  /** Toggles the expanded state of an element. */
  expandRow(element: T) {
    this.expandedElement = this.isExpanded(element) ? null : element;
  }
}

