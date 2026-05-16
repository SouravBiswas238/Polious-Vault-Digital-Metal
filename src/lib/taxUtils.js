/**
 * Indian Digital Gold Taxation Utility (2026 Rules)
 * Based on latest reforms: 3% GST on Buy, 12.5% Flat LTCG (No Indexation), STCG at Slab.
 */

export const calculateBuyBreakdown = (amount) => {
  // If amount is the 'Actual Gold Value', GST is added on top
  const gst = amount * 0.03;
  const total = amount + gst;
  return {
    actualGoldValue: amount,
    gst,
    total,
  };
};

export const calculateSellBreakdown = (buyPrice, sellPrice, purchasedAt, userTaxSlab = 0.3) => {
  const profit = sellPrice - buyPrice;
  const holdingPeriodMonths = getMonthDifference(new Date(purchasedAt), new Date());
  
  let taxAmount = 0;
  let taxType = 'None';
  let taxRateLabel = '0%';

  if (profit > 0) {
    if (holdingPeriodMonths < 24) {
      taxType = 'STCG';
      taxAmount = profit * userTaxSlab; // Taxed as per income slab
      taxRateLabel = `${(userTaxSlab * 100).toFixed(0)}% (Slab)`;
    } else {
      taxType = 'LTCG';
      taxAmount = profit * 0.125; // 2026 Flat Rate (No Indexation)
      taxRateLabel = '12.5% (Flat)';
    }
  }

  const finalAmount = sellPrice - taxAmount;

  return {
    profit,
    holdingPeriodMonths,
    taxType,
    taxRateLabel,
    taxAmount,
    finalAmount,
  };
};

function getMonthDifference(startDate, endDate) {
  const years = endDate.getFullYear() - startDate.getFullYear();
  const months = endDate.getMonth() - startDate.getMonth();
  return years * 12 + months;
}
