import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { ClothingService, ClothingItem } from '../clothing.service'; // Assurez-vous que le chemin d'importation est correct

@Component({
  selector: 'app-clothing-detail',
  templateUrl: './clothingDetail.component.html',
  styleUrls: ['./clothingDetail.component.css']
})
export class ClothingDetailComponent implements OnInit {
  item: ClothingItem | undefined;
  clothingCategories: any[] = []; // Utilisez un type plus spécifique si disponible

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

    this.getClothingCategories();
  }

  getClothingCategories(): void {
    this.clothingService.getClothingCategories().subscribe({
      next: (categories) => {
        this.clothingCategories = categories;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
        // Gérez les erreurs ici, par exemple, en affichant un message d'erreur à l'utilisateur
      }
    });
  }

  updateItem(): void {
    if (this.item) {
      const token = localStorage.getItem('auth_token');
      const userId = localStorage.getItem('user_id');

      if (token && userId) {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        const itemDataWithUserId = {
          ...this.item,
          user_id: userId
        };

        this.clothingService.updateItem(this.item.id, itemDataWithUserId, { headers }).subscribe({
          next: () => {
            console.log('Item updated successfully');
            // Ajoutez ici toute logique supplémentaire après la mise à jour réussie, comme une redirection ou l'affichage d'une notification
          },
          error: (error) => {
            console.error('Error updating item:', error);
            // Gérez ici les erreurs, par exemple en affichant un message d'erreur à l'utilisateur
          }
        });
      } else {
        console.error('No auth token or user ID found');
        // Gérez le cas où le jeton d'authentification ou l'user_id n'est pas trouvé, par exemple en redirigeant l'utilisateur vers la page de connexion
      }
    } else {
      console.error('Attempted to update an undefined item');
      // Gérez le cas où `this.item` est undefined, par exemple en affichant un message d'erreur
    }
  }
}
