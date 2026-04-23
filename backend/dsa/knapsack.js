/**
 * 0/1 Knapsack (Dynamic Programming) — Pure JavaScript
 * Used in: Recommend best medicine combination within student's budget
 * Complexity: O(n·W)
 */
function knapsack(items, budget) {
  const n = items.length;
  const W = Math.floor(budget);
  const dp = Array.from({ length: n+1 }, () => new Array(W+1).fill(0));

  for (let i = 1; i <= n; i++) {
    const wt = Math.floor(items[i-1].price);
    const val = items[i-1].benefit;
    for (let w = 0; w <= W; w++) {
      if (wt <= w) dp[i][w] = Math.max(dp[i-1][w], dp[i-1][w-wt] + val);
      else dp[i][w] = dp[i-1][w];
    }
  }

  // backtrack
  const chosen = [];
  let w = W;
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i-1][w]) {
      chosen.push(items[i-1]);
      w -= Math.floor(items[i-1].price);
    }
  }
  return { maxBenefit: dp[n][W], chosen: chosen.reverse(), spent: W - w };
}
module.exports = { knapsack };
