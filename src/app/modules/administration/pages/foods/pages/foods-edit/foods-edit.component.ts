import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FoodService} from "@app/modules/administration/pages/foods/services/food.service";
import {LoadingService} from "@app/core/services/loading.service";
import {SelectService} from "@app/core/services/select.service";
import {ImageService} from "@app/core/services/image.service";
import {AlertService} from "@app/core/services/alert.service";
import {FormGroup} from "@angular/forms";
import {Select} from "@app/core/interfaces/select.interface";

@Component({
  selector: 'app-foods-edit',
  templateUrl: './foods-edit.component.html',
  styleUrls: ['./foods-edit.component.scss']
})
export class FoodsEditComponent implements OnInit {

  public formFood: FormGroup = new FormGroup({});

  movieFoodId: string = '';
  dataFood: any = '';

  dataTypeFood: Select[] = [];
  dataVariantFood: Select[] = [];

  fileImageProduct: string = '';
  fileNameProduct: string = '';

  constructor(
    private route: Router,
    private _food: FoodService,
    private _alert: AlertService,
    private _image: ImageService,
    private _select: SelectService,
    private _loader: LoadingService,
  ) {
    _loader.show();
  }

  ngOnInit() {
    this._food._foodId.subscribe(value => {
      if (value !== null) {
        this.movieFoodId = value;
        this._food.getFoodId(this.movieFoodId).subscribe({
          next: (data_food) => {
            this.fileImageProduct = data_food.food_img
            this.setValueFood(data_food)
            this.dataFood = data_food;
            this._loader.hide()
          }, error: (error) => {
            this._loader.hide()
          }
        })
      } else {
        this.route.navigateByUrl('administration/food').then();
        this._alert.warning('Ocurrio un error al momento de obtener los datos de la comida para editarlos, reintenta mas tarde')
        this._loader.hide();
      }
    })
  }

  setValueFood(data: any): void {
    this.formFood.get('food_name')?.setValue(data.food_name);
    this.formFood.get('food_price')?.setValue(data.food_price);
    this.formFood.get('food_description')?.setValue(data.food_description);
    this.formFood.get('food_stock')?.setValue(data.food_stock);
  }

  uploadImage(event: any): void {
    const capturedFile = event.target.files[0];
    const supportedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    const fileType = capturedFile.type;
    if (supportedTypes.includes(fileType)) {
      const fileName = capturedFile.name;
      this._image.compressImage(capturedFile, 0.10).then(compressedResult => {
        this.fileImageProduct = compressedResult;
        this.fileNameProduct = fileName;
        this._alert.success('Imagen subida correctamente');
      });
    } else {
      this._alert.warning('Solo se admiten archivos PNG, JPEG, JPG o WEBP.');
    }
  }

  changeTypeFood(_event: any): void {
    this._select.getVariantFood(_event.value).subscribe({
      next: (data: Select[]) => {
        this.dataVariantFood = data;
      }
    })
  }

  sendFormUpdateFood(): void {
    this._loader.show();
    const dataFood: any = {
      food_name: this.formFood.get('')?.value,
      food_description: this.formFood.get('')?.value,
      food_price: this.formFood.get('')?.value,
      food_img: this.fileImageProduct,
      food_stock: this.formFood.get('')?.value,
    }
    console.log(dataFood)
  }

}
