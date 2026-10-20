// M3 Expressive shape library, built as polygons with a fixed point count
// so CSS can morph between any two shapes via clip-path transitions.
const N = 96;
const SHAPES = {
  circle: () => 1,
  cookie4: t => 0.86 + 0.14 * Math.cos(4 * t),
  cookie6: t => 0.88 + 0.12 * Math.cos(6 * t),
  cookie9: t => 0.9 + 0.1 * Math.cos(9 * t),
  cookie12: t => 0.92 + 0.08 * Math.cos(12 * t),
  clover4: t => 0.62 + 0.38 * Math.abs(Math.cos(2 * t)) ** 0.6,
  clover8: t => 0.74 + 0.26 * Math.abs(Math.cos(4 * t)) ** 0.7,
  sunny: t => 0.86 + 0.14 * Math.sign(Math.cos(8 * t)) * Math.abs(Math.cos(8 * t)) ** 0.5,
  softburst: t => 0.84 + 0.16 * Math.cos(10 * t) ** 3,
  flower: t => 0.7 + 0.3 * Math.abs(Math.cos(2.5 * t)),
  pill: t => 1 / Math.max(Math.abs(Math.cos(t)) * 0.62, Math.abs(Math.sin(t)) * 1.0, 0.0001) ** 0.9 * 0.62,
};
function poly(name, rot = 0) {
  const f = SHAPES[name] || SHAPES.circle;
  const pts = [];
  let max = 0;
  const raw = [];
  for (let i = 0; i < N; i++) {
    const t = (i / N) * Math.PI * 2;
    const r = Math.min(f(t), 1.6);
    raw.push([t, r]);
    max = Math.max(max, r);
  }
  for (const [t, r] of raw) {
    const k = (r / max) * 50;
    pts.push(`${(50 + k * Math.cos(t + rot)).toFixed(2)}% ${(50 + k * Math.sin(t + rot)).toFixed(2)}%`);
  }
  return `polygon(${pts.join(',')})`;
}
function applyShape(el, name) {
  el.dataset.shape = name;
  el.style.clipPath = poly(name);
}
document.querySelectorAll('[data-shape]').forEach(el => applyShape(el, el.dataset.shape));




// Settings tour.
const TOUR = [
  { tab: 'Оформление', shape: 'cookie9', title: 'Оформление', text: 'Material 3 для ленты и нижней панели, свой акцентный цвет вместо розового, цвета телефона из обоев, шрифт и скругления карточек.',
    shots: ['01_oformlenie_material3', '02_oformlenie_elementy', '03_akcent_palitra', '04_redaktor_interfeisa_vhod'] },
  { tab: 'Лента', shape: 'clover4', title: 'Лента и видео', text: 'Скрытие рекламы и панелей ленты: LIVE, поиск, вкладки, описание. Смена региона, фильтр хештегов, скорость при удержании.',
    shots: ['05_lenta_i_video', '06_skrytie_paneley'] },
  { tab: 'Видео', shape: 'sunny', title: 'Видео и комментарии', text: 'Волнистая линия прогресса Material 3, дата под каждым видео в своём формате, стрелки вместо лайка и дизлайка в комментариях.',
    shots: ['07_video_volna_data', '08_komm_strelki', '23_komm_strelki_v_tiktok'] },
  { tab: 'Друзья и чаты', shape: 'cookie6', title: 'Друзья и чаты', text: 'Папки в личных сообщениях, своё название вместо «Входящие», автоматическое продление серий.',
    shots: ['09_druzya_i_chaty_papki', '24_vhodyashie', '25_papka_otkryta', '27_dialog_papki'] },
  { tab: 'Инструменты', shape: 'clover8', title: 'Инструменты', text: 'Скачивание без водяного знака с выбором качества, сохранение аватарок и стикеров, экспорт и импорт настроек.',
    shots: ['13_instrumenty'] },
  { tab: 'Плагины', shape: 'softburst', title: 'Плагины', text: 'Магазин плагинов .mtp прямо в настройках. Например, «Бейджи TikTokYou» — бейджики сапортеров.',
    shots: ['14_plaginy'] },
  { tab: 'Редактор', shape: 'flower', title: 'Редактор интерфейса', text: 'Откройте редактор и нажмите на любой элемент TikTok: скрыть, сдвинуть, изменить размер или цвет. Правки остаются.',
    shots: ['29_redaktor_vybor'] },
  { tab: 'О проекте', shape: 'cookie12', title: 'О проекте', text: 'Проверка и установка обновлений прямо из мода, ссылки на канал и исходники, благодарности.',
    shots: ['15_o_proekte'] },
];
const shot = n => `assets/shots/${n}.webp`;
const tabs = document.getElementById('tourTabs');
const screen = document.getElementById('tourScreen');
const thumbs = document.getElementById('tourThumbs');
const tShape = document.getElementById('tourShape');
const tTitle = document.getElementById('tourTitle');
const tText = document.getElementById('tourText');

function showShot(name) {
  const img = new Image();
  img.src = shot(name); img.alt = '';
  img.style.transition = 'none';
  img.classList.add('on');
  screen.replaceChildren(img);
  thumbs.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.n === name));
  screen.classList.toggle('light', !/^2[0-9]_/.test(name));
}
function selectTab(i) {
  const t = TOUR[i];
  tabs.querySelectorAll('button').forEach((b, j) => b.setAttribute('aria-selected', i === j));
  tShape.style.clipPath = poly(t.shape);
  for (const el of [tTitle, tText]) { el.classList.remove('fade'); void el.offsetWidth; el.classList.add('fade'); }
  tTitle.textContent = t.title;
  tText.textContent = t.text;
  thumbs.innerHTML = '';
  if (t.shots.length > 1) t.shots.forEach(n => {
    const b = document.createElement('button');
    b.dataset.n = n; b.setAttribute('aria-label', 'Показать скриншот');
    b.innerHTML = `<img src="${shot(n)}" alt="" loading="lazy">`;
    b.onclick = () => showShot(n);
    thumbs.appendChild(b);
  });
  showShot(t.shots[0]);
}
TOUR.forEach((t, i) => {
  const b = document.createElement('button');
  b.role = 'tab'; b.textContent = t.tab;
  b.onclick = () => selectTab(i);
  tabs.appendChild(b);
});
selectTab(0);


// Lightbox for any screenshot outside the phone frames.
const lb = document.getElementById('lightbox');
document.addEventListener('click', e => {
  const img = e.target.closest('img.cut');
  if (img) { lb.querySelector('img').src = img.src; lb.hidden = false; }
});
lb.onclick = () => { lb.hidden = true; };
addEventListener('keydown', e => { if (e.key === 'Escape') lb.hidden = true; });

// Reveal on scroll + active nav section.
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 70}ms`; io.observe(el); });

const navLinks = [...document.querySelectorAll('.navpill a')];
const navIO = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) navLinks.forEach(a => a.classList.toggle('active', a.hash === '#' + e.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
navLinks.forEach(a => { const s = document.querySelector(a.hash); if (s) navIO.observe(s); });

const topbar = document.querySelector('.topbar');
addEventListener('scroll', () => topbar.classList.toggle('scrolled', scrollY > 10), { passive: true });

// Theme toggle, remembering the choice.
const root = document.documentElement;
const saved = localStorage.getItem('theme');
if (saved) root.dataset.theme = saved;
else if (matchMedia('(prefers-color-scheme: dark)').matches) root.dataset.theme = 'dark';
document.getElementById('themeBtn').onclick = () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', root.dataset.theme);
};

// M3 wavy circular progress indicator.
document.querySelectorAll('.wavy path').forEach(p => {
  let d = '';
  for (let i = 0; i <= 200; i++) {
    const t = (i / 200) * Math.PI * 2, r = 18 + 1.6 * Math.sin(t * 10);
    d += `${i ? 'L' : 'M'}${(24 + r * Math.cos(t)).toFixed(2)} ${(24 + r * Math.sin(t)).toFixed(2)}`;
  }
  p.setAttribute('d', d);
});

document.addEventListener('dragstart', e => { if (e.target.tagName === 'IMG') e.preventDefault(); });

