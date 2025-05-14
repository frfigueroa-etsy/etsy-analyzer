import { ProductInterface } from '../interfaces';
export async function addProductToBenchmark(product: ProductInterface) {
    if (typeof chrome === 'undefined' || !chrome.storage?.local) return;
  
    chrome.storage.local.get(['benchmarkProducts'], (result) => {
      let products = result.benchmarkProducts || [];
  
      // return If is already on the queue 
      if (products.find((p: ProductInterface) => p.listing_id === product.listing_id)) {
        return;
      }
  
      products.push(product);
  
      //  max of 5
      if (products.length > 5) {
        products = products.slice(products.length - 5);
      }
  
      chrome.storage.local.set({ benchmarkProducts: products });
    });
  }