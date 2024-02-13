// clothing-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClothingService, ClothingItem } from '../clothing.service';


@Component({
  selector: 'app-clothing-detail',
  templateUrl: './clothingDetail.component.html',
  styleUrls: ['./clothingDetail.component.css']
})
export class ClothingDetailComponent implements OnInit {
  item: ClothingItem | undefined;

  constructor(
    private route: ActivatedRoute,
    private clothingService: ClothingService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.clothingService.getClothingItemById(id).subscribe(item => {
          this.item = item;
        });
      }
    });
  }
}
