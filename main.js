const products = [
  {
    id: 1,
    name: "Camiseta Básica",
    price: 39.9,
    category: "roupas",
    img: "https://i.pinimg.com/736x/12/43/2b/12432bc3ccf985e136bbfbd8a84f862f.jpg",
    desc: "Camiseta confortável para uso diário.",
  },
  {
    id: 2,
    name: "Fone Bluetooth",
    price: 129.9,
    category: "eletronicos",
    img: "https://i.pinimg.com/736x/38/a1/b8/38a1b8e5dcc5cebd2c1f80c0124b286e.jpg",
    desc: "Som nítido e bateria duradoura.",
  },
  {
    id: 3,
    name: "Relógio Esportivo",
    price: 199.0,
    category: "acessorios",
    img: "https://i.pinimg.com/1200x/59/17/7a/59177ae93f4de488238678b234d63882.jpg",
    desc: "Resistente e com cronômetro.",
  },
  {
    id: 4,
    name: "Calça Jeans",
    price: 149.5,
    category: "roupas",
    img: "https://i.pinimg.com/736x/d7/1f/36/d71f364eda6bb4dd16b469f384bc7781.jpg",
    desc: "Conforto e estilo.",
  },
  {
    id: 5,
    name: "Carregador USB-C",
    price: 59.0,
    category: "eletronicos",
    img: "https://i.pinimg.com/1200x/97/f1/c8/97f1c8c2569f7d3a632dd9350d226355.jpg",
    desc: "Carga rápida para seus aparelhos.",
  },
  {
    id: 6,
    name: "Boné Casual",
    price: 49.9,
    category: "acessorios",
    img: "https://i.pinimg.com/1200x/a4/15/61/a415617218dc5273f8c2260d905cecd0.jpg",
    desc: "Proteção com estilo.",
  },
];

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

let cart = JSON.parse(localStorage.getItem("cart_demo") || "{}");

function saveCart() {
  localStorage.setItem("cart_demo", JSON.stringify(cart));
}

function renderProducts(list) {
  const wrap = $("#products");
  wrap.innerHTML = "";
  list.forEach((p) => {
    const div = document.createElement("article");
    div.className = "product";
    div.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h4>${p.name}</h4>
      <div class="meta">${p.category}</div>
      <div class="price">R$ ${p.price.toFixed(2)}</div>
      <div class="actions">
        <button class="view" data-id="${p.id}">Ver</button>
        <button class="add" data-id="${p.id}">Adicionar</button>
      </div>
    `;
    wrap.appendChild(div);
  });
}

function openModal(content) {
  $("#modal-body").innerHTML = content;
  $("#product-modal").classList.remove("hidden");
}

function closeModal() {
  $("#product-modal").classList.add("hidden");
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  updateCartUI();
}

function removeFromCart(id) {
  delete cart[id];
  saveCart();
  updateCartUI();
}

function changeQty(id, qty) {
  if (qty <= 0) {
    removeFromCart(id);
    return;
  }
  cart[id] = qty;
  saveCart();
  updateCartUI();
}

function updateCartUI() {
  const itemsWrap = $("#cart-items");
  itemsWrap.innerHTML = "";
  let total = 0,
    count = 0;
  for (const id in cart) {
    const p = products.find((x) => x.id == id);
    const qty = cart[id];
    if (!p) continue;
    total += p.price * qty;
    count += qty;
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${p.img}">
      <div style="flex:1">
        <div>${p.name}</div>
        <div class="muted">R$ ${p.price.toFixed(2)}</div>
        <div style="margin-top:6px">
          <input type="number" min="0" value="${qty}" data-id="${id}" style="width:64px"> 
          <button data-remove="${id}">Remover</button>
        </div>
      </div>
    `;
    itemsWrap.appendChild(div);
  }
  $("#cart-total").textContent = total.toFixed(2);
  $("#cart-count").textContent = count;
}

function openCart() {
  $("#cart").classList.add("open");
}
function closeCart() {
  $("#cart").classList.remove("open");
}

function applyFilters() {
  const q = $("#search").value.trim().toLowerCase();
  const cat = $("#category-filter").value;
  const price = $("#price-filter").value;
  let list = products.filter((p) => {
    if (cat !== "all" && p.category !== cat) return false;
    if (
      q &&
      !(p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q))
    )
      return false;
    if (price !== "all") {
      const [min, max] = price.split("-").map(Number);
      if (p.price < min || p.price > max) return false;
    }
    return true;
  });

  const sort = $("#sort").value;
  if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
  if (sort === "name-asc") list.sort((a, b) => a.name.localeCompare(b.name));

  renderProducts(list);
}

document.addEventListener("click", (e) => {
  if (e.target.matches(".add")) addToCart(e.target.dataset.id);
  if (e.target.matches(".view")) {
    const id = e.target.dataset.id;
    const p = products.find((x) => x.id == id);
    openModal(
      `<h2>${p.name}</h2><img src="${
        p.img
      }" style="width:100%;height:220px;object-fit:cover"><p>${
        p.desc
      }</p><p class=\"price\">R$ ${p.price.toFixed(
        2
      )}</p><button id=\"modal-add\" data-id=\"${
        p.id
      }\">Adicionar ao carrinho</button>`
    );
  }
  if (e.target.id === "modal-add") {
    addToCart(e.target.dataset.id);
    closeModal();
  }
  if (e.target.id === "cart-btn") openCart();
  if (e.target.id === "close-cart") closeCart();
  if (e.target.id === "clear-cart") {
    cart = {};
    saveCart();
    updateCartUI();
  }
  if (e.target.dataset.remove) removeFromCart(e.target.dataset.remove);
  if (e.target.id === "close-modal") closeModal();
});

document.addEventListener("change", (e) => {
  if (e.target.matches(".cart-item input")) {
    changeQty(e.target.dataset.id, Number(e.target.value));
  }
});

["#search", "#category-filter", "#price-filter", "#sort"].forEach((sel) => {
  document.querySelector(sel).addEventListener("input", applyFilters);
  document.querySelector(sel).addEventListener("change", applyFilters);
});

// init
renderProducts(products);
updateCartUI();
