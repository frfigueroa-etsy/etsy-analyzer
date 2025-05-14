import { ReviewInterface } from '../interfaces';

export async function addShopReviewToAnalysis(review: ReviewInterface) {
  if (typeof chrome === 'undefined' || !chrome.storage?.local) return;

  chrome.storage.local.get(['reviewShopAnalysisQueue'], (result) => {
    let queue = result.reviewShopAnalysisQueue || [];

    const isDuplicate = queue.some(
      (r: ReviewInterface) =>
        r.listing_id === review.listing_id &&
        r.created_timestamp === review.created_timestamp
    );

    if (isDuplicate) return;

    queue.push(review);

    if (queue.length > 10) {
      queue = queue.slice(queue.length - 10);
    }

    chrome.storage.local.set({ reviewShopAnalysisQueue: queue });
  });
}