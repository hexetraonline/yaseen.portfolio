(() => {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const projects = window.PORTFOLIO?.projects || [];
  const dossiers = window.PORTFOLIO?.dossiers || {};
  const create = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };
  const storage = {
    get(type, key) { try { return window[type].getItem(key); } catch { return null; } },
    set(type, key, value) { try { window[type].setItem(key, value); } catch { /* Browsing works with storage disabled. */ } }
  };
  const normalize = (text) => String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const matches = (query, text) => normalize(query).split(/\s+/).every(word => normalize(text).includes(word));
  const statusClass = status => status.toLowerCase().replace(/\s+/g, '-');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let motionEnabled = !reducedMotion.matches && storage.get('localStorage', 'ysec-motion') !== 'off';

  // Native dialogs provide focus containment, Escape handling, and inert backgrounds.
  const returnTargets = new WeakMap();
  function showDialog(dialog, trigger = document.activeElement) {
    if (dialog.open) return;
    returnTargets.set(dialog, trigger);
    dialog.showModal();
    document.body.classList.add('dialog-open');
  }
  function closeDialog(dialog) { if (dialog.open) dialog.close(); }
  $$('dialog').forEach(dialog => {
    dialog.addEventListener('close', () => {
      if (!$('dialog[open]')) {
        document.body.classList.remove('dialog-open');
        const target = returnTargets.get(dialog);
        if (target?.isConnected && !target.closest('dialog:not([open])')) target.focus({ preventScroll: true });
      }
    });
    dialog.addEventListener('click', event => {
      if (dialog.id === 'boot-dialog' || event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog(dialog);
    });
  });
  $$('[data-close-dialog]').forEach(button => button.addEventListener('click', () => closeDialog(document.getElementById(button.dataset.closeDialog))));

  // A brief, visual boot sequence. It never executes visitor-supplied code.
  const boot = $('#boot-dialog');
  let bootTimers = [];
  let bootReturnHome = false;
  function finishIntro() {
    bootTimers.forEach(clearTimeout);
    bootTimers = [];
    storage.set('sessionStorage', 'ysec-intro-seen', '1');
    closeDialog(boot);
    if (bootReturnHome) {
      bootReturnHome = false;
      location.hash = '#home';
      $('#home').scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  }
  function startIntro(replay = false) {
    if (reducedMotion.matches || !motionEnabled) return;
    bootReturnHome = replay;
    $$('[data-boot-line]').forEach(line => line.classList.remove('visible'));
    $('#boot-progress-bar').style.width = '0%';
    $('#boot-status').textContent = 'Getting things ready…';
    showDialog(boot, $('.hero-actions a'));
    // An independent upper bound ensures the intro cannot hold the page open.
    bootTimers.push(setTimeout(finishIntro, 4200));
    [160, 540, 920, 1320].forEach((delay, index) => {
      bootTimers.push(setTimeout(() => {
        $(`[data-boot-line="${index}"]`).classList.add('visible');
        $('#boot-progress-bar').style.width = `${(index + 1) * 25}%`;
        if (index === 3) $('#boot-status').textContent = 'Ready. Let’s explore.';
      }, delay));
    });
    bootTimers.push(setTimeout(finishIntro, 2300));
  }
  $('#skip-intro').addEventListener('click', finishIntro);
  boot.addEventListener('cancel', event => { event.preventDefault(); finishIntro(); });
  $('#replay-intro').addEventListener('click', () => {
    if (!reducedMotion.matches && !motionEnabled) { motionEnabled = true; syncMotion(); }
    startIntro(true);
  });
  if (!storage.get('sessionStorage', 'ysec-intro-seen') && (!location.hash || location.hash === '#home')) startIntro();

  // One case-study view for every entry; status and planned scope stay explicit.
  const dossierKeys = { 1: 'dc2', 2: 'sysmon', 3: 'rfid', 4: 'akshaya', 5: 'splunk', 10: 'transit' };
  const extras = {
    1: { learning: 'A permitted tool can become a privilege boundary failure. The DC-2 lab helped me connect shell restrictions, sudo permissions, and the behaviour of the Git executable.', note: 'Authorized, intentionally vulnerable lab environment.' },
    2: { learning: 'Individual events tell only part of the story. Connecting process creation, network activity, file changes, and DNS events makes host behaviour easier to investigate.', note: 'Practice dataset: Practice-Sysmon.evtx.' },
    3: { learning: 'A working access-control prototype depends on both software and physical components: authentication logic, wiring, library compatibility, and user feedback.', note: 'Arduino-based educational hardware prototype.' },
    4: { learning: 'This application brings role-based access, booking workflows, and relational data into one service-centre workflow. Development is ongoing.' },
    5: { learning: 'Security monitoring starts with usable telemetry. Configuration and ingestion troubleshooting are part of learning to investigate event data.', note: 'Lab work is in progress.' },
    6: { desc: 'Ongoing practice in authorized CTF and lab environments, focused on Linux enumeration, shells, permissions, and privilege escalation.', points: ['Practice Linux enumeration in deliberately vulnerable environments', 'Investigate shell behaviour and filesystem permissions', 'Study privilege-escalation techniques in an authorized lab context'] },
    7: { desc: 'My digital-services brand, formerly Digi Dreamers, covering web development, brand identity, domain work, and hosting setup.', points: ['Develop the Hexetra Digital Solutions brand and visual identity', 'Work on web development, domains, and hosting for hexetra.online', 'Maintain and troubleshoot business and community web projects'] },
    8: { desc: 'Website maintenance and troubleshooting work for Zella Builders using WordPress and the Kubio builder.', points: ['Maintain the existing WordPress and Kubio website', 'Investigate hosting renewals and domain configuration', 'Troubleshoot site issues and ongoing maintenance tasks'] },
    9: { desc: 'A mobile-friendly community membership collection system with a protected dashboard.', points: ['Build the membership information collection form', 'Account for member photograph requirements', 'Work on a password-protected management dashboard'] },
    10: { learning: 'The prototype covers interface, route/timing lookup, and Firebase connectivity. Google Maps live tracking and passenger notifications are planned extensions.', note: 'Prototype stage; live bus tracking is planned.' },
    11: { desc: 'A web voting prototype exploring QR-based access, online election workflows, and MySQL-backed data.', points: ['Explore the QR-loading and online voting workflow', 'Work with the web application and MySQL database setup', 'Troubleshoot deployment and server environments'], note: 'Prototype exploring election workflows.' },
    12: { desc: 'A campus management project exploring MySQL database administration and local application server setup.', points: ['Investigate the web application and MySQL database structure', 'Practice database administration tasks', 'Troubleshoot local server and deployment environments'] },
    13: { desc: 'Digital support prototypes for Sahithyolsav 2026, covering schedules, event rules, and supporting Malayalam design work.', points: ['Prepare event schedules and competition rules', 'Develop a website prototype for event information', 'Create supporting Malayalam posters'] },
    14: { desc: 'An academic security-assessment plan comparing deliberately vulnerable applications for future lab work.', points: ['Compare bWAPP, VulnBank, and WackoPicko as candidate targets', 'Evaluate vulnerability coverage and a suitable report structure', 'Plan an authorized local assessment environment'] },
    15: { desc: 'A planned arts and Meelad event platform with registration, scoring, and a live scoreboard.', points: ['Plan QR-based registration and event scoring workflows', 'Explore a React and TypeScript interface with a Node.js and Express backend', 'Consider PostgreSQL, JWT authentication, and a live scoreboard'] },
    16: { desc: 'A planned five-stage cybersecurity game for a college lab environment.', points: ['Design Logic Breaker and Code Cracker stages', 'Plan Threat Detector and QR Hunt activities', 'Connect the stages through a Final Vault challenge'] },
    17: { desc: 'A planned programme of practical cybersecurity activities and technical competitions.', points: ['Outline Cyber Heist and Cyber Escape Run activities', 'Plan OSINT Detective and Bug Hunt tracks', 'Adapt the programme to Ubuntu and Windows college lab systems'] },
    18: { desc: 'A planned Android productivity app to organize study, coding, and cybersecurity practice.', points: ['Plan daily study and coding task tracking', 'Include cybersecurity practice in the task workflow', 'Explore local storage for an Android application'] }
  };
  function openProject(id, trigger) {
    const project = projects.find(item => item.id === Number(id));
    if (!project) return;
    const detail = dossiers[dossierKeys[project.id]];
    const extra = extras[project.id] || {};
    $('#case-category').textContent = `${String(project.id).padStart(2, '0')} / ${project.cat}`;
    $('#case-status').textContent = project.status;
    $('#case-status').className = `status ${statusClass(project.status)}`;
    $('#project-dialog-title').textContent = detail?.title || project.name;
    $('#case-description').textContent = extra.desc || detail?.desc || project.stack;
    const tags = detail?.stack || project.stack.split(/[,—]/).map(value => value.trim()).filter(Boolean).slice(0, 6);
    $('#case-tags').replaceChildren(...tags.map(tag => create('span', '', tag)));
    $('#case-approach-title').textContent = project.status === 'Planned' ? 'Planned scope' : 'What I worked on';
    $('#case-points').replaceChildren(...(extra.points || detail?.bullets || [project.stack]).map(point => create('li', '', point)));
    $('#case-learning').hidden = !extra.learning;
    $('#case-learning').replaceChildren(create('strong', '', 'What I’m taking away'), document.createTextNode(extra.learning || ''));
    $('#case-note').textContent = extra.note || (project.status === 'Planned' ? 'Planned concept / future work.' : `Current status: ${project.status.toLowerCase()}.`);
    const dialog = $('#project-dialog');
    showDialog(dialog, trigger);
    dialog.scrollTop = 0;
  }
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-project]');
    if (trigger) openProject(trigger.dataset.project, trigger);
  });

  let selectedStatus = 'active';
  function renderIndex() {
    const query = $('#project-search').value.trim();
    const filtered = projects.filter(project => {
      const statusMatch = selectedStatus === 'all' || (selectedStatus === 'active' ? project.status !== 'Planned' : project.status === selectedStatus);
      return statusMatch && matches(query, `${project.name} ${project.cat} ${project.stack} ${project.status}`);
    });
    $('#index-count').textContent = `Showing ${filtered.length} of ${projects.length} entries${selectedStatus === 'active' ? ' · completed, in progress & prototypes' : ''}`;
    const list = $('#project-list');
    list.replaceChildren();
    if (!filtered.length) {
      const empty = create('div', 'empty-state');
      empty.append(create('strong', '', 'No matching projects.'), create('p', '', 'Try a different tool or topic, or choose All to include planned ideas.'));
      list.append(empty);
      return;
    }
    filtered.forEach(project => {
      const row = create('button', 'index-row');
      row.type = 'button';
      row.dataset.project = project.id;
      row.setAttribute('aria-label', `${project.name}, ${project.status}. View details`);
      row.append(create('span', 'index-number', String(project.id).padStart(2, '0')), create('span', 'index-name', project.name), create('span', 'index-category', project.cat), create('span', `status ${statusClass(project.status)}`, project.status), create('span', 'index-arrow', '↗'));
      row.lastChild.setAttribute('aria-hidden', 'true');
      list.append(row);
    });
  }
  $('#project-search').addEventListener('input', renderIndex);
  $$('[data-status]').forEach(button => button.addEventListener('click', () => {
    selectedStatus = button.dataset.status;
    $$('[data-status]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    renderIndex();
  }));
  renderIndex();

  // Search palette: ordinary words, ranked results, and keyboard navigation.
  const searchDialog = $('#search-dialog');
  const paletteInput = $('#palette-input');
  const pages = [
    { label: 'Selected work', meta: 'Security investigations & hardware projects', keywords: 'projects work labs cybersecurity', target: '#missions', type: 'Page' },
    { label: 'About & education', meta: 'B.Tech CSE · KMCT IETM / KTU · Offenso training', keywords: 'education college university certification ocsp Offenso academy', target: '#education', type: 'Page' },
    { label: 'My toolkit', meta: 'Security, software, hardware & working environments', keywords: 'skills languages Python C C++ Linux security Splunk Sysmon Arduino tools', target: '#arsenal', type: 'Page' },
    { label: 'Contact Yaseen', meta: 'Internships, collaborations & interesting projects', keywords: 'contact email phone LinkedIn GitHub WhatsApp hire internship', target: '#contact', type: 'Page' },
    { label: 'Résumé', meta: 'A print-ready overview of my background & selected work', keywords: 'resume cv download experience education', target: 'resume.html', type: 'Document' },
    { label: 'Full project index', meta: 'Completed work, active builds, prototypes & planned ideas', keywords: 'all register index vault ideas', target: '#vault', type: 'Page' }
  ];
  const searchItems = [...pages, ...projects.map(project => ({ label: project.name, meta: `${project.cat} · ${project.status}`, keywords: project.stack, project: project.id, type: project.status === 'Planned' ? 'Idea' : 'Project' }))];
  let paletteItems = [];
  let activeResult = 0;
  let searchTrigger = null;
  function markText(text, query) {
    const fragment = document.createDocumentFragment();
    const words = query.trim().split(/\s+/).filter(Boolean).map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    if (!words.length) { fragment.append(document.createTextNode(text)); return fragment; }
    const regex = new RegExp(`(${words.join('|')})`, 'gi');
    let start = 0;
    for (const match of text.matchAll(regex)) {
      fragment.append(document.createTextNode(text.slice(start, match.index)), create('mark', '', match[0]));
      start = match.index + match[0].length;
    }
    fragment.append(document.createTextNode(text.slice(start)));
    return fragment;
  }
  function setActiveResult(index, scroll = false) {
    const results = $$('.palette-result');
    if (!results.length) { paletteInput.removeAttribute('aria-activedescendant'); return; }
    activeResult = (index + results.length) % results.length;
    results.forEach((result, i) => result.setAttribute('aria-selected', String(i === activeResult)));
    paletteInput.setAttribute('aria-activedescendant', results[activeResult].id);
    if (scroll) results[activeResult].scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }
  function selectSearchResult(index) {
    const item = paletteItems[index];
    if (!item) return;
    if (item.project) { closeDialog(searchDialog); openProject(item.project, searchTrigger); return; }
    if (item.target.startsWith('#')) {
      const section = $(item.target);
      if (section) {
        section.setAttribute('tabindex', '-1');
        returnTargets.set(searchDialog, section);
      }
      closeDialog(searchDialog);
      location.hash = item.target;
      section?.scrollIntoView({ behavior: motionEnabled ? 'smooth' : 'instant', block: 'start' });
      // The destination is focusable without adding it to normal tab order.
      section?.focus({ preventScroll: true });
    } else {
      closeDialog(searchDialog);
      location.href = item.target;
    }
  }
  function renderPalette() {
    const query = paletteInput.value.trim();
    const words = normalize(query).split(/\s+/).filter(Boolean);
    paletteItems = query ? searchItems.map(item => {
      const name = normalize(item.label);
      const haystack = `${name} ${normalize(item.meta)} ${normalize(item.keywords)}`;
      if (!words.every(word => haystack.includes(word))) return null;
      const score = words.reduce((sum, word) => sum + (name.includes(word) ? 8 : 1), 0) + (name === normalize(query) ? 40 : 0) + (item.type === 'Project' ? 2 : 0);
      return { ...item, score };
    }).filter(Boolean).sort((a, b) => b.score - a.score).slice(0, 12) : [...pages.slice(0, 4), ...searchItems.filter(item => [1, 2, 3].includes(item.project))];
    const list = $('#palette-results');
    list.replaceChildren();
    $('#palette-count').textContent = query ? `${paletteItems.length} result${paletteItems.length === 1 ? '' : 's'} for “${query}”` : 'QUICK DESTINATIONS & SELECTED WORK';
    paletteInput.setAttribute('aria-expanded', String(paletteItems.length > 0));
    if (!paletteItems.length) {
      const empty = create('div', 'empty-state');
      empty.append(create('strong', '', 'No matches this time.'), create('p', '', 'Try a tool name, project, or “contact”.'));
      list.append(empty);
      paletteInput.removeAttribute('aria-activedescendant');
      return;
    }
    paletteItems.forEach((item, index) => {
      const row = create('div', 'palette-result');
      row.id = `search-result-${index}`;
      row.setAttribute('role', 'option');
      row.setAttribute('aria-selected', 'false');
      const content = create('span', 'result-content');
      const label = create('span', 'result-label');
      label.append(markText(item.label, query));
      content.append(label, create('span', 'result-meta', item.meta));
      row.append(create('span', 'result-icon', item.project ? '↳' : item.type === 'Document' ? '▤' : '↗'), content, create('span', 'result-type', item.type));
      row.addEventListener('pointermove', () => setActiveResult(index));
      row.addEventListener('mousedown', event => event.preventDefault());
      row.addEventListener('click', () => selectSearchResult(index));
      list.append(row);
    });
    setActiveResult(0);
  }
  function openSearch(trigger = document.activeElement) {
    if (boot.open || $('#project-dialog').open) return;
    searchTrigger = trigger;
    paletteInput.value = '';
    renderPalette();
    showDialog(searchDialog, trigger);
    paletteInput.focus();
  }
  $$('[data-open-search]').forEach(button => button.addEventListener('click', () => openSearch(button)));
  paletteInput.addEventListener('input', renderPalette);
  paletteInput.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); setActiveResult(activeResult + (event.key === 'ArrowDown' ? 1 : -1), true); }
    if (event.key === 'Enter') { event.preventDefault(); selectSearchResult(activeResult); }
  });
  $$('[data-query]').forEach(button => button.addEventListener('click', () => { paletteInput.value = button.dataset.query; renderPalette(); paletteInput.focus(); }));
  document.addEventListener('keydown', event => {
    const editing = event.target.closest('input, textarea, select, [contenteditable=true]');
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (searchDialog.open) closeDialog(searchDialog); else openSearch();
    } else if (event.key === '/' && !editing && !$('dialog[open]')) { event.preventDefault(); openSearch(); }
  });
  if (/Mac|iPhone|iPad/.test(navigator.platform)) $$('.search-trigger kbd').forEach(key => { key.textContent = '⌘ K'; });

  // Mobile navigation and the active desktop section.
  const menuButton = $('#menu-toggle');
  function setMenu(open) {
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    $('#mobile-nav').hidden = !open;
  }
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  $$('#mobile-nav a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header') && !$('#mobile-nav').hidden) setMenu(false); });
  const mobileBreakpoint = window.matchMedia('(max-width: 620px)');
  mobileBreakpoint.addEventListener('change', () => { if (!mobileBreakpoint.matches) setMenu(false); });
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        $$('.desktop-nav a').forEach(link => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-15% 0px -60% 0px' });
    $$('main section[id]').forEach(section => sectionObserver.observe(section));
  }

  let copyTimer;
  $('#copy-email').addEventListener('click', async () => {
    const feedback = $('#copy-feedback');
    try { await navigator.clipboard.writeText('yaseen@yaseentk.in'); feedback.textContent = 'Email copied'; }
    catch { feedback.textContent = 'Use the email link to get in touch.'; }
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => { feedback.textContent = ''; }, 3500);
  });

  // An ambient packet network, capped at 30fps and paused off-tab or by preference.
  const canvas = $('#network-background');
  const context = canvas.getContext('2d');
  let nodes = [], width = 0, height = 0, frame = 0, lastFrame = 0, lastUpdate = 0;
  const pointer = { x: -1000, y: -1000 };
  function resizeNetwork() {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.75);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context?.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = width < 620 ? 18 : 36;
    nodes = Array.from({ length: count }, () => ({ x: Math.random() * width, y: Math.random() * height, vx: (Math.random() - .5) * .085, vy: (Math.random() - .5) * .085 }));
    if (context) drawNetwork(0, true);
  }
  function drawNetwork(time, still = false) {
    if (!context) return;
    context.clearRect(0, 0, width, height);
    const delta = still ? 0 : Math.min((time - lastUpdate) / 16.67 || 1, 3);
    lastUpdate = time;
    nodes.forEach((node, i) => {
      node.x += node.vx * delta; node.y += node.vy * delta;
      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;
      context.fillStyle = 'rgba(141, 218, 163, .23)';
      context.fillRect(node.x - 1, node.y - 1, 2, 2);
      nodes.slice(i + 1).forEach((other, j) => {
        const distance = Math.hypot(node.x - other.x, node.y - other.y);
        if (distance > 195) return;
        context.strokeStyle = `rgba(123, 193, 146, ${(1 - distance / 195) * .17})`;
        context.lineWidth = .6;
        context.beginPath(); context.moveTo(node.x, node.y); context.lineTo(other.x, other.y); context.stroke();
        if ((i + j) % 5 === 0 && !still) {
          const progress = ((time * .00008) + (i * .13)) % 1;
          context.fillStyle = 'rgba(160, 244, 184, .35)';
          context.fillRect(node.x + (other.x - node.x) * progress, node.y + (other.y - node.y) * progress, 2, 2);
        }
      });
      const pointerDistance = Math.hypot(node.x - pointer.x, node.y - pointer.y);
      if (pointerDistance < 170 && !still) {
        context.strokeStyle = `rgba(160, 244, 184, ${(1 - pointerDistance / 170) * .16})`;
        context.beginPath(); context.moveTo(node.x, node.y); context.lineTo(pointer.x, pointer.y); context.stroke();
      }
    });
  }
  function animateNetwork(time) {
    if (!motionEnabled || document.hidden || !context) { frame = 0; return; }
    if (time - lastFrame >= 33) { drawNetwork(time); lastFrame = time; }
    frame = requestAnimationFrame(animateNetwork);
  }
  function syncMotion() {
    const enabled = motionEnabled && !reducedMotion.matches;
    document.documentElement.classList.toggle('motion-paused', !enabled);
    $('#motion-toggle').setAttribute('aria-pressed', String(enabled));
    $('#motion-toggle').textContent = reducedMotion.matches ? 'Motion: reduced' : `Motion: ${enabled ? 'on' : 'off'}`;
    $('#motion-toggle').disabled = reducedMotion.matches;
    $('#replay-intro').disabled = reducedMotion.matches;
    if (!enabled) { motionEnabled = false; cancelAnimationFrame(frame); frame = 0; drawNetwork(0, true); }
    else if (!frame && !document.hidden) { lastFrame = 0; lastUpdate = 0; frame = requestAnimationFrame(animateNetwork); }
  }
  $('#motion-toggle').addEventListener('click', () => {
    if (reducedMotion.matches) return;
    motionEnabled = !motionEnabled;
    storage.set('localStorage', 'ysec-motion', motionEnabled ? 'on' : 'off');
    syncMotion();
  });
  reducedMotion.addEventListener('change', () => { motionEnabled = !reducedMotion.matches && storage.get('localStorage', 'ysec-motion') !== 'off'; if (reducedMotion.matches) finishIntro(); syncMotion(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else syncMotion(); });
  document.addEventListener('pointermove', event => { if (event.pointerType === 'mouse') { pointer.x = event.clientX; pointer.y = event.clientY; } }, { passive: true });
  document.addEventListener('pointerleave', () => { pointer.x = -1000; pointer.y = -1000; });
  let resizeTimer;
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resizeNetwork, 120); });
  resizeNetwork();
  syncMotion();
})();
