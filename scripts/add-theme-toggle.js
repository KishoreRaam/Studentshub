const fs = require('fs');

let p1 = 'src/pages/EventCreatorDashboard.tsx';
let c1 = fs.readFileSync(p1, 'utf8');

if (!c1.includes('ThemeToggle')) {
    c1 = c1.replace(
        /\} from 'lucide-react';/,
        `} from 'lucide-react';\nimport { ThemeToggle } from '../components/ThemeToggle';`
    );
    c1 = c1.replace(
        /<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>\s*<button style={{ width: 36, height: 36/,
        `<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>\n          <ThemeToggle />\n          <button style={{ width: 36, height: 36`
    );
    fs.writeFileSync(p1, c1);
    console.log('p1 updated');
} else {
    console.log('p1 already has ThemeToggle');
}

let p2 = 'src/pages/AdminEventsModeration.tsx';
let c2 = fs.readFileSync(p2, 'utf8');

if (!c2.includes('ThemeToggle')) {
    c2 = c2.replace(
        /\} from 'lucide-react';/,
        `} from 'lucide-react';\nimport { ThemeToggle } from '../components/ThemeToggle';`
    );
    c2 = c2.replace(
        /<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>\s*\{stats\.pending > 0 && \(/,
        `<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>\n          <ThemeToggle />\n          {stats.pending > 0 && (`
    );
    fs.writeFileSync(p2, c2);
    console.log('p2 updated');
} else {
    console.log('p2 already has ThemeToggle');
}
