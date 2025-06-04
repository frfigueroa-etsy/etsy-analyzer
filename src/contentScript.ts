declare const __API_URL__: string;

function waitForElement(selector: any, callback: any) {
  const observer = new MutationObserver((_, observer) => {
    const element = document.querySelector(selector);
    if (element) {
      observer.disconnect();
      callback(element);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

waitForElement('[data-add-to-cart-button]', (addToCartDiv: any) => {
  console.log("Add to cart section detected!");

  const createStyledButton = (text: string, backgroundColor: string) => {
    const btn = document.createElement('button');
    btn.innerText = text;
    btn.style.marginTop = '6px';
    btn.style.width = '100%';
    btn.style.padding = '10px';
    btn.style.backgroundColor = backgroundColor;
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.borderRadius = '999px';
    btn.style.cursor = 'pointer';
    btn.style.fontSize = '14px';
    btn.style.fontWeight = 'bold';
    return btn;
  };

  // 🔍 Analyze SEO
  const analyzeButton = createStyledButton('🔍 Analyze SEO', '#007bff');
  addToCartDiv.appendChild(analyzeButton);

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId })
      });

      const { result } = await response.json();
      analysisSection.innerHTML = `
        <h3>SEO Analysis</h3>
        <pre>${result}</pre>
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

  // ➕ Add to Benchmark
  const benchmarkBtn = createStyledButton('+ 📊 Add to Benchmark', '#28a745');
  addToCartDiv.appendChild(benchmarkBtn);

  benchmarkBtn.addEventListener('click', async () => {
    const listingId = window.location.pathname.split('/')[2];

    try {
      const response = await fetch(`${__API_URL__}/etsy/shopListing/analyze-listing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId })
      });

      const { result } = await response.json();

      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        chrome.storage.local.get(['benchmarkProducts'], (res) => {
          let products: any[] = res.benchmarkProducts || [];
          if (!products.find(p => p.listing_id === listingId)) {
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

  // 🛍 Add to Shop Analysis (Visual Only)
  const shopAnalysisBtn = createStyledButton('+ 🛍️ Add to Shop Analysis', '#17a2b8');
  addToCartDiv.appendChild(shopAnalysisBtn);

  // 📦 Add to Product Analysis (Visual Only)
  const productAnalysisBtn = createStyledButton('+ 🎁 Add to Product Analysis', '#ffc107');
  addToCartDiv.appendChild(productAnalysisBtn);
});