import { ProductReviewInterface } from '../interfaces';

export async function addListingReviewToAnalysis(review: ProductReviewInterface) {
  if (typeof chrome === 'undefined' || !chrome.storage?.local) return;

  chrome.storage.local.get(['reviewAnalysisQueue'], (result) => {
    let queue = result.reviewAnalysisQueue || [];

    const isDuplicate = queue.some(
      (r: ProductReviewInterface) =>
        r.listing_id === review.listing_id &&
        r.created_timestamp === review.created_timestamp
    );

    if (isDuplicate) return;

    queue.push(review);

    if (queue.length > 10) {
      queue = queue.slice(queue.length - 10);
    }

    chrome.storage.local.set({ reviewAnalysisQueue: queue });
  });
}