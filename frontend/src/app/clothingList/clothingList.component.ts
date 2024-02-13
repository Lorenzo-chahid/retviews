import { Component, OnInit } from '@angular/core';
import { ClothingService, ClothingItem } from '../clothing.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clothing-list',
  templateUrl: './clothingList.component.html',
  styleUrls: ['./clothingList.component.css']
})
export class ClothingListComponent implements OnInit {
  clothingItems: ClothingItem[] = [];
  selectedItem: ClothingItem | null = null;

  constructor(private clothingService: ClothingService, private router: Router) {}

  ngOnInit(): void {
    this.clothingService.getClothingItems().subscribe(items => {
      this.clothingItems = items;
      console.log(this.clothingItems)
    });
  }

  goToDetail(id: number): void {
    console.log("GO DETAILS !")
    console.log("ID :: ",id)
    this.router.navigate(['/detail', id]);
  }
}
