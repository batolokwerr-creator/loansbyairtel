/**
 * Airtel Congo - Loan Calculator Logic
 * Calculates dynamic monthly loan payments based on amount and term.
 */

document.addEventListener('DOMContentLoaded', () => {
  const amountSlider = document.getElementById('loanAmountSlider');
  const termSlider = document.getElementById('loanTermSlider');
  const amountDisplay = document.getElementById('loanAmountVal');
  const termDisplay = document.getElementById('loanTermVal');
  const monthlyPaymentDisplay = document.getElementById('monthlyPaymentVal');
  const applyBtn = document.getElementById('applyNowBtn');

  if (!amountSlider || !termSlider) return;

  const ANNUAL_INTEREST_RATE = 0.12; // 12% APR

  function updateSliderFill(slider) {
    const min = parseFloat(slider.min) || 0;
    const max = parseFloat(slider.max) || 100;
    const val = parseFloat(slider.value) || 0;
    const percentage = ((val - min) / (max - min)) * 100;
    slider.style.background = `linear-gradient(to right, #E51937 0%, #E51937 ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`;
  }

  function calculateMonthlyPayment(principal, months) {
    if (months <= 0) return 0;
    const monthlyRate = ANNUAL_INTEREST_RATE / 12;
    // Standard amortization formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
    const factor = Math.pow(1 + monthlyRate, months);
    const monthly = (principal * monthlyRate * factor) / (factor - 1);
    return monthly;
  }

  function recalculate() {
    const amount = parseFloat(amountSlider.value);
    const term = parseInt(termSlider.value, 10);

    // Format Amount Display
    amountDisplay.textContent = `$${amount.toLocaleString('en-US')}`;

    // Format Term Display
    termDisplay.textContent = `${term} months`;

    // Calculate Monthly Payment
    const monthly = calculateMonthlyPayment(amount, term);
    monthlyPaymentDisplay.textContent = `$${monthly.toFixed(2)}`;

    // Update tracks
    updateSliderFill(amountSlider);
    updateSliderFill(termSlider);

    // Save to localStorage so apply.html picks it up immediately
    try {
      localStorage.setItem('airtel_loan_amount', amount.toString());
      localStorage.setItem('airtel_loan_term', term.toString());
    } catch (e) {
      // ignore storage failure in strict sandboxes
    }
  }

  // Event Listeners
  amountSlider.addEventListener('input', recalculate);
  termSlider.addEventListener('input', recalculate);

  // Apply Now button click handler
  if (applyBtn) {
    applyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const amount = amountSlider.value;
      const term = termSlider.value;
      window.location.href = `apply.html?amount=${encodeURIComponent(amount)}&term=${encodeURIComponent(term)}`;
    });
  }

  // Initial Calculation
  recalculate();
});
