export async function addProductToBenchmark(product: any) {
  console.log(product)
    if (typeof chrome === 'undefined' || !chrome.storage?.local) return;
  
    chrome.storage.local.get(['benchmarkProducts'], (result) => {
      let products = result.benchmarkProducts || [];
  
      // Si ya está agregado, no hacer nada
      if (products.find((p: any) => p.listing_id === product.listing_id)) {
        return;
      }
  
      products.push(product);
  
      // Mantener máximo 5
      if (products.length > 5) {
        products = products.slice(products.length - 5);
      }
  
      chrome.storage.local.set({ benchmarkProducts: products });
    });
  }