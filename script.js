/* ===== Ash Beauty Services ===== */

/* ---------- Settings you can edit ---------- */
const WHATSAPP_NUMBER = "6792359716"; // 679 (Fiji) + 2359716

const GROUPS = [
  { title: "Nails", items: [
    { n: "Gel Polish",     p: 10, i: "💅" },
    { n: "Nail Extension", p: 25, i: "✨" },
    { n: "Nail Acrylics",  p: 35, i: "💎" },
    { n: "French Tip",     p: 20, i: "🤍" },
    { n: "Manicure",       p: 20, i: "🖐️" },
    { n: "Pedicure",       p: 25, i: "🦶" }
  ]},
  { title: "Face and lashes", items: [
    { n: "Facial",                  p: 20, i: "🧖‍♀️" },
    { n: "Cluster Lash Extensions", p: 15, i: "👁️", note: "Lasts about 2 weeks" }
  ]},
  { title: "Hair removal", items: [
    { n: "Waxing",    p: 5, i: "🌸" },
    { n: "Threading", p: 3, i: "🧵" }
  ]}
];

/* Photos come from images.js (built in, so they always load).
   To add your own later, put image files in an "images" folder and add them here, e.g.
   { src: "images/my-photo.jpg", cap: "Gel polish" }
   If a file is missing, that photo is simply hidden, so there is never a broken image. */
const EXTRA_PHOTOS = [
  // { src: "images/photo1.jpg", cap: "Nails" },
];

/* ---------- Helpers ---------- */
const $ = (s, el = document) => el.querySelector(s);
const ALL = GROUPS.flatMap(g => g.items);
const selected = new Set();
const money = n => "F$" + n;

/* ---------- Hero photos ---------- */
$("#h1").src = IMG.nails;
$("#h2").src = IMG.lashes;
$("#h3").src = IMG.facial;
$("#h4").src = IMG.french;

/* ---------- Mobile menu ---------- */
const menuBtn = $("#menuBtn"), nav = $("#nav");
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
nav.addEventListener("click", e => {
  if (e.target.tagName === "A") { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", false); }
});

/* ---------- Services ---------- */
const groupsEl = $("#serviceGroups");
GROUPS.forEach(g => {
  const wrap = document.createElement("div");
  wrap.className = "group";
  wrap.innerHTML = `<h3>${g.title}</h3><div class="cards"></div>`;
  const cards = $(".cards", wrap);
  g.items.forEach(s => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="ico" aria-hidden="true">${s.i}</div>
      <div class="info">
        <div class="nm">${s.n}</div>
        ${s.note ? `<span class="nt">${s.note}</span>` : ""}
        <span class="price">${money(s.p)}</span>
      </div>
      <button type="button" class="add" data-n="${s.n}">Add</button>`;
    cards.appendChild(card);
  });
  groupsEl.appendChild(wrap);
});

/* Chips in booking form */
const chipsEl = $("#chips");
ALL.forEach(s => {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "chip";
  b.dataset.n = s.n;
  b.setAttribute("aria-pressed", "false");
  b.innerHTML = `${s.n}<small>${money(s.p)}</small>`;
  chipsEl.appendChild(b);
});

function toggle(name, force) {
  const on = force !== undefined ? force : !selected.has(name);
  on ? selected.add(name) : selected.delete(name);
  render();
}
function render() {
  document.querySelectorAll(".chip").forEach(c => {
    const on = selected.has(c.dataset.n);
    c.classList.toggle("on", on); c.setAttribute("aria-pressed", on);
  });
  document.querySelectorAll(".add").forEach(a => {
    const on = selected.has(a.dataset.n);
    a.classList.toggle("on", on); a.textContent = on ? "Added ✓" : "Add";
  });
  const chosen = ALL.filter(s => selected.has(s.n));
  $("#sumList").innerHTML = chosen.length
    ? chosen.map(s => `<li><span>${s.n}</span><span>${money(s.p)}</span></li>`).join("")
    : `<li class="empty">No services chosen yet.</li>`;
  $("#sumTotal").textContent = money(chosen.reduce((a, s) => a + s.p, 0));
}
groupsEl.addEventListener("click", e => {
  const b = e.target.closest(".add"); if (b) toggle(b.dataset.n);
});
chipsEl.addEventListener("click", e => {
  const b = e.target.closest(".chip"); if (b) toggle(b.dataset.n);
});
render();

/* ---------- Gallery + lightbox ---------- */
const PHOTOS = [
  { src: IMG.nails,  cap: "Pink nails with crystals" },
  { src: IMG.lashes, cap: "Lash extensions" },
  { src: IMG.facial, cap: "Relaxing facial" },
  { src: IMG.french, cap: "French tip" },
  { src: IMG.feet,   cap: "Pedicure" },
  { src: IMG.flyer,  cap: "Our price list" },
  ...EXTRA_PHOTOS
];
const gal = $("#gal");
const shown = [];
PHOTOS.forEach(p => {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.setAttribute("aria-label", "Open photo: " + p.cap);
  const img = new Image();
  img.alt = p.cap; img.loading = "lazy"; img.src = p.src;
  img.onerror = () => { p.failed = true; btn.remove(); };          // missing image? hide it, no error icon
  btn.append(img);
  btn.insertAdjacentHTML("beforeend", `<span class="cap">${p.cap}</span>`);
  btn.addEventListener("click", () => open(p));
  gal.appendChild(btn);
});

const lb = $("#lb"), lbImg = $("#lbImg");
let cur = null;
const list = () => PHOTOS.filter(p => !p.failed);
function open(p) { cur = p; lbImg.src = p.src; lbImg.alt = p.cap; lb.classList.add("open"); lb.setAttribute("aria-hidden", "false"); }
function close() { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); }
function step(d) { const l = list(); open(l[(l.indexOf(cur) + d + l.length) % l.length]); }
$("#lbClose").onclick = close;
$("#lbPrev").onclick = () => step(-1);
$("#lbNext").onclick = () => step(1);
lb.addEventListener("click", e => { if (e.target === lb) close(); });
document.addEventListener("keydown", e => {
  if (!lb.classList.contains("open")) return;
  if (e.key === "Escape") close();
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "ArrowRight") step(1);
});

/* ---------- Booking ---------- */
const dateEl = $("#date");
const t = new Date(); t.setMinutes(t.getMinutes() - t.getTimezoneOffset());
dateEl.min = t.toISOString().slice(0, 10);

const whereEl = $("#where"), addrLabel = $("#addrLabel");
function updateAddr() {
  addrLabel.textContent = whereEl.value === "Home service"
    ? "Your address or landmark (needed for home service)" : "Address or landmark (optional)";
}
whereEl.addEventListener("change", updateAddr); updateAddr();

const waBase = "https://wa.me/" + WHATSAPP_NUMBER;
$("#waFloat").href = waBase + "?text=" + encodeURIComponent("Hi Ash, I would like to know more about your services.");
$("#waLink").href = waBase;

$("#bookForm").addEventListener("submit", e => {
  e.preventDefault();
  const v = id => document.getElementById(id).value.trim();
  const err = $("#err");
  const chosen = ALL.filter(s => selected.has(s.n));

  if (!chosen.length) return fail("Please choose at least one service.");
  if (!v("date") || !v("time")) return fail("Please choose a date and time.");
  if (whereEl.value === "Home service" && !v("address")) return fail("Please add your address or a landmark for home service.");
  if (!v("name")) return fail("Please enter your name.");
  if (v("phone").replace(/\D/g, "").length < 6) return fail("Please enter a valid phone number.");
  err.textContent = "";

  const total = chosen.reduce((a, s) => a + s.p, 0);
  const d = new Date(v("date") + "T00:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const msg =
`Hi Ash, I would like to book an appointment.

Name: ${v("name")}
Phone: ${v("phone")}

Services:
${chosen.map(s => "- " + s.n + " (" + money(s.p) + ")").join("\n")}
Estimated total: ${money(total)}

Date: ${d}
Time: ${v("time")}
Area: ${v("area")}
Service type: ${whereEl.value}
Address: ${v("address") || "-"}
Notes: ${v("notes") || "-"}`;

  window.open(waBase + "?text=" + encodeURIComponent(msg), "_blank", "noopener");

  function fail(m) { err.textContent = m; }
});
