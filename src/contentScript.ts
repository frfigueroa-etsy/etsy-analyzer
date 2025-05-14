declare const __API_URL__: string;



function waitForElement(selector:any, callback:any) {
  const observer = new MutationObserver((_, observer) => {
    const element = document.querySelector(selector);
    if (element) {
      observer.disconnect();
      callback(element);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

waitForElement('[data-add-to-cart-button]', (addToCartDiv:any) => {
  console.log("Add to cart section detected!");

  // 🔍 Create Analyze SEO Button
  const analyzeButton = document.createElement('button');
  analyzeButton.innerText = '🔍 Analyze SEO';
  analyzeButton.style.marginTop = '10px';
  analyzeButton.style.width = '100%';
  analyzeButton.style.padding = '10px';
  analyzeButton.style.backgroundColor = '#ff9900';
  analyzeButton.style.color = 'white';
  analyzeButton.style.border = 'none';
  analyzeButton.style.borderRadius = '5px';
  analyzeButton.style.cursor = 'pointer';
  analyzeButton.style.fontSize = '16px';
  addToCartDiv.appendChild(analyzeButton);

  // Section to display analysis
  const analysisSection = document.createElement('div');
  analysisSection.style.marginTop = '15px';
  analysisSection.style.padding = '10px';
  analysisSection.style.backgroundColor = '#f8f8f8';
  analysisSection.style.border = '1px solid #ccc';
  analysisSection.style.display = 'none';
  addToCartDiv.appendChild(analysisSection);

  analyzeButton.addEventListener('click', async () => {
    analyzeButton.disabled = true;
    analyzeButton.innerText = 'Analyzing...';

    const listingId = window.location.pathname.split('/')[2];

    try {
      const response = await fetch(`${__API_URL__}/ai/analyze-seo-from-listing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ listingId })
      });

      console.log(response)

      const { result } = await response.json();

      console.log(result)

      analysisSection.innerHTML = `
        <h3>SEO Analysis</h3>
         <pre className="mb-0">${result}</pre>
      `;
      analysisSection.style.display = 'block';

    } catch (error) {
      console.error('Error fetching analysis:', error);
      analysisSection.innerHTML = '<p style="color:red;">Error analyzing product.</p>';
      analysisSection.style.display = 'block';
    }

    analyzeButton.disabled = false;
    analyzeButton.innerText = '🔍 Analyze SEO';
  });

  // ➕ Create Add to Benchmark Button
  const addToBenchmarkButton = document.createElement('button');
  addToBenchmarkButton.innerText = '+ Add to Benchmark';
  addToBenchmarkButton.style.marginTop = '5px';
  addToBenchmarkButton.style.width = '100%';
  addToBenchmarkButton.style.padding = '8px';
  addToBenchmarkButton.style.backgroundColor = '#4caf50';
  addToBenchmarkButton.style.color = 'white';
  addToBenchmarkButton.style.border = 'none';
  addToBenchmarkButton.style.borderRadius = '5px';
  addToBenchmarkButton.style.cursor = 'pointer';
  addToBenchmarkButton.style.fontSize = '14px';
  addToCartDiv.appendChild(addToBenchmarkButton);

  addToBenchmarkButton.addEventListener('click', async () => {
    const listingId = window.location.pathname.split('/')[2];

    try {
      const response = await fetch(`${__API_URL__}/etsy/shopListing/analyze-listing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ listingId })
      });

      console.log(response)

      const { result } = await response.json();
      console.log(result)

      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        chrome.storage.local.get(['benchmarkProducts'], (res) => {
          let products:any[] = res.benchmarkProducts || [];
          if (!products.find(p => p.listing_id! === listingId)) {
            products.push(result);

            if (products.length > 5) {
              products = products.slice(products.length - 5);
            }

            chrome.storage.local.set({ benchmarkProducts: products });
          }
        });
      }

      alert('Product added to Benchmark list!');
    } catch (error) {
      console.error('Error adding to benchmark:', error);
    }
  });
});