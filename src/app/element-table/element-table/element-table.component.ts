import { Component, OnDestroy, OnInit } from '@angular/core';
import { ElementService } from '../../services/element.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BehaviorSubject, Observable, Subject, Subscription, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PeriodicElement } from '../../model/element';
import { EditElementDialogComponent } from '../../edit-element-dialog/edit-element-dialog/edit-element-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-element-table',
  templateUrl: './element-table.component.html',
  styleUrls: ['./element-table.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule 
  ]
})

export class ElementTableComponent implements OnInit, OnDestroy {
  public displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'edit'];
  public dataSource: MatTableDataSource<PeriodicElement> = new MatTableDataSource<PeriodicElement>();
  public filter: FormControl = new FormControl('');
  private subscriptions: Subscription = new Subscription();

  constructor(private elementService: ElementService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.elementService.getElements().subscribe(elements => {
        this.dataSource.data = elements;
      })
    );

    this.subscriptions.add(
      this.filter.valueChanges.pipe(
        debounceTime(2000),
        distinctUntilChanged()
      ).subscribe(value => this.applyFilter(value ?? ''))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public editElement(element: PeriodicElement): void {
    const dialogRef = this.dialog.open(EditElementDialogComponent, {
      width: '250px',
      data: { ...element }
    });

    this.subscriptions.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.elementService.updateElement(result);
          this.elementService.getElements().subscribe(elements => {
            this.dataSource.data = elements;
          });
        }
      })
    );
  }
}
