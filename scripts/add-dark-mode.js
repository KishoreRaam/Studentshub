const fs = require('fs');

function replaceAll(content, map) {
  for (const [key, val] of Object.entries(map)) {
    content = content.split(key).join(val);
  }
  return content;
}

// EventCreatorDashboard
let ecdPath = 'src/pages/EventCreatorDashboard.tsx';
let ecdContent = fs.readFileSync(ecdPath, 'utf8');

const ecdCSS = `:root {
  --ecd-bg: #f8f9fb;
  --ecd-surface: #ffffff;
  --ecd-border: rgba(0,0,0,0.08);
  --ecd-border-light: rgba(0,0,0,0.04);
  --ecd-text: #374151;
  --ecd-text-main: #030213;
  --ecd-text-muted: #6b7280;
  --ecd-text-light: #9ca3af;
  --ecd-card-bg: #ffffff;
  --ecd-nav-drawer: #ffffff;
  --ecd-primary: #1a56db;
  --ecd-nav-btn: #ffffff;
}
.dark {
  --ecd-bg: #0b0b0f;
  --ecd-surface: #16161b;
  --ecd-border: #2a2a32;
  --ecd-border-light: rgba(42,42,50,0.5);
  --ecd-text: #e5e5e5;
  --ecd-text-main: #fff;
  --ecd-text-muted: #8b8b95;
  --ecd-text-light: #55555f;
  --ecd-card-bg: #1c1c22;
  --ecd-nav-drawer: #16161b;
  --ecd-primary: #1a56db;
  --ecd-nav-btn: #16161b;
}`;

ecdContent = ecdContent.replace(/const responsiveCSS = `/, 'const responsiveCSS = `\\n' + ecdCSS);

const ecdMap = {
  "'#0b0b0f'": "'var(--ecd-bg)'",
  "'#16161b'": "'var(--ecd-surface)'",
  "'#2a2a32'": "'var(--ecd-border)'",
  "'rgba(42,42,50,0.5)'": "'var(--ecd-border-light)'",
  "'#e5e5e5'": "'var(--ecd-text)'",
  "'#fff'": "'var(--ecd-text-main)'",
  "'#8b8b95'": "'var(--ecd-text-muted)'",
  "'#55555f'": "'var(--ecd-text-light)'",
  "'#1c1c22'": "'var(--ecd-card-bg)'",
};

ecdContent = replaceAll(ecdContent, ecdMap);
fs.writeFileSync(ecdPath, ecdContent);
console.log('Updated EventCreatorDashboard.tsx');


// AdminEventsModeration
let admPath = 'src/pages/AdminEventsModeration.tsx';
let admContent = fs.readFileSync(admPath, 'utf8');

const admCSS = `:root {
  --adm-bg: #f8f9fb;
  --adm-surface: #ffffff;
  --adm-border: rgba(0,0,0,0.06);
  --adm-border-strong: rgba(0,0,0,0.08);
  --adm-border-light: rgba(0,0,0,0.04);
  --adm-text: #030213;
  --adm-text-sub: #374151;
  --adm-text-muted: #6b7280;
  --adm-text-light: #9ca3af;
  --adm-icon-bg: #eef2ff;
  --adm-hover: #f3f4f6;
  --adm-overlay: rgba(0,0,0,0.4);
  --adm-pending-bg: rgba(255,251,235,0.4);
}
.dark {
  --adm-bg: #0b0b0f;
  --adm-surface: #16161b;
  --adm-border: #2a2a32;
  --adm-border-strong: rgba(255,255,255,0.1);
  --adm-border-light: rgba(255,255,255,0.05);
  --adm-text: #ffffff;
  --adm-text-sub: #d1d5db;
  --adm-text-muted: #9ca3af;
  --adm-text-light: #6b7280;
  --adm-icon-bg: #1c1c22;
  --adm-hover: rgba(255,255,255,0.05);
  --adm-overlay: rgba(0,0,0,0.7);
  --adm-pending-bg: rgba(251,191,36,0.1);
}`;

admContent = admContent.replace(/const responsiveCSS = `/, 'const responsiveCSS = `\\n' + admCSS);

const admMap = {
  "'#f8f9fb'": "'var(--adm-bg)'",
  "'#fff'": "'var(--adm-surface)'",
  "'rgba(0,0,0,0.06)'": "'var(--adm-border)'",
  "'rgba(0,0,0,0.08)'": "'var(--adm-border-strong)'",
  "'rgba(0,0,0,0.04)'": "'var(--adm-border-light)'",
  "'#030213'": "'var(--adm-text)'",
  "'#374151'": "'var(--adm-text-sub)'",
  "'#6b7280'": "'var(--adm-text-muted)'",
  "'#9ca3af'": "'var(--adm-text-light)'",
  "'#eef2ff'": "'var(--adm-icon-bg)'",
  "'#f3f4f6'": "'var(--adm-hover)'",
  "'rgba(0,0,0,0.4)'": "'var(--adm-overlay)'",
  "'rgba(255,251,235,0.4)'": "'var(--adm-pending-bg)'"
};

admContent = replaceAll(admContent, admMap);
fs.writeFileSync(admPath, admContent);
console.log('Updated AdminEventsModeration.tsx');
