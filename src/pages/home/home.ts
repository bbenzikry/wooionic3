import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Slides, ToastController } from 'ionic-angular';
// import { ProductDetails } from '../product-details/product-details';

import * as WC from 'woocommerce-api';
import { WooCommerceProvider } from '../../providers/woocommerce/woocommerce';
// import { SearchPage } from "../search/search";

@IonicPage({})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  WooCommerce: any;
  products: any[];
  moreProducts: any[];
  page: number;
  searchQuery: string = "";

  @ViewChild('productSlides') productSlides: Slides;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, private woocommerce: WooCommerceProvider) {

    this.page = 2;

    this.WooCommerce = WC({
      url: "http://samarth.southeastasia.cloudapp.azure.com",
      consumerKey: "ck_978c83dd335e861046f05d4b5ae020ff00667044",
      consumerSecret: "cs_f06f888d7d3d9e02a09b4d40624f222af7b12bc9"
    });

    this.loadMoreProducts(null);

    this.WooCommerce.getAsync("products").then( (data) => {
      console.log(JSON.parse(data.body));
      this.products = JSON.parse(data.body).products;
    }, (err) => {
      console.log(err)
    })

  }

  ionViewDidLoad(){
    setInterval(()=> {

      if(this.productSlides.getActiveIndex() == this.productSlides.length() -1)
        this.productSlides.slideTo(0);

      this.productSlides.slideNext();
    }, 3000)
  }

  loadMoreProducts(event){
    console.log(event);
    if(event == null)
    {
      this.page = 2;
      this.moreProducts = [];
    }
    else
      this.page++;

    this.WooCommerce.getAsync("products?page=" + this.page).then( (data) => {
      console.log(JSON.parse(data.body));
      this.moreProducts = this.moreProducts.concat(JSON.parse(data.body).products);

      if(event != null)
      {
        event.complete();
      }

      if(JSON.parse(data.body).products.length < 10){
        event.enable(false);

        this.toastCtrl.create({
          message: "No more products!",
          duration: 5000
        }).present();

      }


    }, (err) => {
      console.log(err)
    })
  }

  openProductPage(product){
    this.navCtrl.push('ProductDetails', {"product": product} );
  }

  onSearch(event){
    if(this.searchQuery.length > 0){
      this.navCtrl.push('SearchPage', {"searchQuery": this.searchQuery});
    }
  }

}
