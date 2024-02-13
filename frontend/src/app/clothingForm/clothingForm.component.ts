import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClothingService } from '../clothing.service';


@Component({
  selector: 'app-clothing-form',
  templateUrl: './clothingForm.component.html',
  styleUrls: ['./clothingForm.component.css']
})
export class ClothingFormComponent implements OnInit {
  clothingForm: FormGroup;
  clothingCategories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private clothingService: ClothingService
  ) {
    this.clothingForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      image_url: [''],
      category_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.clothingService.getClothingCategories().subscribe({
      next: (categories) => {
        this.clothingCategories = categories;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories', error);
      }
    });
  }

  onSubmit(): void {
    console.log("first")
    if (this.clothingForm.valid) {
      console.log("TEST CHIPS")
      this.clothingService.addClothingItem(
        this.clothingForm.value.name,
        this.clothingForm.value.description,
        this.clothingForm.value.image_url,
        this.clothingForm.value.category_id,
      ).subscribe({
        next: (response) => {
          console.log('Vêtement ajouté avec succès', response);  
          this.clothingForm.reset();
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout du vêtement', error);
        }
      });
    }
    else{

      console.log("error : ", this.clothingForm)
    }
  }
}
