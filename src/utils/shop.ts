import { ProductInterface } from '../interfaces';

export async function selectProductShop(product: ProductInterface) {
  
    if (typeof chrome === 'undefined' || !chrome.storage?.local) return;
  
    chrome.storage.local.get(['shopId'], (result) => {
      const storedShopId = result.shopId ?? null;
  
      // ✅ Si ya está seleccionado ese shop_id, no hacer nada
      if (storedShopId === product.shop_id) {
        return;
      }
  
      console.log('Saving new shop_id:', product.shop_id);
      chrome.storage.local.set({ shopId: product.shop_id });
    });
  }