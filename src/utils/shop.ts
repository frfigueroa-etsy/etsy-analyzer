import { ProductInterface } from '../interfaces';

export async function selectProductShop(product: ProductInterface) {
    console.log(product)
      if (typeof chrome === 'undefined' || !chrome.storage?.local) return;
    
      chrome.storage.local.get(['productShop'], (result) => {
        const shop = result.productShop || null;
    
        // Si ya está agregado, no hacer nada
        if (
            shop.listing_id === product.listing_id 
            && shop.shop_id === product.shop_id ) {
          return;
        }

    
        chrome.storage.local.set({ productShop: shop });
      });
    }