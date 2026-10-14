import { DOM, STORAGE_KEY, PROFILES_KEY, state } from './config.js';
import {
  escapeHtml,
  getCurrentYearMonth,
  formatMonth,
  updateRemainingTenureDisplay,
  showToast,
  evaluateCourseResult
} from './utils.js';
import { fetchProfileByRegNo, saveScholarSubmission, fetchScholarSubmissionsAPI } from './api.js';
import { updateDynamicCards } from './dynamicCards.js';
import { viewReport } from './report.js';

/**
 * Configure lock states for bank credentials and supervisor contact.
 * - If already saved: display value, lock (readonly), show lock badge and banner with R&D contact link.
 * - If not yet entered (first-time): make editable, show first-time entry badge, highlight field.
 */
export function applyLockState(existing) {
  // Always lock core master academic profile fields if profile exists
  const masterFields = [
    DOM.portalScholarName,
    DOM.portalGuideName,
    DOM.portalDepartment,
    DOM.portalDateOfJoining,
    DOM.portalScholarContact
  ];

  const hasMasterProfile = Boolean(existing && existing.scholarName);

  masterFields.forEach(field => {
    if (!field) return;
    if (hasMasterProfile) {
      field.setAttribute('readonly', 'true');
      field.classList.add('input-locked');
    } else {
      field.removeAttribute('readonly');
      field.classList.remove('input-locked');
    }
  });

  if (DOM.portalRAType) {
    if (hasMasterProfile) {
      DOM.portalRAType.setAttribute('disabled', 'true');
      DOM.portalRAType.classList.add('input-locked');
    } else {
      DOM.portalRAType.removeAttribute('disabled');
      DOM.portalRAType.classList.remove('input-locked');
    }
  }

  // Check supervisor contact (sensitive field)
  const checkField = (inputEl, badgeEl, val, placeholderText) => {
    if (!inputEl) return false;
    const isPresent = Boolean(val && String(val).trim() !== '');
    if (isPresent) {
      inputEl.value = val;
      inputEl.setAttribute('readonly', 'true');
      inputEl.classList.add('input-locked');
      inputEl.classList.remove('input-first-time');
      if (badgeEl) {
        badgeEl.className = 'badge-lock-status locked';
        badgeEl.innerHTML = '🔒 Locked';
        badgeEl.title = 'Permanently locked. Contact R&D Office to edit.';
      }
      return true;
    } else {
      inputEl.value = inputEl.value || '';
      inputEl.removeAttribute('readonly');
      inputEl.classList.add('input-first-time');
      inputEl.classList.remove('input-locked');
      if (placeholderText) inputEl.placeholder = placeholderText;
      if (badgeEl) {
        badgeEl.className = 'badge-lock-status editable-once';
        badgeEl.innerHTML = '✏️ Enter Once';
        badgeEl.title = 'Editable on first submission. Will lock after submitting.';
      }
      return false;
    }
  };

  const hasSupContact = checkField(DOM.portalSupervisorContact, DOM.badgeSupervisorContact, existing?.supervisorContact, 'e.g. +91 94480 55120 (First-time entry)');

  if (DOM.portalLockStatusNotice) {
    if (hasSupContact) {
      DOM.portalLockStatusNotice.style.display = 'flex';
      DOM.portalLockStatusNotice.className = 'portal-lock-notice locked';
      DOM.portalLockStatusNotice.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" style="flex-shrink: 0; margin-top: 2px;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        <div>
          <strong style="color: #0f172a;">Scholar Profile & Supervisor Contact Locked:</strong>
          <span> Scholar Profile and Supervisor Contact are locked. To request any edits or updates, please <a href="javascript:void(0)" class="link-open-rnd" style="color: var(--primary); font-weight: 700; text-decoration: underline;">contact the R&D Office</a>.</span>
        </div>
      `;
      if (DOM.btnContactRndText) DOM.btnContactRndText.textContent = '🔒 Locked (Contact R&D to Edit)';
    } else {
      DOM.portalLockStatusNotice.style.display = 'flex';
      DOM.portalLockStatusNotice.className = 'portal-lock-notice editable';
      DOM.portalLockStatusNotice.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" style="flex-shrink: 0; margin-top: 2px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <div>
          <strong style="color: #78350f;">First-Time Entry Required:</strong>
          <span> Please fill in your Supervisor Contact Number. Once submitted, it will be permanently saved and locked for all future months.</span>
        </div>
      `;
      if (DOM.btnContactRndText) DOM.btnContactRndText.textContent = '✏️ First-Time Entry Active';
    }
  }
}

export async function handleRegNoLookup(regNo) {
  const clean = (regNo || '').trim().toUpperCase();

  if (!clean) {
    if (DOM.portalFormBody) DOM.portalFormBody.style.display = 'none';
    if (DOM.portalLookupBanner) DOM.portalLookupBanner.className = 'portal-lookup-banner prompt';
    if (DOM.portalLookupBannerText) DOM.portalLookupBannerText.innerHTML = 'Enter official Registration Number (e.g. 251PT01001) above to load your details.';
    return;
  }

  // Check via Node.js API / local cache
  const existing = await fetchProfileByRegNo(clean);

  if (existing) {
    // EXISTING SCHOLAR: Automatically load permanent data
    if (DOM.portalScholarName) DOM.portalScholarName.value = existing.scholarName || '';
    if (DOM.portalGuideName) DOM.portalGuideName.value = existing.guideName || '';
    if (DOM.portalDepartment) DOM.portalDepartment.value = existing.department || '';
    if (DOM.portalRAType) {
      const val = (existing.raType || '').trim();
      if (val === 'Academic' || val === 'TRA' || val === 'CAP') {
        DOM.portalRAType.value = 'Academic';
      } else {
        DOM.portalRAType.value = 'Industry';
      }
    }
    if (DOM.portalDateOfJoining) DOM.portalDateOfJoining.value = existing.dateOfJoining || '';
    if (DOM.portalEndOfRA && existing.endOfRA) DOM.portalEndOfRA.value = existing.endOfRA;
    if (DOM.portalRemainingTenureText && existing.endOfRA) {
      updateRemainingTenureDisplay(DOM.portalRemainingTenureText, existing.endOfRA);
    }
    if (DOM.portalScholarContact) DOM.portalScholarContact.value = existing.scholarContact || '';

    // Apply specific locking on supervisor contact
    applyLockState(existing);

    const numCourses = existing.coursesCompleted || (existing.courseDetails ? existing.courseDetails.length : 0);
    if (DOM.portalCoursesCompleted) DOM.portalCoursesCompleted.value = numCourses;
    if (DOM.portalCoursesContainer) {
      if (existing.courseDetails && existing.courseDetails.length > 0) {
        updateDynamicCards(DOM.portalCoursesContainer, numCourses, 'course', existing.courseDetails);
      } else if (numCourses > 0) {
        updateDynamicCards(DOM.portalCoursesContainer, numCourses, 'course');
      } else {
        DOM.portalCoursesContainer.innerHTML = '';
      }
    }

    // Automatic current month
    if (DOM.portalCurrentMonth) DOM.portalCurrentMonth.value = getCurrentYearMonth();

    if (DOM.portalStaticCardHeading) DOM.portalStaticCardHeading.textContent = 'Permanent Scholar Record (Auto-loaded)';

    if (DOM.portalLookupBanner) DOM.portalLookupBanner.className = 'portal-lookup-banner found';
    if (DOM.portalLookupBannerText) DOM.portalLookupBannerText.innerHTML = `<strong>✓ Profile Found:</strong> Welcome back, <strong>${escapeHtml(existing.scholarName)}</strong> (${escapeHtml(existing.department)}, <strong>${escapeHtml(existing.raType || 'ERA')}</strong> - Reg No: <strong>${escapeHtml(clean)}</strong>). Your permanent details have been loaded.`;

    if (DOM.portalFormBody) DOM.portalFormBody.style.display = 'block';
  } else {
    // NEW SCHOLAR: Prompt to enter details once
    applyLockState(null);
    if (DOM.portalStaticCardHeading) DOM.portalStaticCardHeading.textContent = 'New Scholar Profile (Fill once to save)';

    if (DOM.portalCurrentMonth) DOM.portalCurrentMonth.value = getCurrentYearMonth();
    updateRemainingTenureDisplay(DOM.portalRemainingTenureText, '');
    if (DOM.portalCoursesCompleted) DOM.portalCoursesCompleted.value = 0;
    if (DOM.portalCoursesContainer) DOM.portalCoursesContainer.innerHTML = '';

    if (DOM.portalLookupBanner) DOM.portalLookupBanner.className = 'portal-lookup-banner new';
    if (DOM.portalLookupBannerText) DOM.portalLookupBannerText.innerHTML = `<strong>ℹ New Registration No:</strong> No previous record found for <strong>${escapeHtml(clean)}</strong>. Please fill your profile details below once — they will be saved automatically for future monthly reports.`;

    if (DOM.portalFormBody) DOM.portalFormBody.style.display = 'block';
  }
}

export function setPortalStaticFieldsReadOnly(readOnly) {
  // Maintained for backward compatibility
  if (!readOnly) {
    showToast('Profile and bank credentials can only be edited by the R&D Office.', 'info');
  }
}

export function resetPortalForm() {
  if (DOM.portalFormBody) DOM.portalFormBody.style.display = 'none';
  if (DOM.portalLookupBanner) DOM.portalLookupBanner.className = 'portal-lookup-banner prompt';
  if (DOM.portalLookupBannerText) DOM.portalLookupBannerText.innerHTML = 'Enter your Registration Number above to load or register your details.';
  applyLockState(null);
  if (DOM.portalLockStatusNotice) DOM.portalLockStatusNotice.style.display = 'none';
  if (DOM.portalCoursesContainer) DOM.portalCoursesContainer.innerHTML = '';
  if (DOM.portalJournalContainer) DOM.portalJournalContainer.innerHTML = '';
  if (DOM.portalConferenceContainer) DOM.portalConferenceContainer.innerHTML = '';
  if (DOM.portalFdpContainer) DOM.portalFdpContainer.innerHTML = '';
  if (DOM.portalDcCount) DOM.portalDcCount.value = 0;
  if (DOM.portalDcContainer) DOM.portalDcContainer.innerHTML = '';
  updateRemainingTenureDisplay(DOM.portalRemainingTenureText, '');
  if (DOM.portalCurrentMonth) DOM.portalCurrentMonth.value = getCurrentYearMonth();
}

export async function handlePortalFormSubmit(e) {
  e.preventDefault();

  const courseDetails = [];
  DOM.portalCoursesContainer.querySelectorAll('.dynamic-card').forEach(card => {
    const name = card.querySelector('.course-name-input')?.value.trim();
    if (name) {
      const courseType = card.querySelector('.course-type-input')?.value || 'Internal';
      const cgpa = card.querySelector('.course-cgpa-input')?.value.trim() || '';
      const evalRes = evaluateCourseResult(courseType, cgpa);
      const result = evalRes.text;
      courseDetails.push({
        courseCode: '',
        courseType: courseType,
        courseName: name,
        credits: card.querySelector('.course-credits-input')?.value.trim() || '',
        formativeMarks: card.querySelector('.course-formative-input')?.value.trim() || '',
        summativeMarks: card.querySelector('.course-summative-input')?.value.trim() || '',
        cgpa: cgpa,
        result: result,
        grade: cgpa ? `${cgpa} (${result})` : '',
        completionDate: card.querySelector('.course-date-input')?.value || null
      });
    }
  });

  const journalPapers = [];
  DOM.portalJournalContainer.querySelectorAll('.dynamic-card').forEach(card => {
    const name = card.querySelector('.journal-name-input')?.value.trim();
    if (name) {
      journalPapers.push({
        title: card.querySelector('.journal-title-input')?.value.trim() || 'Untitled Paper',
        journalName: name,
        status: card.querySelector('.journal-status-input')?.value || 'Communicated',
        statusDate: card.querySelector('.journal-date-input')?.value || null
      });
    }
  });

  const conferencePapers = [];
  DOM.portalConferenceContainer.querySelectorAll('.dynamic-card').forEach(card => {
    const name = card.querySelector('.conf-name-input')?.value.trim();
    if (name) {
      conferencePapers.push({
        title: card.querySelector('.conf-title-input')?.value.trim() || 'Untitled Paper',
        conferenceName: name,
        status: card.querySelector('.conf-status-input')?.value || 'Communicated',
        statusDate: card.querySelector('.conf-date-input')?.value || null
      });
    }
  });

  const events = [];
  DOM.portalFdpContainer.querySelectorAll('.dynamic-card').forEach(card => {
    const name = card.querySelector('.event-name-input, .fdp-name-input')?.value.trim();
    if (name) {
      events.push({
        name: name,
        category: card.querySelector('.event-category-input')?.value || 'Workshop',
        organizer: card.querySelector('.event-org-input, .fdp-org-input')?.value.trim() || '',
        eventDate: card.querySelector('.event-date-input')?.value || null
      });
    }
  });

  const dcMeetings = [];
  if (DOM.portalDcContainer) {
    DOM.portalDcContainer.querySelectorAll('.dynamic-card').forEach(card => {
      const dcName = card.querySelector('.dc-name-input')?.value.trim();
      const lastDcDate = card.querySelector('.dc-date-input')?.value || null;
      const regulation = card.querySelector('.dc-regulation-input')?.value || 'R22';
      const rating = card.querySelector('.dc-rating-input')?.value || '';
      const recommendations = card.querySelector('.dc-recommendations-input')?.value || 'Pre-synopsis';
      const comments = card.querySelector('.dc-comments-input')?.value.trim() || '';

      if (dcName || lastDcDate || comments) {
        dcMeetings.push({
          dcName: dcName || 'DC Meeting',
          lastDcDate,
          regulation,
          rating,
          recommendations,
          comments
        });
      }
    });
  }

  const regNo = DOM.portalRegNo ? DOM.portalRegNo.value.trim() : '';
  const scholarName = DOM.portalScholarName ? DOM.portalScholarName.value.trim() : '';
  const guideName = DOM.portalGuideName ? DOM.portalGuideName.value.trim() : '';
  const department = DOM.portalDepartment ? DOM.portalDepartment.value.trim() : '';
  const raType = DOM.portalRAType ? DOM.portalRAType.value : 'Industry';
  const dateOfJoining = DOM.portalDateOfJoining ? DOM.portalDateOfJoining.value : '';
  const scholarContact = DOM.portalScholarContact ? DOM.portalScholarContact.value.trim() : '';
  const supervisorContact = DOM.portalSupervisorContact ? DOM.portalSupervisorContact.value.trim() : '';
  const currentMonth = DOM.portalCurrentMonth?.value || getCurrentYearMonth();
  const cleanRegNo = regNo.trim().toUpperCase();

  // 0. Client-side duplicate submission prevention
  const existingSub = state.scholars.find(s => 
    s.regNo && String(s.regNo).trim().toUpperCase() === cleanRegNo && s.currentMonth === currentMonth
  );
  if (existingSub) {
    showToast(`You have already submitted a progress report for ${formatMonth(currentMonth)}. Duplicate entries are not permitted.`, 'error');
    checkExistingSubmissionForMonth(state.scholars, cleanRegNo);
    return;
  }

  if (!supervisorContact) {
    showToast('Please provide Supervisor Contact Number.', 'warning');
    if (DOM.portalSupervisorContact) DOM.portalSupervisorContact.focus();
    return;
  }

  const payload = {
    id: 'rec_pt_' + Date.now(),
    regNo,
    scholarName,
    guideName,
    department,
    raType: raType || 'Industry',
    bankName: '',
    bankAccountNo: '',
    ifscCode: '',
    dateOfJoining,
    endOfRA: null,
    scholarContact,
    supervisorContact,
    currentMonth,
    forgetThumbs: 0,
    coursesCompleted: DOM.portalCoursesCompleted ? (parseInt(DOM.portalCoursesCompleted.value, 10) || courseDetails.length) : courseDetails.length,
    courseDetails: courseDetails,
    leavesTaken: 0,
    avgSpentStayed: '',
    academicLoad: '',
    journalPapers: journalPapers,
    conferencePapers: conferencePapers,
    events: events,
    fdps: events, // Backward compatibility
    dcMeetings: dcMeetings
  };

  // Submit to Node.js Backend / Local fallback
  const saved = await saveScholarSubmission(payload, false);
  if (saved && saved.error) {
    showToast(saved.message || 'Duplicate submission detected. Only one submission per month is permitted.', 'error');
    if (saved.code === 'DUPLICATE_SUBMISSION') {
      await updateScholarHistory(cleanRegNo);
    }
    return;
  }
  if (saved && saved.id) payload.id = saved.id;
  if (saved && saved.createdAt) payload.createdAt = saved.createdAt;

  // Update local memory & storage
  state.masterProfiles[regNo.toLowerCase().trim()] = {
    regNo,
    scholarName,
    guideName,
    department,
    raType: payload.raType,
    bankName: '',
    bankAccountNo: '',
    ifscCode: '',
    dateOfJoining,
    endOfRA: null,
    scholarContact,
    supervisorContact,
    coursesCompleted: payload.coursesCompleted,
    courseDetails: courseDetails
  };

  state.scholars.unshift(payload);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.scholars));
  localStorage.setItem(PROFILES_KEY, JSON.stringify(state.masterProfiles));

  showToast(`Monthly report submitted successfully for ${formatMonth(payload.currentMonth)}!`);

  // Refresh scholar history and duplicate indicator
  await updateScholarHistory(cleanRegNo);

  viewReport(payload.id);
  DOM.publicScholarForm.reset();
  resetPortalForm();
}

/**
 * Check if the scholar has already submitted a report for the current month
 */
export function checkExistingSubmissionForMonth(submissions, regNo) {
  const currentMonth = DOM.portalCurrentMonth?.value || getCurrentYearMonth();
  const cleanReg = String(regNo || '').trim().toUpperCase();
  const subList = Array.isArray(submissions) ? submissions : (
    state.scholars.filter(s => s.regNo && String(s.regNo).trim().toUpperCase() === cleanReg)
  );

  const existing = subList.find(s => s.currentMonth === currentMonth);
  const submitBtn = DOM.btnSubmitPortal || document.getElementById('btnSubmitPortal') || document.querySelector('#publicScholarForm button[type="submit"]');

  if (existing) {
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.65';
      submitBtn.style.cursor = 'not-allowed';
      if (!submitBtn.dataset.originalText) {
        submitBtn.dataset.originalText = submitBtn.innerHTML;
      }
      submitBtn.innerHTML = `<span>🔒 Already Submitted for ${formatMonth(currentMonth)} (View in History)</span>`;
    }
  } else {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      submitBtn.style.cursor = 'pointer';
      if (submitBtn.dataset.originalText) {
        submitBtn.innerHTML = submitBtn.dataset.originalText;
      }
    }
  }
}

/**
 * Render submission history list items with month name and view eye icon
 */
export function renderScholarHistoryList(submissions, regNo) {
  if (!DOM.scholarHistoryList) return;

  const list = Array.isArray(submissions) ? submissions : [];

  if (DOM.scholarHistorySubtitle) {
    const profile = state.masterProfiles[(regNo || '').toLowerCase().trim()];
    const name = profile?.scholarName || DOM.portalScholarName?.value || regNo;
    const dept = profile?.department || DOM.portalDepartment?.value || '';
    DOM.scholarHistorySubtitle.textContent = `Scholar: ${name} (${regNo})${dept ? ' • ' + dept : ''}`;
  }

  if (list.length === 0) {
    if (DOM.scholarHistoryEmpty) DOM.scholarHistoryEmpty.style.display = 'block';
    DOM.scholarHistoryList.innerHTML = '';
    return;
  }

  if (DOM.scholarHistoryEmpty) DOM.scholarHistoryEmpty.style.display = 'none';

  DOM.scholarHistoryList.innerHTML = list.map(sub => `
    <div class="scholar-history-item">
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="width: 40px; height: 40px; border-radius: 10px; background: #eff6ff; color: #1e40af; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; flex-shrink: 0; border: 1.5px solid #bfdbfe;">
          📅
        </div>
        <div>
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <strong style="font-size: 1rem; color: #0f172a;">${formatMonth(sub.currentMonth)}</strong>
            <span style="background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; padding: 1px 7px; border-radius: 12px; font-size: 0.72rem; font-weight: 700;">✓ Submitted</span>
          </div>
        </div>
      </div>
      <div>
        <button type="button" class="btn-view-report btn-history-view-report" data-id="${escapeHtml(sub.id)}" title="View & Print Official Monthly Progress Report">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          <span>View Report</span>
        </button>
      </div>
    </div>
  `).join('');

  DOM.scholarHistoryList.querySelectorAll('.btn-history-view-report').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      if (id) {
        closeScholarHistoryModal();
        viewReport(id);
      }
    });
  });
}

/**
 * Fetch and update scholar history records from backend/state
 */
export async function updateScholarHistory(regNo) {
  const clean = (regNo || '').trim().toUpperCase();
  if (!clean) return [];

  const submissions = await fetchScholarSubmissionsAPI(clean);

  if (DOM.scholarHistoryBadge) {
    DOM.scholarHistoryBadge.textContent = submissions.length;
  }

  renderScholarHistoryList(submissions, clean);
  checkExistingSubmissionForMonth(submissions, clean);

  return submissions;
}

export function openScholarHistoryModal() {
  if (DOM.scholarHistoryModal) {
    DOM.scholarHistoryModal.classList.add('active');
  }
}

export function closeScholarHistoryModal() {
  if (DOM.scholarHistoryModal) {
    DOM.scholarHistoryModal.classList.remove('active');
  }
}

export function showScholarVerifiedBanner(regNo, scholarName, dept, mobile) {
  if (DOM.bannerScholarName) DOM.bannerScholarName.textContent = scholarName || 'Research Scholar';
  if (DOM.bannerScholarRegNo) DOM.bannerScholarRegNo.textContent = regNo;
  if (DOM.bannerScholarDept) DOM.bannerScholarDept.textContent = dept || '-';
  if (DOM.bannerScholarMobile) DOM.bannerScholarMobile.textContent = mobile ? `+91 ${mobile}` : '-';
  if (DOM.scholarVerifiedBanner) DOM.scholarVerifiedBanner.style.display = 'block';

  const lookupCard = DOM.scholarLookupCard || document.getElementById('scholarLookupCard') || DOM.scholarRegGatekeeper || document.getElementById('scholarRegGatekeeper');
  if (lookupCard) lookupCard.style.display = 'none';
  if (DOM.portalFormBody) DOM.portalFormBody.style.display = 'block';
}

export function clearScholarSession() {
  sessionStorage.removeItem('part_time_phd_scholar_session');
  localStorage.removeItem('part_time_phd_last_reg');

  if (DOM.scholarVerifiedBanner) DOM.scholarVerifiedBanner.style.display = 'none';
  if (DOM.portalFormBody) DOM.portalFormBody.style.display = 'none';
  if (DOM.scholarHistoryBadge) DOM.scholarHistoryBadge.textContent = '0';
  closeScholarHistoryModal();

  const lookupCard = DOM.scholarLookupCard || document.getElementById('scholarLookupCard') || DOM.scholarRegGatekeeper || document.getElementById('scholarRegGatekeeper');
  if (lookupCard) lookupCard.style.display = 'block';

  const regInput = DOM.portalRegNo || document.getElementById('portalRegNo');
  if (regInput) {
    regInput.value = '';
    regInput.focus();
  }

  const msgBox = DOM.scholarRegLookupMsg || document.getElementById('scholarRegLookupMsg');
  if (msgBox) {
    msgBox.style.display = 'none';
    msgBox.innerHTML = '';
  }

  if (DOM.publicScholarForm) DOM.publicScholarForm.reset();
  resetPortalForm();
}

/**
 * Direct Registration Number Lookup initialization (Zero OTP / Direct Access)
 */
export function initScholarLookup() {
  const regInput = DOM.portalRegNo || document.getElementById('portalRegNo');
  const btnLookup = DOM.btnLookupScholarReg || document.getElementById('btnLookupScholarReg');
  const msgBox = DOM.scholarRegLookupMsg || document.getElementById('scholarRegLookupMsg');

  async function performLookup(targetReg) {
    const rawReg = targetReg !== undefined ? targetReg : (regInput?.value || '');
    const cleanReg = String(rawReg).trim().toUpperCase();

    if (msgBox) {
      msgBox.style.display = 'none';
      msgBox.innerHTML = '';
    }

    if (!cleanReg) {
      if (msgBox) {
        msgBox.style.display = 'block';
        msgBox.style.background = '#fef2f2';
        msgBox.style.border = '1px solid #f87171';
        msgBox.style.color = '#b91c1c';
        msgBox.innerHTML = '⚠️ Please enter your official Part-Time Ph.D. Registration Number.';
      }
      if (regInput) regInput.focus();
      return;
    }

    if (regInput) regInput.value = cleanReg;

    if (btnLookup) {
      btnLookup.disabled = true;
      btnLookup.innerHTML = '<span>Loading... ⏳</span>';
    }

    try {
      await handleRegNoLookup(cleanReg);
      const profile = await fetchProfileByRegNo(cleanReg) || {};
      const scholarName = profile.scholarName || DOM.portalScholarName?.value || cleanReg;
      const dept = profile.department || DOM.portalDepartment?.value || '';
      const mobile = profile.scholarContact || DOM.portalScholarContact?.value || '';

      sessionStorage.setItem('part_time_phd_scholar_session', JSON.stringify({
        regNo: cleanReg,
        scholarName,
        dept,
        mobile
      }));
      localStorage.setItem('part_time_phd_last_reg', cleanReg);

      showScholarVerifiedBanner(cleanReg, scholarName, dept, mobile);
      await updateScholarHistory(cleanReg);
      checkExistingSubmissionForMonth(null, cleanReg);
      showToast(`Loaded details for ${scholarName} (${cleanReg})`, 'success');
    } catch (err) {
      console.error(err);
      if (msgBox) {
        msgBox.style.display = 'block';
        msgBox.style.background = '#fef2f2';
        msgBox.style.border = '1px solid #f87171';
        msgBox.style.color = '#b91c1c';
        msgBox.innerHTML = `❌ ${escapeHtml(err.message || 'Failed to load scholar details.')}`;
      }
    } finally {
      if (btnLookup) {
        btnLookup.disabled = false;
        btnLookup.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg><span>Load Details</span>`;
      }
    }
  }

  if (btnLookup) {
    btnLookup.addEventListener('click', (e) => {
      e.preventDefault();
      performLookup();
    });
  }

  if (regInput) {
    regInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        performLookup();
      }
    });
  }

  // Quick test chips
  document.querySelectorAll('.sample-reg-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const reg = chip.getAttribute('data-reg');
      if (reg) {
        performLookup(reg);
      }
    });
  });

  // Switch scholar / change registration number
  const btnLogout = DOM.btnScholarLogout || document.getElementById('btnScholarLogout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      clearScholarSession();
    });
  }

  // Scholar submission history modal triggers
  const btnHistory = DOM.btnScholarHistory || document.getElementById('btnScholarHistory');
  if (btnHistory) {
    btnHistory.addEventListener('click', () => {
      openScholarHistoryModal();
    });
  }

  const btnCloseHist = DOM.btnCloseScholarHistory || document.getElementById('btnCloseScholarHistory');
  if (btnCloseHist) {
    btnCloseHist.addEventListener('click', closeScholarHistoryModal);
  }

  const btnCloseHistFooter = DOM.btnCloseScholarHistoryFooter || document.getElementById('btnCloseScholarHistoryFooter');
  if (btnCloseHistFooter) {
    btnCloseHistFooter.addEventListener('click', closeScholarHistoryModal);
  }

  const histModal = DOM.scholarHistoryModal || document.getElementById('scholarHistoryModal');
  if (histModal) {
    histModal.addEventListener('click', (e) => {
      if (e.target === histModal) closeScholarHistoryModal();
    });
  }

  // Month change listener
  if (DOM.portalCurrentMonth) {
    DOM.portalCurrentMonth.addEventListener('change', () => {
      const activeReg = DOM.bannerScholarRegNo?.textContent || regInput?.value || '';
      if (activeReg && activeReg !== '-') {
        checkExistingSubmissionForMonth(null, activeReg);
      }
    });
  }

  // Restore authenticated/saved session if present
  try {
    const raw = sessionStorage.getItem('part_time_phd_scholar_session');
    let regToRestore = null;
    if (raw) {
      const session = JSON.parse(raw);
      if (session && session.regNo) regToRestore = session.regNo;
    }
    if (!regToRestore) {
      regToRestore = localStorage.getItem('part_time_phd_last_reg');
    }
    if (regToRestore) {
      if (regInput) regInput.value = regToRestore;
      performLookup(regToRestore);
    }
  } catch (e) {
    console.warn('Failed to restore scholar session:', e);
  }
}

// Backward-compatible alias
export const initScholarAuth = initScholarLookup;
