import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PeriodicElement } from '../../model/element';

@Component({
  selector: 'app-edit-element-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './edit-element-dialog.component.html',
  styleUrls: ['./edit-element-dialog.component.css']
})

export class EditElementDialogComponent implements OnInit {
  editForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditElementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PeriodicElement
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.editForm = this.fb.group({
      position: [{ value: this.data.position, disabled: true }],
      name: [this.data.name],
      weight: [this.data.weight],
      symbol: [this.data.symbol]
    });
  }

  public onSave(): void {
    if (this.editForm.valid) {
      this.dialogRef.close({ ...this.editForm.getRawValue(), position: this.data.position });
    }
  }

  public onCancel(): void {
    this.dialogRef.close();
  }
}
