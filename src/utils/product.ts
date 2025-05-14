import { ProductInterface } from '../interfaces';

export async function selectProduct(product: ProductInterface) {
  
    if (typeof chrome === 'undefined' || !chrome.storage?.local) return;
  
    chrome.storage.local.get(['listingId'], (result) => {
      const storedlistingId = result.listingId ?? null;
  
      if (storedlistingId === product.listing_id) {
        return;
      }
  
      console.log('Saving new listing_id:', product.listing_id);
      chrome.storage.local.set({ listingId: product.listing_id });
    });
  }