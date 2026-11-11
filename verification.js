/**
 * Airtel Congo - Verification Required Screen Logic
 * Manages the 3-second countdown and automatic/manual redirection.
 */

document.addEventListener('DOMContentLoaded', () => {
  let secondsRemaining = 3;
  const countdownNumberEl = document.getElementById('countdownNumber');
  const proceedBtn = document.getElementById('proceedBtn');

  function redirectToVerification() {
    window.location.href = 'verify.html';
  }

  // Countdown timer
  const interval = setInterval(() => {
    secondsRemaining -= 1;
    if (countdownNumberEl) {
      countdownNumberEl.textContent = secondsRemaining;
    }

    if (secondsRemaining <= 0) {
      clearInterval(interval);
      redirectToVerification();
    }
  }, 1000);

  // Manual click on Proceed button
  if (proceedBtn) {
    proceedBtn.addEventListener('click', (e) => {
      e.preventDefault();
      clearInterval(interval);
      redirectToVerification();
    });
  }
});
