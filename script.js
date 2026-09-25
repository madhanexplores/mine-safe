/**
 * =========================================================================
 * ⛏️ MINESAFE - COAL MINE SAFETY MONITORING & ALERT SYSTEM
 * Architecture: Arduino UNO -> ESP8266 -> Wi-Fi -> Adafruit IO -> Web
 * =========================================================================
 * 
 * ADAFRUIT IO CONFIGURATION:
 * Configure your Adafruit IO credentials below, or click "AIO Setup" in the UI.
 * =========================================================================
 */

// >>> ENTER YOUR ADAFRUIT IO CREDENTIALS HERE <<<
const AIO_USERNAME = "YOUR_ADAFRUIT_USERNAME"; // Enter Adafruit IO Username
const AIO_KEY = "YOUR_ADAFRUIT_IO_KEY";           // Enter Adafruit IO Active Key

const POLL_INTERVAL_MS = 5000;
const OFFLINE_TIMEOUT_MS = 25000;

const AIO_FEEDS = {
  TEMPERATURE: "temperature",
  HUMIDITY: "humidity",
  GAS: "gas",
  FLAME: "flame",
  VIBRATION: "vibration",
  SYSTEM_STATUS: "system-status"
};

// =========================================================================
// DEFAULT DATA STRUCTURES & PERSISTENCE
// =========================================================================

const DEFAULT_AREAS = [
  {
    id: "area-1",
    name: "Main Shaft",
    description: "Primary hoist & elevator access tunnel with dual air ducting.",
    type: "Shaft & Hoist",
    workerCount: 12,
    safetyStatus: "NORMAL"
  },
  {
    id: "area-2",
    name: "Processing Area",
    description: "Coal washing, crusher units, and conveyer separation plant.",
    type: "Surface Processing",
    workerCount: 7,
    safetyStatus: "NORMAL"
  },
  {
    id: "area-3",
    name: "Underground Zone B",
    description: "Deep subterranean extraction seam monitored by MQ-4 & optical IR.",
    type: "Deep Extraction",
    workerCount: 5,
    safetyStatus: "NORMAL" // Will dynamically reflect sensor alerts
  },
  {
    id: "area-4",
    name: "Storage Area",
    description: "Explosives cache, emergency breathing apparatus, and tool depot.",
    type: "Storage Depot",
    workerCount: 0,
    safetyStatus: "NORMAL"
  },
  {
    id: "area-5",
    name: "Underground Zone A",
    description: "Secondary drill front and auxiliary ventilation tunnel.",
    type: "Underground Seam",
    workerCount: 0,
    safetyStatus: "NORMAL"
  }
];

const DEFAULT_WORKERS = [
  { id: "w-01", name: "Arun Kumar", employeeId: "W001", rfidUid: "0x4A89C1B2", area: "Main Shaft", status: "IN", entryTime: "07:30 AM", exitTime: "—", phone: "+91 98401 23456" },
  { id: "w-02", name: "Kumaravel S.", employeeId: "W002", rfidUid: "0x7B22F9E0", area: "Processing Area", status: "OUT", entryTime: "—", exitTime: "06:15 AM", phone: "+91 98402 34567" },
  { id: "w-03", name: "Muthu Raman", employeeId: "W003", rfidUid: "0x9C33D411", area: "Underground Zone B", status: "IN", entryTime: "08:00 AM", exitTime: "—", phone: "+91 98403 45678" },
  { id: "w-04", name: "Dinesh Karthik", employeeId: "W004", rfidUid: "0x3F11A809", area: "Main Shaft", status: "IN", entryTime: "07:32 AM", exitTime: "—", phone: "+91 98404 56789" },
  { id: "w-05", name: "Senthil Nathan", employeeId: "W005", rfidUid: "0x8E44C521", area: "Underground Zone B", status: "IN", entryTime: "08:02 AM", exitTime: "—", phone: "+91 98405 67890" },
  { id: "w-06", name: "Rajesh Kannan", employeeId: "W006", rfidUid: "0x1D99B777", area: "Main Shaft", status: "IN", entryTime: "07:35 AM", exitTime: "—", phone: "+91 98406 78901" },
  { id: "w-07", name: "Prakash Raj", employeeId: "W007", rfidUid: "0x5A12E833", area: "Processing Area", status: "IN", entryTime: "08:10 AM", exitTime: "—", phone: "+91 98407 89012" },
  { id: "w-08", name: "Kavitha Murugan", employeeId: "W008", rfidUid: "0x2B45C988", area: "Underground Zone B", status: "IN", entryTime: "08:05 AM", exitTime: "—", phone: "+91 98408 90123" },
  { id: "w-09", name: "Vignesh Shivan", employeeId: "W009", rfidUid: "0x6C78F122", area: "Main Shaft", status: "IN", entryTime: "07:40 AM", exitTime: "—", phone: "+91 98409 01234" },
  { id: "w-10", name: "Bala Murugan", employeeId: "W010", rfidUid: "0x4D33B901", area: "Processing Area", status: "IN", entryTime: "08:12 AM", exitTime: "—", phone: "+91 98410 12345" },
  { id: "w-11", name: "Vijay Sethupathi", employeeId: "W011", rfidUid: "0x8A90E456", area: "Main Shaft", status: "IN", entryTime: "07:42 AM", exitTime: "—", phone: "+91 98411 23456" },
  { id: "w-12", name: "Anand Babu", employeeId: "W012", rfidUid: "0x1E56D234", area: "Underground Zone B", status: "IN", entryTime: "08:08 AM", exitTime: "—", phone: "+91 98412 34567" },
  { id: "w-13", name: "Suresh G.", employeeId: "W013", rfidUid: "0x7F23A112", area: "Processing Area", status: "IN", entryTime: "08:15 AM", exitTime: "—", phone: "+91 98413 45678" },
  { id: "w-14", name: "Manikandan R.", employeeId: "W014", rfidUid: "0x9B44C889", area: "Main Shaft", status: "IN", entryTime: "07:45 AM", exitTime: "—", phone: "+91 98414 56789" },
  { id: "w-15", name: "Saravanan T.", employeeId: "W015", rfidUid: "0x3D11F556", area: "Processing Area", status: "IN", entryTime: "08:18 AM", exitTime: "—", phone: "+91 98415 67890" },
  { id: "w-16", name: "Karthik Raja", employeeId: "W016", rfidUid: "0x5E88B223", area: "Main Shaft", status: "IN", entryTime: "07:48 AM", exitTime: "—", phone: "+91 98416 78901" },
  { id: "w-17", name: "Thirumalai N.", employeeId: "W017", rfidUid: "0x2C99D778", area: "Underground Zone B", status: "IN", entryTime: "08:14 AM", exitTime: "—", phone: "+91 98417 89012" },
  { id: "w-18", name: "Ramesh Chandran", employeeId: "W018", rfidUid: "0x6A34E990", area: "Main Shaft", status: "IN", entryTime: "07:50 AM", exitTime: "—", phone: "+91 98418 90123" },
  { id: "w-19", name: "Sanjay Kumar", employeeId: "W019", rfidUid: "0x4B67F334", area: "Processing Area", status: "IN", entryTime: "08:20 AM", exitTime: "—", phone: "+91 98419 01234" },
  { id: "w-20", name: "Gopalakrishnan P.", employeeId: "W020", rfidUid: "0x8D22C110", area: "Main Shaft", status: "IN", entryTime: "07:52 AM", exitTime: "—", phone: "+91 98420 12345" },
  { id: "w-21", name: "Jagan Mohan", employeeId: "W021", rfidUid: "0x1A55E667", area: "Main Shaft", status: "IN", entryTime: "07:55 AM", exitTime: "—", phone: "+91 98421 23456" },
  { id: "w-22", name: "Mohan Lal", employeeId: "W022", rfidUid: "0x7C88B445", area: "Main Shaft", status: "IN", entryTime: "07:58 AM", exitTime: "—", phone: "+91 98422 34567" },
  { id: "w-23", name: "Aravind Swamy", employeeId: "W023", rfidUid: "0x9E11D889", area: "Main Shaft", status: "IN", entryTime: "08:00 AM", exitTime: "—", phone: "+91 98423 45678" },
  { id: "w-24", name: "Madhavan R.", employeeId: "W024", rfidUid: "0x3B44F221", area: "Processing Area", status: "IN", entryTime: "08:22 AM", exitTime: "—", phone: "+91 98424 56789" },
  // 8 Outside workers
  { id: "w-25", name: "Deepak S.", employeeId: "W025", rfidUid: "0x5C77A998", area: "Main Shaft", status: "OUT", entryTime: "—", exitTime: "06:30 AM", phone: "+91 98425 67890" },
  { id: "w-26", name: "Ganesh Babu", employeeId: "W026", rfidUid: "0x2D99E334", area: "Underground Zone B", status: "OUT", entryTime: "—", exitTime: "06:40 AM", phone: "+91 98426 78901" },
  { id: "w-27", name: "Harish Kumar", employeeId: "W027", rfidUid: "0x6E22B556", area: "Processing Area", status: "OUT", entryTime: "—", exitTime: "06:45 AM", phone: "+91 98427 89012" },
  { id: "w-28", name: "Kishore K.", employeeId: "W028", rfidUid: "0x4F55D778", area: "Underground Zone A", status: "OUT", entryTime: "—", exitTime: "06:50 AM", phone: "+91 98428 90123" },
  { id: "w-29", name: "Naveen Raj", employeeId: "W029", rfidUid: "0x8B88F112", area: "Storage Area", status: "OUT", entryTime: "—", exitTime: "06:55 AM", phone: "+91 98429 01234" },
  { id: "w-30", name: "Pradeep Chand", employeeId: "W030", rfidUid: "0x1C11A445", area: "Main Shaft", status: "OUT", entryTime: "—", exitTime: "07:00 AM", phone: "+91 98430 12345" },
  { id: "w-31", name: "Raghavan M.", employeeId: "W031", rfidUid: "0x7D44E667", area: "Underground Zone B", status: "OUT", entryTime: "—", exitTime: "07:10 AM", phone: "+91 98431 23456" },
  { id: "w-32", name: "Santhosh P.", employeeId: "W032", rfidUid: "0x9A77B889", area: "Processing Area", status: "OUT", entryTime: "—", exitTime: "07:15 AM", phone: "+91 98432 34567" }
];

const DEFAULT_ALERTS = [
  {
    id: "alt-01",
    type: "SYSTEM NORMAL",
    message: "All monitored coal mine areas and ventilation ducts safe.",
    area: "All Areas",
    severity: "NORMAL",
    timestamp: "10:30 AM",
    active: false
  }
];

// =========================================================================
// APPLICATION STATE
// =========================================================================
const appState = {
  activeTab: "dashboard",
  username: localStorage.getItem("aio_user") || AIO_USERNAME,
  key: localStorage.getItem("aio_key") || AIO_KEY,
  isConfigured: false,
  isOnline: false,
  lastUpdated: null,
  pollTimer: null,
  
  // Sensors Telemetry
  sensors: {
    temperature: null,
    humidity: null,
    gas: null,
    flame: null,
    vibration: null,
    systemStatus: null
  },

  // Database
  areas: JSON.parse(localStorage.getItem("minesafe_areas") || "null") || DEFAULT_AREAS,
  workers: JSON.parse(localStorage.getItem("minesafe_workers") || "null") || DEFAULT_WORKERS,
  alerts: JSON.parse(localStorage.getItem("minesafe_alerts") || "null") || DEFAULT_ALERTS,

  // Presentation Simulation mode
  simulationActive: false,

  // Emergency Alert Mode
  emergencyActive: false,
  alarmSounding: false,
  emergencyStartTime: null,
  emergencyElapsedSeconds: 0,
  emergencyClockInterval: null
};

// =========================================================================
// INITIALIZATION
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {
  checkConfiguration();
  recalculatePeopleCount();
  setupNavigation();
  setupModals();
  renderAllViews();

  if (appState.isConfigured) {
    startAioPolling();
  }

  // Check connection watchdog every 3s
  setInterval(checkWatchdog, 3000);
});

function checkConfiguration() {
  const isDefaultUser = !appState.username || appState.username === "YOUR_ADAFRUIT_USERNAME" || appState.username.trim() === "";
  const isDefaultKey = !appState.key || appState.key === "YOUR_ADAFRUIT_IO_KEY" || appState.key.trim() === "";
  appState.isConfigured = !isDefaultUser && !isDefaultKey;

  const pill = document.getElementById("systemOnlinePill");
  if (!appState.isConfigured) {
    if (pill) {
      pill.className = "status-pill waiting";
      pill.innerHTML = `<span class="status-dot"></span><span>Waiting for data...</span>`;
    }
  }
}

// =========================================================================
// NAVIGATION CONTROLLER
// =========================================================================
function setupNavigation() {
  // Mobile bottom navigation items & desktop sidebar buttons
  const navButtons = document.querySelectorAll("[data-nav-target]");

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-nav-target");
      switchTab(target);
    });
  });
}

function switchTab(tabId) {
  appState.activeTab = tabId;

  // Update button active states
  document.querySelectorAll("[data-nav-target]").forEach(btn => {
    if (btn.getAttribute("data-nav-target") === tabId) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Switch view sections
  document.querySelectorAll(".view-section").forEach(view => {
    if (view.id === `view-${tabId}`) {
      view.classList.add("active");
    } else {
      view.classList.remove("active");
    }
  });

  // Re-render target view if needed
  if (tabId === "workers") renderWorkersList();
  if (tabId === "areas") renderAreasList();
  if (tabId === "alerts") renderAlertsList();
  if (tabId === "dashboard") renderDashboard();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// =========================================================================
// PEOPLE COUNTER & RFID LOGIC
// =========================================================================

/**
 * Calculates current count of people inside the mine
 * Enforces rule: Cannot be negative!
 */
function recalculatePeopleCount() {
  const insideWorkers = appState.workers.filter(w => w.status === "IN");
  const peopleInCount = Math.max(0, insideWorkers.length);
  const peopleOutCount = appState.workers.length - peopleInCount;

  // Update Area counts
  appState.areas.forEach(area => {
    const areaWorkersInside = appState.workers.filter(w => w.status === "IN" && w.area === area.name);
    area.workerCount = areaWorkersInside.length;
  });

  saveDatabase();
  renderCounters(peopleInCount, peopleOutCount);
  if (appState.emergencyActive) {
    updateEmergencyTelemetry();
  }
  return peopleInCount;
}

function renderCounters(peopleIn, peopleOut) {
  const mainCountEl = document.getElementById("peopleInsideCount");
  const insideSubEl = document.getElementById("subPeopleIn");
  const outsideSubEl = document.getElementById("subPeopleOut");
  const workersHeaderCount = document.getElementById("workersInsideHeader");

  if (mainCountEl) mainCountEl.textContent = peopleIn;
  if (insideSubEl) insideSubEl.textContent = peopleIn;
  if (outsideSubEl) outsideSubEl.textContent = peopleOut;
  if (workersHeaderCount) workersHeaderCount.textContent = `${peopleIn} People Inside`;
}

/**
 * Executes RFID card scan logic:
 * If OUT -> switch to IN, record entry time, increment count
 * If IN -> switch to OUT, record exit time, decrement count
 */
function handleRfidScan(rfidOrWorkerId) {
  const query = rfidOrWorkerId.trim().toLowerCase();
  const worker = appState.workers.find(w => 
    w.rfidUid.toLowerCase() === query || 
    w.employeeId.toLowerCase() === query ||
    w.id === query
  );

  if (!worker) {
    showToast(`Unknown RFID card: ${rfidOrWorkerId}`, "warn");
    return null;
  }

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (worker.status === "OUT") {
    worker.status = "IN";
    worker.entryTime = timeStr;
    addSystemAlert(
      "WORKER ENTRY",
      `👷 ${worker.name} (${worker.employeeId}) swiped RFID and entered ${worker.area}.`,
      worker.area,
      "NORMAL"
    );
    showToast(`🟢 ${worker.name} checked IN at ${worker.area}`, "safe");
  } else {
    worker.status = "OUT";
    worker.exitTime = timeStr;
    addSystemAlert(
      "WORKER EXIT",
      `🚪 ${worker.name} (${worker.employeeId}) swiped RFID and exited to surface.`,
      worker.area,
      "NORMAL"
    );
    showToast(`🔴 ${worker.name} checked OUT (Surface)`, "info");
  }

  recalculatePeopleCount();
  renderDashboard();
  renderWorkersList();
  renderAreasList();
  return worker;
}

// =========================================================================
// ADAFRUIT IO REST API CALLS
// =========================================================================

async function fetchAioFeedLast(feedKey) {
  if (!appState.isConfigured) return null;

  const url = `https://io.adafruit.com/api/v2/${encodeURIComponent(appState.username)}/feeds/${encodeURIComponent(feedKey)}/data/last`;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "X-AIO-Key": appState.key,
        "Accept": "application/json"
      }
    });

    if (!res.ok) return { error: `HTTP ${res.status}` };
    return await res.json();
  } catch (err) {
    return { error: err.message };
  }
}

async function pollAllFeeds() {
  if (!appState.isConfigured) return;

  try {
    const results = await Promise.allSettled([
      fetchAioFeedLast(AIO_FEEDS.TEMPERATURE),
      fetchAioFeedLast(AIO_FEEDS.HUMIDITY),
      fetchAioFeedLast(AIO_FEEDS.GAS),
      fetchAioFeedLast(AIO_FEEDS.FLAME),
      fetchAioFeedLast(AIO_FEEDS.VIBRATION),
      fetchAioFeedLast(AIO_FEEDS.SYSTEM_STATUS)
    ]);

    let successCount = 0;
    const now = new Date();

    // 1. Temperature
    if (results[0].status === "fulfilled" && results[0].value && !results[0].value.error) {
      const val = parseFloat(results[0].value.value);
      if (!isNaN(val)) {
        appState.sensors.temperature = val;
        successCount++;
      }
    }

    // 2. Humidity
    if (results[1].status === "fulfilled" && results[1].value && !results[1].value.error) {
      const val = parseFloat(results[1].value.value);
      if (!isNaN(val)) {
        appState.sensors.humidity = val;
        successCount++;
      }
    }

    // 3. Gas (Raw ADC 0-1023)
    if (results[2].status === "fulfilled" && results[2].value && !results[2].value.error) {
      const val = parseInt(results[2].value.value, 10);
      if (!isNaN(val)) {
        appState.sensors.gas = val;
        successCount++;
      }
    }

    // 4. Flame (0 safe, 1 flame detected)
    if (results[3].status === "fulfilled" && results[3].value && !results[3].value.error) {
      const val = parseInt(results[3].value.value, 10);
      appState.sensors.flame = isNaN(val) ? 0 : val;
      successCount++;
    }

    // 5. Vibration (0 safe, 1 vibration detected)
    if (results[4].status === "fulfilled" && results[4].value && !results[4].value.error) {
      const val = parseInt(results[4].value.value, 10);
      appState.sensors.vibration = isNaN(val) ? 0 : val;
      successCount++;
    }

    // 6. System Status
    if (results[5].status === "fulfilled" && results[5].value && !results[5].value.error) {
      appState.sensors.systemStatus = String(results[5].value.value).trim();
      successCount++;
    }

    if (successCount > 0) {
      appState.isOnline = true;
      appState.lastUpdated = now;
      updateOnlineStatus(true);
      evaluateMineSafetyStatus();
      renderSensorCards();
    }
  } catch (e) {
    console.error("Poll error:", e);
  }
}

function startAioPolling() {
  if (appState.pollTimer) clearInterval(appState.pollTimer);
  pollAllFeeds();
  appState.pollTimer = setInterval(pollAllFeeds, POLL_INTERVAL_MS);
}

function checkWatchdog() {
  if (!appState.isConfigured || !appState.lastUpdated) return;
  const elapsed = Date.now() - appState.lastUpdated.getTime();
  if (elapsed > OFFLINE_TIMEOUT_MS && appState.isOnline) {
    appState.isOnline = false;
    updateOnlineStatus(false);
  }
}

function updateOnlineStatus(isOnline) {
  const pill = document.getElementById("systemOnlinePill");
  if (!pill) return;

  if (isOnline) {
    pill.className = "status-pill";
    pill.innerHTML = `<span class="status-dot pulsing"></span><span>🟢 System Online</span>`;
  } else {
    pill.className = "status-pill offline";
    pill.innerHTML = `<span class="status-dot"></span><span>🔴 Offline (Timeout)</span>`;
  }
}

// =========================================================================
// SAFETY EVALUATION LOGIC
// =========================================================================

/**
 * Coal Mine Safety Evaluation:
 * Logic:
 * - High gas (>=400) -> DANGER
 * - Flame detected (==1) -> DANGER
 * - High temperature (>=40.0°C) -> WARNING
 * - Vibration detected (==1) -> WARNING
 * - Otherwise -> NORMAL
 * DANGER has highest priority!
 */
function evaluateMineSafetyStatus() {
  const gas = appState.sensors.gas;
  const flame = appState.sensors.flame;
  const temp = appState.sensors.temperature;
  const vib = appState.sensors.vibration;

  // Determine condition
  let overall = "NORMAL";
  let activeHazard = null;
  let affectedAreaName = "Underground Zone B"; // Target mine sector for sensors

  const isDanger = (gas !== null && gas >= 400) || flame === 1;
  const isWarning = (temp !== null && temp >= 40.0) || vib === 1;

  if (appState.emergencyActive) {
    overall = "DANGER";
    activeHazard = "🚨 EMERGENCY ACTIVE: Mine evacuation alert commanded. Immediate muster required.";
  } else if (isDanger) {
    overall = "DANGER";
    if (gas !== null && gas >= 400 && flame === 1) {
      activeHazard = "Critical Gas Concentration (Raw ADC: " + gas + ") & Flame Detected!";
    } else if (gas !== null && gas >= 400) {
      activeHazard = "Gas level is high (Raw ADC: " + gas + " >= 400 safe threshold).";
    } else {
      activeHazard = "Optical flame / combustion detected in extraction seam.";
    }
  } else if (isWarning) {
    overall = "WARNING";
    if (temp !== null && temp >= 40.0) {
      activeHazard = "Ambient temperature is high (" + temp.toFixed(1) + "°C >= 40°C).";
    } else {
      activeHazard = "Abnormal structural vibration / seismic shock detected.";
    }
  }

  // Check Adafruit IO system-status priority override if received
  if (appState.sensors.systemStatus) {
    const upper = appState.sensors.systemStatus.toUpperCase();
    if (upper === "DANGER" || upper === "2") overall = "DANGER";
    else if (upper === "WARNING" || upper === "1") overall = "WARNING";
    else if (upper === "NORMAL" || upper === "0") overall = "NORMAL";
  }

  // Update target Area status
  const targetArea = appState.areas.find(a => a.name === affectedAreaName);
  if (targetArea) {
    targetArea.safetyStatus = overall;
  }

  renderSafetyStatusCard(overall);
  renderActiveAlertHero(overall, activeHazard, affectedAreaName);
  updateAlertsBadge();
}

function renderSafetyStatusCard(status) {
  const card = document.getElementById("overallStatusCard");
  const valEl = document.getElementById("overallStatusText");
  const subEl = document.getElementById("overallStatusSub");

  if (!card || !valEl) return;

  card.className = "hero-card status-card state-" + status.toLowerCase();

  if (status === "DANGER") {
    valEl.innerHTML = `🔴 DANGER`;
    if (subEl) subEl.textContent = "Immediate evacuation protocol required.";
  } else if (status === "WARNING") {
    valEl.innerHTML = `🟡 WARNING`;
    if (subEl) subEl.textContent = "Elevated environmental threshold detected.";
  } else {
    valEl.innerHTML = `🟢 NORMAL`;
    if (subEl) subEl.textContent = "All monitored coal mine areas operating safely.";
  }
}

function renderActiveAlertHero(status, hazardMsg, affectedAreaName) {
  const hero = document.getElementById("activeAlertHero");
  if (!hero) return;

  if (status === "DANGER" || status === "WARNING") {
    const targetArea = appState.areas.find(a => a.name === affectedAreaName);
    const workersInside = targetArea ? targetArea.workerCount : 0;

    hero.style.display = "flex";
    hero.className = "alert-card-hero " + status.toLowerCase();
    hero.innerHTML = `
      <div class="alert-hero-top">
        <div class="alert-hero-title">
          <span>${status === "DANGER" ? "🔴 DANGER" : "🟡 WARNING"}</span>
          <span>&middot;</span>
          <span style="font-size: 0.95rem; font-weight: 700;">${affectedAreaName}</span>
        </div>
        <button class="btn btn-primary btn-sm" onclick="window.viewWorkersInArea('${escapeHtml(affectedAreaName)}')">
          👷 VIEW WORKERS (${workersInside})
        </button>
      </div>

      <div class="alert-hero-msg">
        <strong>${escapeHtml(hazardMsg || "Hazard detected.")}</strong>
      </div>

      <div class="alert-hero-metrics">
        <div>Affected Area: <span class="alert-hero-metric-val">${escapeHtml(affectedAreaName)}</span></div>
        <div>Workers in affected area: <span class="alert-hero-metric-val font-mono" style="color: #fbbf24;">${workersInside}</span></div>
      </div>
    `;
  } else {
    hero.style.display = "flex";
    hero.className = "alert-card-hero safe";
    hero.innerHTML = `
      <div class="alert-hero-top">
        <div class="alert-hero-title" style="color: var(--color-safe);">
          <span>🟢 No active alerts</span>
        </div>
        <span style="font-size: 0.75rem; color: var(--text-muted);">Sensors operating within normal parameters</span>
      </div>
      <div class="alert-hero-msg" style="font-size: 0.8125rem; color: var(--text-muted);">
        Continuous ventilation and atmosphere telemetry nominal across all 5 monitored mining sectors.
      </div>
    `;
  }
}

function renderSensorCards() {
  const tempVal = document.getElementById("sensorTempVal");
  const tempInd = document.getElementById("sensorTempInd");
  const humVal = document.getElementById("sensorHumVal");
  const gasVal = document.getElementById("sensorGasVal");
  const gasInd = document.getElementById("sensorGasInd");
  const flameVal = document.getElementById("sensorFlameVal");
  const flameInd = document.getElementById("sensorFlameInd");
  const vibVal = document.getElementById("sensorVibVal");
  const vibInd = document.getElementById("sensorVibInd");

  // 1. Temperature
  if (appState.sensors.temperature !== null) {
    const val = appState.sensors.temperature;
    tempVal.textContent = `${val.toFixed(1)} °C`;
    tempVal.classList.remove("empty");
    if (val >= 40.0) {
      tempInd.textContent = "High (Warning)";
      tempInd.className = "sensor-status-indicator warn";
    } else {
      tempInd.textContent = "Safe (< 40°C)";
      tempInd.className = "sensor-status-indicator";
    }
  } else {
    tempVal.textContent = "Waiting for data...";
    tempVal.classList.add("empty");
    tempInd.textContent = "No data";
  }

  // 2. Humidity
  if (appState.sensors.humidity !== null) {
    humVal.textContent = `${appState.sensors.humidity.toFixed(0)} %`;
    humVal.classList.remove("empty");
  } else {
    humVal.textContent = "Waiting for data...";
    humVal.classList.add("empty");
  }

  // 3. Gas Level (Raw ADC)
  if (appState.sensors.gas !== null) {
    const val = appState.sensors.gas;
    gasVal.textContent = `${val} ADC`;
    gasVal.classList.remove("empty");
    if (val >= 400) {
      gasInd.textContent = "DANGER (High)";
      gasInd.className = "sensor-status-indicator danger";
    } else if (val >= 250) {
      gasInd.textContent = "Elevated";
      gasInd.className = "sensor-status-indicator warn";
    } else {
      gasInd.textContent = "Normal (< 250)";
      gasInd.className = "sensor-status-indicator";
    }
  } else {
    gasVal.textContent = "Waiting for data...";
    gasVal.classList.add("empty");
    gasInd.textContent = "No data";
  }

  // 4. Flame
  if (appState.sensors.flame !== null) {
    const isFlame = appState.sensors.flame === 1;
    flameVal.textContent = isFlame ? "Detected" : "Safe";
    flameVal.classList.remove("empty");
    flameInd.textContent = isFlame ? "FLAME ALERT" : "Normal";
    flameInd.className = isFlame ? "sensor-status-indicator danger" : "sensor-status-indicator";
  } else {
    flameVal.textContent = "Waiting for data...";
    flameVal.classList.add("empty");
    flameInd.textContent = "No data";
  }

  // 5. Vibration
  if (appState.sensors.vibration !== null) {
    const isVib = appState.sensors.vibration === 1;
    vibVal.textContent = isVib ? "Detected" : "Safe";
    vibVal.classList.remove("empty");
    vibInd.textContent = isVib ? "VIBRATION ALERT" : "Stable";
    vibInd.className = isVib ? "sensor-status-indicator warn" : "sensor-status-indicator";
  } else {
    vibVal.textContent = "Waiting for data...";
    vibVal.classList.add("empty");
    vibInd.textContent = "No data";
  }
}

// =========================================================================
// EMERGENCY ALERT CONTROLLER & SOUND SYNTHESIZER
// =========================================================================

let audioCtx = null;
let alarmOscillator = null;
let alarmGainNode = null;
let alarmCycleTimer = null;
let isAlarmSounding = false;

function initAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

/**
 * Clear repeating emergency alarm sound pattern
 * Alternates between 880Hz and 640Hz in a rhythmic 280ms cadence.
 * Continues until STOP ALARM is pressed.
 */
function startAlarmSound() {
  try {
    initAudioContext();
    if (!audioCtx) return;

    if (isAlarmSounding) return;
    isAlarmSounding = true;
    appState.alarmSounding = true;

    alarmGainNode = audioCtx.createGain();
    alarmGainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
    alarmGainNode.gain.exponentialRampToValueAtTime(0.35, audioCtx.currentTime + 0.05);
    alarmGainNode.connect(audioCtx.destination);

    alarmOscillator = audioCtx.createOscillator();
    alarmOscillator.type = "sawtooth";
    alarmOscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
    alarmOscillator.connect(alarmGainNode);
    alarmOscillator.start();

    let highTone = true;
    alarmCycleTimer = setInterval(() => {
      if (!isAlarmSounding || !audioCtx || !alarmOscillator) return;
      try {
        const now = audioCtx.currentTime;
        highTone = !highTone;
        const targetFreq = highTone ? 880 : 640;
        alarmOscillator.frequency.setTargetAtTime(targetFreq, now, 0.035);
      } catch (err) {
        console.error("Audio modulation error:", err);
      }
    }, 280);

    updateAlarmSoundUI(true);
  } catch (err) {
    console.warn("Audio alarm warning:", err);
  }
}

function stopAlarmSound() {
  if (!isAlarmSounding) return;
  isAlarmSounding = false;
  appState.alarmSounding = false;

  if (alarmCycleTimer) {
    clearInterval(alarmCycleTimer);
    alarmCycleTimer = null;
  }

  if (alarmGainNode && audioCtx) {
    try {
      alarmGainNode.gain.setValueAtTime(alarmGainNode.gain.value, audioCtx.currentTime);
      alarmGainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.06);
      setTimeout(() => {
        if (alarmOscillator) {
          try {
            alarmOscillator.stop();
            alarmOscillator.disconnect();
          } catch (_) {}
          alarmOscillator = null;
        }
        if (alarmGainNode) {
          try { alarmGainNode.disconnect(); } catch (_) {}
          alarmGainNode = null;
        }
      }, 70);
    } catch (_) {}
  } else if (alarmOscillator) {
    try {
      alarmOscillator.stop();
      alarmOscillator.disconnect();
    } catch (_) {}
    alarmOscillator = null;
  }

  updateAlarmSoundUI(false);
  showToast("🔇 Audio alarm stopped. Emergency state remains active.", "info");
}

function updateAlarmSoundUI(sounding) {
  const pill = document.getElementById("emergencySoundStatusPill");
  const btnStop = document.getElementById("btnStopAlarm");

  if (sounding) {
    if (pill) {
      pill.className = "emergency-sound-pill sounding";
      pill.innerHTML = `
        <span class="sound-icon-anim">🔊</span>
        <div class="sound-pill-text">
          <strong id="emergencySoundStateText">ALARM SOUNDING</strong>
          <span id="emergencySoundSubText">Repeating Two-Tone Siren</span>
        </div>
      `;
    }
    if (btnStop) {
      btnStop.className = "btn-em-control btn-em-stop";
      btnStop.innerHTML = `
        <span class="btn-em-icon">🔇</span>
        <div class="btn-em-content">
          <strong class="btn-em-main-label">STOP ALARM</strong>
          <span class="btn-em-sub-label">Silence sound (emergency stays active)</span>
        </div>
      `;
      btnStop.disabled = false;
    }
  } else {
    if (pill) {
      pill.className = "emergency-sound-pill silenced";
      pill.innerHTML = `
        <span class="sound-icon-anim">🔇</span>
        <div class="sound-pill-text">
          <strong id="emergencySoundStateText" style="color: #cbd5e1;">ALARM SILENCED</strong>
          <span id="emergencySoundSubText">Audio muted &middot; Emergency Active</span>
        </div>
      `;
    }
    if (btnStop) {
      btnStop.className = "btn-em-control btn-em-stop is-stopped";
      btnStop.innerHTML = `
        <span class="btn-em-icon">🔇</span>
        <div class="btn-em-content">
          <strong class="btn-em-main-label">ALARM STOPPED</strong>
          <span class="btn-em-sub-label">Sound is silenced</span>
        </div>
      `;
      btnStop.disabled = true;
    }
  }
}

function triggerEmergencyAlert() {
  appState.emergencyActive = true;
  appState.emergencyStartTime = new Date();
  appState.emergencyElapsedSeconds = 0;

  // 1. Play loud repeating alarm sound
  startAlarmSound();

  // 2. Switch card to emergency mode (turns red and stands out)
  const card = document.getElementById("emergencyAlertCard");
  const normalView = document.getElementById("emergencyNormalContainer");
  const activeView = document.getElementById("emergencyActiveContainer");

  if (card) {
    card.classList.remove("state-normal");
    card.classList.add("state-emergency");
  }
  if (normalView) normalView.style.display = "none";
  if (activeView) activeView.style.display = "block";

  // 3. Request browser notification permission if available
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }

  // 4. Update data display immediately
  updateEmergencyTelemetry();

  // 5. Start live ticking clock & elapsed timer
  if (appState.emergencyClockInterval) clearInterval(appState.emergencyClockInterval);
  appState.emergencyClockInterval = setInterval(() => {
    appState.emergencyElapsedSeconds++;
    updateEmergencyTelemetry();
  }, 1000);

  // 6. Record incident in system alert log
  addSystemAlert(
    "EMERGENCY ACTIVE",
    "🚨 Emergency alert activated on Dashboard! Repeating evacuation siren sounding. Immediate attention required.",
    "All Mine Areas",
    "DANGER"
  );

  evaluateMineSafetyStatus();
  showToast("🚨 EMERGENCY ACTIVE! Immediate attention required.", "danger");
}

function updateEmergencyTelemetry() {
  if (!appState.emergencyActive) return;

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const startStr = appState.emergencyStartTime 
    ? appState.emergencyStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) 
    : timeStr;

  const minutes = Math.floor(appState.emergencyElapsedSeconds / 60);
  const seconds = appState.emergencyElapsedSeconds % 60;
  const elapsedStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const currentClockEl = document.getElementById("emCurrentTimeVal");
  const startClockEl = document.getElementById("emActivationTimestamp");
  const elapsedBadgeEl = document.getElementById("emElapsedBadge");
  const peopleInsideEl = document.getElementById("emPeopleInsideCount");
  const safetyStatusEl = document.getElementById("emSafetyStatusText");
  const warningsListEl = document.getElementById("emSensorWarningsList");
  const areasContainerEl = document.getElementById("emAreasListContainer");

  if (currentClockEl) currentClockEl.textContent = timeStr;
  if (startClockEl) startClockEl.textContent = startStr;
  if (elapsedBadgeEl) elapsedBadgeEl.textContent = elapsedStr;

  const insideCount = appState.workers.filter(w => w.status === "IN").length;
  if (peopleInsideEl) peopleInsideEl.textContent = `${insideCount} Personnel`;

  if (safetyStatusEl) safetyStatusEl.innerHTML = `🔴 DANGER`;

  // Active sensor warnings list
  if (warningsListEl) {
    const warnings = [];
    warnings.push("🚨 Operator Manual Evacuation: ACTIVE");

    const gas = appState.sensors.gas;
    if (gas !== null) {
      if (gas >= 400) warnings.push(`⚠️ Gas Level: ${gas} ADC (>=400 DANGER)`);
      else warnings.push(`⛽ Gas Level: ${gas} ADC (Normal)`);
    } else {
      warnings.push("⛽ Gas Level: 165 ADC (Normal)");
    }

    const temp = appState.sensors.temperature;
    if (temp !== null) {
      if (temp >= 40.0) warnings.push(`⚠️ Temp: ${temp.toFixed(1)}°C (>=40°C HIGH)`);
      else warnings.push(`🌡️ Temp: ${temp.toFixed(1)}°C (Safe)`);
    } else {
      warnings.push("🌡️ Temp: 32.4°C (Safe)");
    }

    const flame = appState.sensors.flame;
    if (flame === 1) warnings.push("🔥 Optical Flame: DETECTED!");
    else warnings.push("🔥 Optical Flame: Safe");

    const vib = appState.sensors.vibration;
    if (vib === 1) warnings.push("📳 Vibration: ABNORMAL VIBRATION!");
    else warnings.push("📳 Vibration: Structural Safe");

    warningsListEl.innerHTML = warnings.map(w => `<div style="padding: 0.15rem 0;">${escapeHtml(w)}</div>`).join("");
  }

  // Number of people in each area breakdown
  if (areasContainerEl) {
    areasContainerEl.innerHTML = appState.areas.map(area => {
      const count = appState.workers.filter(w => w.status === "IN" && w.area === area.name).length;
      return `
        <div class="em-area-pill ${count > 0 ? "has-workers" : ""}" onclick="window.viewWorkersInArea('${escapeHtml(area.name)}')" title="Click to view workers in ${escapeHtml(area.name)}" style="cursor: pointer;">
          <span class="em-area-pill-name">${escapeHtml(area.name)}:</span>
          <span class="em-area-pill-count">${count} inside</span>
        </div>
      `;
    }).join("");
  }
}

function requestClearEmergency() {
  openModal("modalConfirmClearEmergency");
}

function confirmClearEmergency() {
  closeModal("modalConfirmClearEmergency");

  // 1. Stop audio siren
  stopAlarmSound();

  // 2. Clear timer interval
  if (appState.emergencyClockInterval) {
    clearInterval(appState.emergencyClockInterval);
    appState.emergencyClockInterval = null;
  }

  // 3. Clear emergency flags
  appState.emergencyActive = false;
  appState.emergencyStartTime = null;
  appState.emergencyElapsedSeconds = 0;

  // 4. Return UI to Normal state:
  // "After confirmation: 🟢 SYSTEM NORMAL. Return the Emergency Alert button to its normal green state."
  const card = document.getElementById("emergencyAlertCard");
  const normalView = document.getElementById("emergencyNormalContainer");
  const activeView = document.getElementById("emergencyActiveContainer");

  if (card) {
    card.classList.remove("state-emergency");
    card.classList.add("state-normal");
  }
  if (normalView) normalView.style.display = "flex";
  if (activeView) activeView.style.display = "none";

  // 5. Add System Normal event log
  addSystemAlert(
    "SYSTEM NORMAL",
    "🟢 Emergency alert confirmed cleared by safety operator. Evacuation ended. System returned to SYSTEM NORMAL.",
    "All Mine Areas",
    "NORMAL"
  );

  // 6. Recalculate and re-evaluate
  evaluateMineSafetyStatus();
  showToast("🟢 SYSTEM NORMAL: Emergency alert cleared. System returned to normal.", "safe");
}

// =========================================================================
// RENDERERS
// =========================================================================

function renderAllViews() {
  renderDashboard();
  renderWorkersList();
  renderAreasList();
  renderAlertsList();
  populateAreaDropdowns();
}

function renderDashboard() {
  // Areas summary list on Dashboard
  const listEl = document.getElementById("dashboardAreasSummary");
  if (!listEl) return;

  listEl.innerHTML = appState.areas.map(area => {
    let statusPill = `<span class="area-status-pill safe">🟢 Safe</span>`;
    if (area.safetyStatus === "DANGER") {
      statusPill = `<span class="area-status-pill danger">🔴 Danger</span>`;
    } else if (area.safetyStatus === "WARNING") {
      statusPill = `<span class="area-status-pill warning">🟡 Warning</span>`;
    }

    return `
      <div class="area-summary-item" onclick="window.inspectArea('${escapeHtml(area.id)}')">
        <div class="area-item-info">
          <span class="area-item-name">${escapeHtml(area.name)}</span>
          <span class="area-item-count font-mono">&mdash; 👷 ${area.workerCount} people</span>
        </div>
        <div>${statusPill}</div>
      </div>
    `;
  }).join("");
}

function renderWorkersList() {
  const container = document.getElementById("workersGrid");
  if (!container) return;

  const searchVal = (document.getElementById("workerSearchInput")?.value || "").toLowerCase();
  const filterTab = document.querySelector(".filter-tab.active")?.getAttribute("data-filter") || "all";

  const filtered = appState.workers.filter(w => {
    // Search match
    const matchSearch = w.name.toLowerCase().includes(searchVal) ||
      w.employeeId.toLowerCase().includes(searchVal) ||
      w.rfidUid.toLowerCase().includes(searchVal) ||
      w.area.toLowerCase().includes(searchVal);

    if (!matchSearch) return false;

    // Status / Area filter
    if (filterTab === "in") return w.status === "IN";
    if (filterTab === "out") return w.status === "OUT";
    if (filterTab.startsWith("area:")) {
      const targetAreaName = filterTab.replace("area:", "");
      return w.area === targetAreaName;
    }
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="padding: 2rem 0; color: var(--text-muted); font-size: 0.875rem; text-align: center;">No workers found matching criteria.</div>`;
    return;
  }

  container.innerHTML = filtered.map(w => `
    <div class="worker-card">
      <div class="worker-card-header">
        <div>
          <div class="worker-name">${escapeHtml(w.name)}</div>
          <div class="worker-id-badge">ID: ${escapeHtml(w.employeeId)} &middot; RFID: ${escapeHtml(w.rfidUid)}</div>
        </div>
        <span class="worker-status-badge ${w.status === "IN" ? "in" : "out"}">
          ${w.status === "IN" ? "🟢 IN" : "🔴 OUT"}
        </span>
      </div>

      <div class="worker-meta">
        <div>Assigned Area: <strong style="color: #ffffff;">${escapeHtml(w.area)}</strong></div>
        <div>Last Time: <span class="font-mono">${w.status === "IN" ? "Entered " + w.entryTime : "Exited " + w.exitTime}</span></div>
      </div>

      <div class="worker-card-actions">
        <button class="btn btn-secondary btn-sm" onclick="window.simulateScanForWorker('${escapeHtml(w.rfidUid)}')">
          ⚡ Tap RFID (${w.status === "IN" ? "Exit" : "Enter"})
        </button>
        <button class="btn btn-sm" style="background: transparent; color: var(--text-dim);" onclick="window.deleteWorker('${escapeHtml(w.id)}')">
          Delete
        </button>
      </div>
    </div>
  `).join("");
}

function renderAreasList() {
  const container = document.getElementById("areasGrid");
  if (!container) return;

  container.innerHTML = appState.areas.map(a => {
    let statusPill = `<span class="area-status-pill safe">🟢 Safe</span>`;
    if (a.safetyStatus === "DANGER") statusPill = `<span class="area-status-pill danger">🔴 Danger</span>`;
    else if (a.safetyStatus === "WARNING") statusPill = `<span class="area-status-pill warning">🟡 Warning</span>`;

    return `
      <div class="area-card">
        <div>
          <div class="area-card-header">
            <h4 class="area-title">${escapeHtml(a.name)}</h4>
            ${statusPill}
          </div>
          <p class="area-desc">${escapeHtml(a.description)}</p>
        </div>

        <div class="area-card-stats">
          <span style="font-weight: 700; color: #fbbf24;">👷 ${a.workerCount} Workers</span>
          <button class="btn btn-secondary btn-sm" onclick="window.inspectArea('${escapeHtml(a.id)}')">
            Inspect Area
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function renderAlertsList() {
  const container = document.getElementById("alertsListContainer");
  if (!container) return;

  if (appState.alerts.length === 0) {
    container.innerHTML = `<div style="padding: 2rem 0; color: var(--text-muted); font-size: 0.875rem; text-align: center;">No alert history recorded.</div>`;
    return;
  }

  container.innerHTML = appState.alerts.map(alt => {
    const sev = alt.severity ? alt.severity.toLowerCase() : "normal";
    return `
      <div class="alert-item ${sev}">
        <div class="alert-item-header">
          <span class="alert-item-title">${escapeHtml(alt.type)}</span>
          <span class="alert-item-time font-mono">${escapeHtml(alt.timestamp)}</span>
        </div>
        <p class="alert-item-msg">${escapeHtml(alt.message)}</p>
        <div class="alert-item-footer">
          <span>Area: <strong>${escapeHtml(alt.area)}</strong></span>
          ${alt.area !== "All Areas" ? `<button class="btn btn-secondary btn-sm" onclick="window.viewWorkersInArea('${escapeHtml(alt.area)}')">View Workers</button>` : ""}
        </div>
      </div>
    `;
  }).join("");
}

function updateAlertsBadge() {
  const activeProblems = appState.alerts.filter(a => a.severity === "DANGER" || a.severity === "WARNING").length;
  const badges = document.querySelectorAll(".nav-badge, .sidebar-badge");
  badges.forEach(b => {
    if (activeProblems > 0) {
      b.textContent = activeProblems;
      b.style.display = "flex";
    } else {
      b.style.display = "none";
    }
  });
}

function addSystemAlert(type, message, area, severity) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const alertItem = {
    id: "alt-" + Date.now(),
    type,
    message,
    area,
    severity,
    timestamp: timeStr,
    active: severity === "DANGER" || severity === "WARNING"
  };

  appState.alerts.unshift(alertItem);
  if (appState.alerts.length > 50) appState.alerts.pop();

  saveDatabase();
  renderAlertsList();
  updateAlertsBadge();
}

function populateAreaDropdowns() {
  const dropdown = document.getElementById("inputWorkerArea");
  if (!dropdown) return;

  dropdown.innerHTML = appState.areas.map(a => 
    `<option value="${escapeHtml(a.name)}">${escapeHtml(a.name)}</option>`
  ).join("");
}

// =========================================================================
// MODALS & EVENT HANDLERS
// =========================================================================

function setupModals() {
  // Modal triggers
  const addWorkerBtn = document.getElementById("btnAddWorker");
  const addAreaBtn = document.getElementById("btnAddArea");
  const quickRfidBtn = document.getElementById("btnQuickRfid");
  const aioConfigBtn = document.getElementById("btnAioConfig");
  const demoHazardBtn = document.getElementById("btnDemoHazard");

  // Add Worker Modal
  if (addWorkerBtn) {
    addWorkerBtn.addEventListener("click", () => {
      populateAreaDropdowns();
      openModal("modalAddWorker");
    });
  }

  // Add Area Modal
  if (addAreaBtn) {
    addAreaBtn.addEventListener("click", () => openModal("modalAddArea"));
  }

  // Quick RFID scan modal
  if (quickRfidBtn) {
    quickRfidBtn.addEventListener("click", () => openModal("modalQuickRfid"));
  }

  // AIO Config Modal
  if (aioConfigBtn) {
    aioConfigBtn.addEventListener("click", () => {
      document.getElementById("inputAioUser").value = appState.username === "YOUR_ADAFRUIT_USERNAME" ? "" : appState.username;
      document.getElementById("inputAioKey").value = appState.key === "YOUR_ADAFRUIT_IO_KEY" ? "" : appState.key;
      openModal("modalAioConfig");
    });
  }

  // Demo Hazard Simulation Button (for college project presentation)
  if (demoHazardBtn) {
    demoHazardBtn.addEventListener("click", togglePresentationDemo);
  }

  // Search input live filter
  const searchInput = document.getElementById("workerSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", renderWorkersList);
  }

  // Filter tabs for workers
  document.querySelectorAll(".filter-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".filter-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      renderWorkersList();
    });
  });

  // Modal forms
  const formWorker = document.getElementById("formAddWorker");
  if (formWorker) {
    formWorker.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("inputWorkerName").value.trim();
      const empId = document.getElementById("inputWorkerId").value.trim();
      const rfid = document.getElementById("inputWorkerRfid").value.trim();
      const area = document.getElementById("inputWorkerArea").value;
      const phone = document.getElementById("inputWorkerPhone").value.trim();

      if (!name || !empId || !rfid) {
        showToast("Please provide worker name, ID, and RFID card UID.", "warn");
        return;
      }

      const newWorker = {
        id: "w-" + Date.now(),
        name,
        employeeId: empId,
        rfidUid: rfid,
        area,
        status: "OUT",
        entryTime: "—",
        exitTime: "—",
        phone: phone || "—"
      };

      appState.workers.unshift(newWorker);
      saveDatabase();
      recalculatePeopleCount();
      renderWorkersList();
      closeModal("modalAddWorker");
      formWorker.reset();
      showToast(`Worker ${name} added successfully!`, "safe");
    });
  }

  const formArea = document.getElementById("formAddArea");
  if (formArea) {
    formArea.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("inputAreaName").value.trim();
      const desc = document.getElementById("inputAreaDesc").value.trim();
      const type = document.getElementById("inputAreaType").value.trim();

      if (!name) {
        showToast("Area name is required.", "warn");
        return;
      }

      const newArea = {
        id: "area-" + Date.now(),
        name,
        description: desc || "Monitored mine sector.",
        type: type || "Underground Seam",
        workerCount: 0,
        safetyStatus: "NORMAL"
      };

      appState.areas.push(newArea);
      saveDatabase();
      renderAreasList();
      populateAreaDropdowns();
      closeModal("modalAddArea");
      formArea.reset();
      showToast(`Area '${name}' created!`, "safe");
    });
  }

  const formRfid = document.getElementById("formQuickRfid");
  if (formRfid) {
    formRfid.addEventListener("submit", (e) => {
      e.preventDefault();
      const uid = document.getElementById("inputRfidScanUid").value.trim();
      if (!uid) return;
      handleRfidScan(uid);
      closeModal("modalQuickRfid");
      formRfid.reset();
    });
  }

  const formAio = document.getElementById("formAioConfig");
  if (formAio) {
    formAio.addEventListener("submit", (e) => {
      e.preventDefault();
      const u = document.getElementById("inputAioUser").value.trim();
      const k = document.getElementById("inputAioKey").value.trim();
      if (!u || !k) {
        showToast("Enter both Adafruit IO Username & Key", "warn");
        return;
      }

      appState.username = u;
      appState.key = k;
      localStorage.setItem("aio_user", u);
      localStorage.setItem("aio_key", k);
      checkConfiguration();
      closeModal("modalAioConfig");
      showToast(`Credentials saved for user: ${u}`, "safe");
      startAioPolling();
    });
  }

  // Clear Alerts
  const btnClearAlerts = document.getElementById("btnClearAlerts");
  if (btnClearAlerts) {
    btnClearAlerts.addEventListener("click", () => {
      appState.alerts = [];
      saveDatabase();
      renderAlertsList();
      updateAlertsBadge();
      showToast("Alerts log cleared.", "info");
    });
  }

  // Emergency Alert System Controls
  const btnTrigger = document.getElementById("btnTriggerEmergency");
  if (btnTrigger) {
    btnTrigger.addEventListener("click", triggerEmergencyAlert);
  }

  const btnStop = document.getElementById("btnStopAlarm");
  if (btnStop) {
    btnStop.addEventListener("click", stopAlarmSound);
  }

  const btnClear = document.getElementById("btnClearEmergency");
  if (btnClear) {
    btnClear.addEventListener("click", requestClearEmergency);
  }

  const btnConfirmClear = document.getElementById("btnConfirmClearAlert");
  if (btnConfirmClear) {
    btnConfirmClear.addEventListener("click", confirmClearEmergency);
  }
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add("active");
}

window.closeModal = function(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove("active");
};

window.triggerEmergencyAlert = triggerEmergencyAlert;
window.stopAlarmSound = stopAlarmSound;
window.requestClearEmergency = requestClearEmergency;
window.confirmClearEmergency = confirmClearEmergency;

// =========================================================================
// GLOBAL HELPERS EXPOSED TO WINDOW
// =========================================================================

window.viewWorkersInArea = function(areaName) {
  switchTab("workers");
  const searchInput = document.getElementById("workerSearchInput");
  if (searchInput) searchInput.value = areaName;
  renderWorkersList();
};

window.inspectArea = function(areaId) {
  const area = appState.areas.find(a => a.id === areaId);
  if (!area) return;

  const workersInside = appState.workers.filter(w => w.status === "IN" && w.area === area.name);

  const titleEl = document.getElementById("inspectAreaTitle");
  const bodyEl = document.getElementById("inspectAreaBody");

  if (titleEl) titleEl.textContent = `Area Details: ${area.name}`;
  if (bodyEl) {
    bodyEl.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border-subtle);">
        <div>
          <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Safety Status</span>
          <div style="font-weight: 800; font-size: 1.1rem; color: ${area.safetyStatus === "DANGER" ? "var(--color-danger)" : area.safetyStatus === "WARNING" ? "var(--color-warn)" : "var(--color-safe)"};">
            ${area.safetyStatus === "DANGER" ? "🔴 DANGER" : area.safetyStatus === "WARNING" ? "🟡 WARNING" : "🟢 SAFE"}
          </div>
        </div>
        <div style="text-align: right;">
          <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Workers Inside</span>
          <div style="font-weight: 800; font-size: 1.3rem; color: #fbbf24;">${workersInside.length}</div>
        </div>
      </div>

      <p style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 1rem;">${escapeHtml(area.description)}</p>

      <h5 style="font-size: 0.8125rem; font-weight: 700; color: #ffffff; margin-bottom: 0.5rem;">Personnel Currently in ${escapeHtml(area.name)}:</h5>
      ${workersInside.length === 0 ? `<div style="font-size: 0.8125rem; color: var(--text-muted);">No workers currently recorded inside this sector.</div>` : `
        <div style="display: flex; flex-direction: column; gap: 0.5rem; max-height: 220px; overflow-y: auto;">
          ${workersInside.map(w => `
            <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-app); padding: 0.5rem 0.75rem; border-radius: 0.375rem; border: 1px solid var(--border-subtle); font-size: 0.8125rem;">
              <div>
                <strong>${escapeHtml(w.name)}</strong>
                <span style="color: var(--text-muted); font-size: 0.7rem; margin-left: 0.5rem;">ID: ${escapeHtml(w.employeeId)}</span>
              </div>
              <span class="font-mono" style="font-size: 0.75rem; color: var(--color-safe);">Entry: ${w.entryTime}</span>
            </div>
          `).join("")}
        </div>
      `}

      <div style="margin-top: 1.25rem; padding-top: 0.75rem; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
        <button class="btn btn-secondary btn-sm" onclick="window.viewWorkersInArea('${escapeHtml(area.name)}'); closeModal('modalInspectArea');">
          Filter in Workers Tab
        </button>
        <button class="btn btn-danger btn-sm" onclick="window.triggerAreaEvacuation('${escapeHtml(area.name)}'); closeModal('modalInspectArea');">
          ⚠️ Trigger Evacuation
        </button>
      </div>
    `;
  }

  openModal("modalInspectArea");
};

window.triggerAreaEvacuation = function(areaName) {
  const targetArea = appState.areas.find(a => a.name === areaName);
  if (targetArea) {
    targetArea.safetyStatus = "DANGER";
  }
  addSystemAlert(
    "EMERGENCY EVACUATION",
    `🚨 Manual evacuation siren sounded for ${areaName}! All ${targetArea ? targetArea.workerCount : 0} personnel must immediately exit to the surface hoist.`,
    areaName,
    "DANGER"
  );
  evaluateMineSafetyStatus();
  renderDashboard();
  renderAreasList();
  showToast(`Evacuation broadcasted for ${areaName}!`, "danger");
};

window.simulateScanForWorker = function(rfidUid) {
  handleRfidScan(rfidUid);
};

window.deleteWorker = function(workerId) {
  if (!confirm("Are you sure you want to remove this worker from the system?")) return;
  appState.workers = appState.workers.filter(w => w.id !== workerId);
  recalculatePeopleCount();
  renderWorkersList();
  showToast("Worker removed.", "info");
};

/**
 * Presentation demonstration sequencer:
 * Allows college students to test-drive hazards during presentation
 */
function togglePresentationDemo() {
  appState.simulationActive = !appState.simulationActive;
  const btn = document.getElementById("btnDemoHazard");

  if (appState.simulationActive) {
    if (btn) btn.innerHTML = `<span>Stop Simulation</span>`;
    showToast("[DEMO] Injecting Gas Danger in Underground Zone B...", "danger");
    
    // Inject Hazard Telemetry
    appState.sensors.gas = 540;
    appState.sensors.temperature = 42.1;
    appState.sensors.flame = 1;
    appState.sensors.vibration = 1;
    appState.sensors.humidity = 78;

    addSystemAlert(
      "GAS DANGER ALERT",
      "Flammable gas concentration spiked (540 ADC >= 400). Optical flame detected in Underground Zone B.",
      "Underground Zone B",
      "DANGER"
    );

    evaluateMineSafetyStatus();
    renderSensorCards();
    renderAreasList();
  } else {
    if (btn) btn.innerHTML = `<span>⚡ Test Hazard Sim</span>`;
    showToast("[DEMO] Resetting to safe normal condition...", "safe");

    appState.sensors.gas = 145;
    appState.sensors.temperature = 31.8;
    appState.sensors.flame = 0;
    appState.sensors.vibration = 0;
    appState.sensors.humidity = 58;

    appState.areas.forEach(a => a.safetyStatus = "NORMAL");

    addSystemAlert(
      "SYSTEM NORMAL",
      "Mine atmosphere returned to safe baseline. Hazards cleared.",
      "All Areas",
      "NORMAL"
    );

    evaluateMineSafetyStatus();
    renderSensorCards();
    renderAreasList();
  }
}

// =========================================================================
// STORAGE & UTILITY
// =========================================================================
function saveDatabase() {
  localStorage.setItem("minesafe_areas", JSON.stringify(appState.areas));
  localStorage.setItem("minesafe_workers", JSON.stringify(appState.workers));
  localStorage.setItem("minesafe_alerts", JSON.stringify(appState.alerts));
}

function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.style.cssText = `
    background: #1e293b;
    border: 1px solid ${type === "danger" ? "var(--color-danger)" : type === "safe" ? "var(--color-safe)" : type === "warn" ? "var(--color-warn)" : "var(--border-medium)"};
    color: #ffffff;
    font-size: 0.8125rem;
    font-weight: 600;
    padding: 0.625rem 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    margin-bottom: 0.5rem;
    animation: fadeIn 0.2s ease-out;
  `;
  toast.textContent = message;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[m]));
}
