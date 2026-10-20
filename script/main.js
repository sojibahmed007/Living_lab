/**
 * Living Lab — Fresh Grocery & Organic Store
 * Core Application Logic & State Management
 */

// --- Product Catalog Dataset ---
const PRODUCTS = [
    {
        id: 1,
        title: "Fresh Farm Red Onion",
        weight: "1 KG",
        price: 3.49,
        originalPrice: 4.50,
        category: "vegetables",
        image: "./c2-assets/onion.png",
        rating: 4.8,
        reviews: 142,
        badge: "Organic",
        description: "Pungent, sweet, and crisp farm-fresh red onions harvested daily from local eco-farms without any synthetic pesticides or chemicals."
    },
    {
        id: 2,
        title: "Vine-Ripened Fresh Tomato",
        weight: "1 KG",
        price: 2.99,
        originalPrice: 3.99,
        category: "vegetables",
        image: "./c2-assets/tomato.png",
        rating: 4.9,
        reviews: 210,
        badge: "Top Seller",
        description: "Juicy, deep-red vine tomatoes bursting with sweet tanginess. Naturally ripened under direct sunlight, rich in antioxidants and Vitamin C."
    },
    {
        id: 3,
        title: "Organic Dutch Baby Potato",
        weight: "1 KG",
        price: 2.49,
        originalPrice: 3.20,
        category: "vegetables",
        image: "./c2-assets/potato.png",
        rating: 4.7,
        reviews: 98,
        badge: "Daily Fresh",
        description: "Tender, thin-skinned baby potatoes grown in nutrient-dense organic soil. Fluffy when steamed, deliciously crispy when roasted."
    },
    {
        id: 4,
        title: "Daawat Rozana Super Basmati",
        weight: "5 KG",
        price: 14.99,
        originalPrice: 18.75,
        category: "rice",
        image: "./c2-assets/dawat-mock-up.png",
        rating: 4.9,
        reviews: 320,
        badge: "20% OFF",
        description: "Aromatic long-grain aged basmati rice by Daawat. Perfect for daily meals, aromatic biryani, pulao, and gourmet weekend feasting."
    },
    {
        id: 5,
        title: "India Gate Classic Feast Rice",
        weight: "5 KG",
        price: 18.99,
        originalPrice: 24.99,
        category: "rice",
        image: "./c2-assets/india-gate-mock-up.png",
        rating: 4.9,
        reviews: 450,
        badge: "World's No. 1",
        description: "World-renowned premium aged basmati rice pearls known for distinct aroma, exquisite grain elongation, and pearl-white non-sticky texture."
    },
    {
        id: 6,
        title: "Farm Harvest Vegetable Basket",
        weight: "5 KG Assorted",
        price: 15.99,
        originalPrice: 22.99,
        category: "combos",
        image: "./c2-assets/vegetable-offer.png",
        rating: 5.0,
        reviews: 180,
        badge: "30% OFF",
        description: "Curated chef selection containing organic onions, juicy tomatoes, farm potatoes, and seasonal herbs packed in an eco-friendly breathable crate."
    },
    {
        id: 7,
        title: "Country Red Onion Family Pack",
        weight: "3 KG Sack",
        price: 8.99,
        originalPrice: 11.50,
        category: "vegetables",
        image: "./c2-assets/onion.png",
        rating: 4.6,
        reviews: 85,
        badge: "Value Pack",
        description: "Economical family savings pack of farm-fresh pungent red onions. Ideal for hearty stews, traditional curries, and daily seasoning."
    },
    {
        id: 8,
        title: "Garden Plum Salad Tomatoes",
        weight: "1 KG",
        price: 3.99,
        originalPrice: 5.00,
        category: "vegetables",
        image: "./c2-assets/tomato.png",
        rating: 4.8,
        reviews: 112,
        badge: "Organic",
        description: "Firm, sweeter plum tomatoes with thick meat and minimal seeds. Perfect for Mediterranean salads, roasted pasta sauces, and fresh salsa."
    },
    {
        id: 9,
        title: "Golden Russet Potato Mega Sack",
        weight: "5 KG Sack",
        price: 9.99,
        originalPrice: 13.99,
        category: "vegetables",
        image: "./c2-assets/potato.png",
        rating: 4.7,
        reviews: 164,
        badge: "Bulk Saver",
        description: "Hand-graded golden potatoes cleaned and dried for long pantry shelf-life. High starch content for golden crispy fries and smooth mashed potatoes."
    }
];

// --- App State ---
const appState = {
    cart: JSON.parse(localStorage.getItem('livinglab_cart') || '[]'),
    wishlist: JSON.parse(localStorage.getItem('livinglab_wishlist') || '[]'),
    activeCategory: 'all',
    searchQuery: '',
    sortBy: 'default',
    discountPercent: Number(localStorage.getItem('livinglab_discount') || '0'),
    promoCode: localStorage.getItem('livinglab_promo') || null,
    currentQuickView: null,
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    setupEventListeners();
    setupModernDialogDismissal();
    startFlashSaleCountdown();
});

function initApp() {
    renderCart();
    renderWishlistBadge();
    applyProductFilters();
}

// --- Product Rendering & Filtering ---
function applyProductFilters() {
    let list = [...PRODUCTS];

    // Category Filter
    if (appState.activeCategory !== 'all') {
        list = list.filter(p => p.category === appState.activeCategory);
    }

    // Search Query Filter
    if (appState.searchQuery.trim() !== '') {
        const query = appState.searchQuery.toLowerCase();
        list = list.filter(p => 
            p.title.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query)
        );
    }

    // Sorting
    switch (appState.sortBy) {
        case 'price-low':
            list.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            list.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            list.sort((a, b) => b.rating - a.rating);
            break;
        default:
            // preserve default
            break;
    }

    renderProductGrid(list);
}

function renderProductGrid(items) {
    const container = document.getElementById('popularProductsGrid');
    if (!container) return;

    if (items.length === 0) {
        container.innerHTML = `
            <div class="col-span-full py-12 text-center">
                <div class="w-16 h-16 mx-auto mb-3 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl">
                    <i class="fa-solid fa-leaf"></i>
                </div>
                <h4 class="text-lg font-bold text-gray-800 mb-1">No groceries found</h4>
                <p class="text-xs text-gray-500 max-w-xs mx-auto mb-4">We couldn't find items matching your search. Try resetting filters.</p>
                <button onclick="resetProductFilters()" class="btn btn-sm btn-primary bg-green-600 hover:bg-green-700 text-white rounded-full px-6">
                    Show All Groceries
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = items.map(p => {
        const isWishlisted = appState.wishlist.includes(p.id);
        return `
            <div class="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-4 border border-gray-100 flex flex-col justify-between group relative">
                <!-- Badges Row -->
                <div class="flex justify-between items-center mb-2">
                    <span class="text-[11px] font-bold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full">
                        ${escapeHtml(p.badge)}
                    </span>
                    <button 
                        onclick="toggleWishlist(${p.id})" 
                        aria-label="Save to Wishlist"
                        class="text-gray-300 hover:text-red-500 transition-colors p-1">
                        <i class="${isWishlisted ? 'fa-solid fa-heart text-red-500 scale-110' : 'fa-regular fa-heart'} text-sm"></i>
                    </button>
                </div>

                <!-- Product Image -->
                <div class="h-28 sm:h-32 flex items-center justify-center p-2 rounded-xl bg-[#F8F5EF] mb-3 group-hover:scale-105 transition-transform duration-300 overflow-hidden cursor-pointer" onclick="openProductQuickView(${p.id})">
                    <img src="${p.image}" alt="${escapeHtml(p.title)}" class="max-h-full max-w-full object-contain drop-shadow-sm">
                </div>

                <!-- Content -->
                <div class="flex-grow flex flex-col justify-between">
                    <div>
                        <!-- Rating -->
                        <div class="flex items-center gap-1.5 text-xs text-amber-500 mb-1">
                            <i class="fa-solid fa-star text-amber-400 text-xs"></i>
                            <span class="font-bold text-gray-800">${p.rating}</span>
                            <span class="text-gray-400 font-normal">(${p.reviews})</span>
                            <span class="ml-auto text-[11px] text-gray-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium">${p.weight}</span>
                        </div>

                        <!-- Title -->
                        <h4 class="text-sm font-bold text-gray-800 line-clamp-1 hover:text-green-600 transition-colors cursor-pointer mb-1" onclick="openProductQuickView(${p.id})">
                            ${escapeHtml(p.title)}
                        </h4>
                    </div>

                    <!-- Price & Action -->
                    <div class="flex items-center justify-between pt-2 mt-2 border-t border-gray-100">
                        <div>
                            <span class="text-base font-extrabold text-green-700">$${p.price.toFixed(2)}</span>
                            <span class="text-xs text-gray-400 line-through ml-1">$${p.originalPrice.toFixed(2)}</span>
                        </div>
                        <div class="flex items-center gap-1">
                            <button 
                                onclick="openProductQuickView(${p.id})"
                                title="Quick View"
                                class="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center text-xs transition">
                                <i class="fa-regular fa-eye"></i>
                            </button>
                            <button 
                                onclick="addToCart(${p.id}, 1, true)"
                                title="Add to Cart"
                                class="w-8 h-8 rounded-lg bg-green-600 hover:bg-green-700 text-white flex items-center justify-center text-xs shadow-sm hover:shadow transition">
                                <i class="fa-solid fa-cart-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function filterCategory(category) {
    appState.activeCategory = category;
    
    // Update active tab buttons
    document.querySelectorAll('.cat-filter-btn').forEach(btn => {
        if (btn.getAttribute('data-cat') === category) {
            btn.classList.add('bg-green-600', 'text-white', 'shadow-md');
            btn.classList.remove('bg-white', 'text-gray-700', 'hover:bg-gray-100');
        } else {
            btn.classList.remove('bg-green-600', 'text-white', 'shadow-md');
            btn.classList.add('bg-white', 'text-gray-700', 'hover:bg-gray-100');
        }
    });

    applyProductFilters();
}

function resetProductFilters() {
    appState.activeCategory = 'all';
    appState.searchQuery = '';
    appState.sortBy = 'default';

    const searchInput = document.getElementById('grocerySearchInput');
    if (searchInput) searchInput.value = '';

    const sortSelect = document.getElementById('grocerySortSelect');
    if (sortSelect) sortSelect.value = 'default';

    filterCategory('all');
}

// --- Cart Operations ---
function addToCart(productId, quantity = 1, showToastNotification = true) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = appState.cart.findIndex(item => item.product.id === productId);
    if (existingIndex > -1) {
        appState.cart[existingIndex].quantity += quantity;
    } else {
        appState.cart.push({ product, quantity });
    }

    saveCart();
    renderCart();
    animateCartButton();

    if (showToastNotification) {
        showToast(`Added ${quantity}x "${truncateString(product.title, 22)}" to cart!`, 'success', 'fa-basket-shopping');
    }
}

function updateCartQty(productId, delta) {
    const index = appState.cart.findIndex(item => item.product.id === productId);
    if (index === -1) return;

    const newQty = appState.cart[index].quantity + delta;
    if (newQty <= 0) {
        removeFromCart(productId);
    } else {
        appState.cart[index].quantity = newQty;
        saveCart();
        renderCart();
    }
}

function removeFromCart(productId) {
    const index = appState.cart.findIndex(item => item.product.id === productId);
    if (index > -1) {
        const title = appState.cart[index].product.title;
        appState.cart.splice(index, 1);
        saveCart();
        renderCart();
        showToast(`Removed "${truncateString(title, 20)}" from cart`, 'info', 'fa-trash');
    }
}

function clearCart() {
    if (appState.cart.length === 0) return;
    if (confirm('Are you sure you want to clear your grocery cart?')) {
        appState.cart = [];
        appState.discountPercent = 0;
        appState.promoCode = null;
        localStorage.removeItem('livinglab_promo');
        localStorage.removeItem('livinglab_discount');
        saveCart();
        renderCart();
        showToast('Shopping cart cleared', 'info', 'fa-broom');
    }
}

function saveCart() {
    localStorage.setItem('livinglab_cart', JSON.stringify(appState.cart));
}

function renderCart() {
    const totalCount = appState.cart.reduce((sum, item) => sum + item.quantity, 0);
    const badges = document.querySelectorAll('.cart-badge-count');
    
    badges.forEach(b => {
        b.textContent = totalCount;
        if (totalCount > 0) {
            b.classList.remove('hidden');
        } else {
            b.classList.add('hidden');
        }
    });

    const itemsContainer = document.getElementById('cartDrawerItems');
    const emptyView = document.getElementById('cartDrawerEmpty');
    const footer = document.getElementById('cartDrawerFooter');

    if (!itemsContainer || !emptyView || !footer) return;

    if (appState.cart.length === 0) {
        itemsContainer.innerHTML = '';
        emptyView.classList.remove('hidden');
        footer.classList.add('hidden');
        return;
    }

    emptyView.classList.add('hidden');
    footer.classList.remove('hidden');

    // Totals calculations
    const subtotal = appState.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const discount = subtotal * (appState.discountPercent / 100);
    const shipping = subtotal >= 25 || subtotal === 0 ? 0 : 3.50;
    const finalTotal = Math.max(0, subtotal - discount + shipping);

    itemsContainer.innerHTML = appState.cart.map(item => `
        <div class="flex items-center gap-3 py-3 border-b border-gray-100 last:border-none">
            <div class="w-14 h-14 bg-[#F8F5EF] rounded-xl p-1.5 flex-shrink-0 flex items-center justify-center">
                <img src="${item.product.image}" alt="${escapeHtml(item.product.title)}" class="max-h-full max-w-full object-contain">
            </div>
            <div class="flex-grow min-w-0">
                <h5 class="text-xs font-bold text-gray-800 line-clamp-1 mb-0.5">${escapeHtml(item.product.title)}</h5>
                <p class="text-[11px] text-gray-500 mb-1.5">${item.product.weight} • $${item.product.price.toFixed(2)}</p>
                <div class="flex items-center gap-2">
                    <div class="flex items-center border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
                        <button onclick="updateCartQty(${item.product.id}, -1)" class="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-200">
                            <i class="fa-solid fa-minus text-[9px]"></i>
                        </button>
                        <span class="w-6 text-center text-xs font-bold text-gray-800">${item.quantity}</span>
                        <button onclick="updateCartQty(${item.product.id}, 1)" class="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-200">
                            <i class="fa-solid fa-plus text-[9px]"></i>
                        </button>
                    </div>
                    <button onclick="removeFromCart(${item.product.id})" class="text-xs text-red-500 hover:text-red-700 p-1">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </div>
            </div>
            <div class="text-right flex-shrink-0">
                <span class="text-xs font-bold text-green-700">$${(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
        </div>
    `).join('');

    // Summary texts
    document.getElementById('cartSubtotalDisplay').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cartDeliveryDisplay').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    document.getElementById('cartTotalDisplay').textContent = `$${finalTotal.toFixed(2)}`;

    const discountRow = document.getElementById('cartDiscountRow');
    if (discountRow) {
        if (appState.discountPercent > 0) {
            discountRow.classList.remove('hidden');
            document.getElementById('cartDiscountDisplay').textContent = `-$${discount.toFixed(2)} (${appState.discountPercent}%)`;
        } else {
            discountRow.classList.add('hidden');
        }
    }
}

function openCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    if (drawer) {
        drawer.classList.remove('hidden');
        setTimeout(() => {
            const panel = drawer.querySelector('.drawer-panel');
            if (panel) panel.classList.remove('translate-x-full');
        }, 10);
    }
}

function closeCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    if (drawer) {
        const panel = drawer.querySelector('.drawer-panel');
        if (panel) panel.classList.add('translate-x-full');
        setTimeout(() => drawer.classList.add('hidden'), 250);
    }
}

function animateCartButton() {
    const btns = document.querySelectorAll('.cart-nav-btn');
    btns.forEach(btn => {
        btn.classList.add('scale-125');
        setTimeout(() => btn.classList.remove('scale-125'), 300);
    });
}

// --- Coupon Logic ---
function applyCouponCode() {
    const input = document.getElementById('couponInput');
    if (!input) return;

    const code = input.value.trim().toUpperCase();
    if (!code) {
        showToast('Please enter a coupon code', 'warning', 'fa-tag');
        return;
    }

    if (code === 'FRESH20') {
        appState.discountPercent = 20;
        appState.promoCode = 'FRESH20';
        localStorage.setItem('livinglab_discount', '20');
        localStorage.setItem('livinglab_promo', 'FRESH20');
        renderCart();
        showToast('🎉 Coupon FRESH20 applied! 20% discount granted.', 'success', 'fa-percent');
    } else if (code === 'ORGANIC') {
        appState.discountPercent = 15;
        appState.promoCode = 'ORGANIC';
        localStorage.setItem('livinglab_discount', '15');
        localStorage.setItem('livinglab_promo', 'ORGANIC');
        renderCart();
        showToast('🎉 15% Organic discount applied!', 'success', 'fa-leaf');
    } else {
        showToast('Invalid coupon. Try using "FRESH20"', 'error', 'fa-circle-xmark');
    }
}

// --- Wishlist Management ---
function toggleWishlist(productId) {
    const index = appState.wishlist.indexOf(productId);
    const product = PRODUCTS.find(p => p.id === productId);
    const title = product ? product.title : 'Product';

    if (index > -1) {
        appState.wishlist.splice(index, 1);
        showToast(`Removed "${truncateString(title, 20)}" from Wishlist`, 'info', 'fa-heart');
    } else {
        appState.wishlist.push(productId);
        showToast(`Saved "${truncateString(title, 20)}" to Wishlist!`, 'success', 'fa-heart');
    }

    localStorage.setItem('livinglab_wishlist', JSON.stringify(appState.wishlist));
    renderWishlistBadge();
    applyProductFilters();
    renderWishlistModal();
}

function renderWishlistBadge() {
    const badges = document.querySelectorAll('.wishlist-badge-count');
    badges.forEach(b => {
        b.textContent = appState.wishlist.length;
        if (appState.wishlist.length > 0) {
            b.classList.remove('hidden');
        } else {
            b.classList.add('hidden');
        }
    });
}

function openWishlistModal() {
    renderWishlistModal();
    const modal = document.getElementById('wishlistModal');
    if (modal) modal.showModal();
}

function renderWishlistModal() {
    const container = document.getElementById('wishlistItemsContainer');
    if (!container) return;

    if (appState.wishlist.length === 0) {
        container.innerHTML = `
            <div class="py-10 text-center">
                <div class="w-14 h-14 mx-auto mb-3 bg-red-50 text-red-400 rounded-full flex items-center justify-center text-xl">
                    <i class="fa-regular fa-heart"></i>
                </div>
                <h4 class="font-bold text-gray-800 text-sm mb-1">Your wishlist is empty</h4>
                <p class="text-xs text-gray-500 max-w-xs mx-auto mb-4">Click the heart icon on any grocery item to save it for later.</p>
            </div>
        `;
        return;
    }

    const items = PRODUCTS.filter(p => appState.wishlist.includes(p.id));

    container.innerHTML = items.map(p => `
        <div class="flex items-center gap-3 py-3 border-b border-gray-100 last:border-none">
            <div class="w-14 h-14 bg-[#F8F5EF] rounded-xl p-1.5 flex-shrink-0 flex items-center justify-center">
                <img src="${p.image}" alt="${escapeHtml(p.title)}" class="max-h-full max-w-full object-contain">
            </div>
            <div class="flex-grow min-w-0">
                <h5 class="text-xs font-bold text-gray-800 line-clamp-1 mb-0.5">${escapeHtml(p.title)}</h5>
                <span class="text-xs font-extrabold text-green-700">$${p.price.toFixed(2)}</span>
            </div>
            <div class="flex items-center gap-1.5">
                <button onclick="addToCart(${p.id}, 1, true); toggleWishlist(${p.id});" class="btn btn-xs bg-green-600 hover:bg-green-700 text-white rounded-lg">
                    <i class="fa-solid fa-cart-plus mr-1"></i> Add to Cart
                </button>
                <button onclick="toggleWishlist(${p.id})" class="btn btn-ghost btn-xs text-red-500">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// --- Quick View Modal (<dialog>) ---
function openProductQuickView(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    appState.currentQuickView = product;
    const dialog = document.getElementById('productQuickViewModal');
    const content = document.getElementById('quickViewContent');
    if (!dialog || !content) return;

    content.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <!-- Image Area -->
            <div class="bg-[#F8F5EF] p-8 rounded-2xl flex items-center justify-center h-64">
                <img src="${product.image}" alt="${escapeHtml(product.title)}" class="max-h-52 object-contain hover:scale-105 transition-transform duration-300 drop-shadow">
            </div>

            <!-- Details Area -->
            <div class="text-left space-y-3">
                <div class="flex items-center justify-between">
                    <span class="badge badge-sm font-bold bg-green-100 text-green-700 border-none uppercase text-[10px]">
                        ${escapeHtml(product.badge)}
                    </span>
                    <div class="flex items-center gap-1 text-amber-500 text-xs font-bold">
                        <i class="fa-solid fa-star text-amber-400"></i>
                        <span>${product.rating}</span>
                        <span class="text-gray-400 font-normal">(${product.reviews} reviews)</span>
                    </div>
                </div>

                <h3 class="text-xl font-extrabold text-gray-900 leading-snug">${escapeHtml(product.title)}</h3>
                <p class="text-xs text-gray-500 leading-relaxed">${escapeHtml(product.description)}</p>

                <div class="flex items-baseline gap-2 py-1">
                    <span class="text-2xl font-extrabold text-green-700">$${product.price.toFixed(2)}</span>
                    <span class="text-sm text-gray-400 line-through">$${product.originalPrice.toFixed(2)}</span>
                    <span class="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">Save $${(product.originalPrice - product.price).toFixed(2)}</span>
                </div>

                <div class="pt-2 flex items-center gap-3">
                    <button onclick="addToCart(${product.id}, 1, true); document.getElementById('productQuickViewModal').close();" class="btn btn-primary bg-green-600 hover:bg-green-700 border-none text-white flex-1 rounded-xl shadow-md">
                        <i class="fa-solid fa-basket-shopping mr-2"></i> Add to Cart
                    </button>
                    <button onclick="toggleWishlist(${product.id})" class="btn btn-outline border-gray-300 hover:bg-gray-100 text-gray-700 rounded-xl px-4">
                        <i class="${appState.wishlist.includes(product.id) ? 'fa-solid fa-heart text-red-500' : 'fa-regular fa-heart'}"></i>
                    </button>
                </div>

                <div class="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                    <span><i class="fa-solid fa-truck-fast text-green-600 mr-1"></i> Delivery in 30 Mins</span>
                    <span><i class="fa-solid fa-shield-check text-green-600 mr-1"></i> 100% Organic Certified</span>
                </div>
            </div>
        </div>
    `;

    dialog.showModal();
}

// --- Checkout Modal ---
function openCheckoutModal() {
    if (appState.cart.length === 0) {
        showToast('Your cart is empty!', 'warning', 'fa-basket-shopping');
        return;
    }

    closeCartDrawer();
    const dialog = document.getElementById('checkoutModal');
    if (!dialog) return;

    // Reset steps
    document.getElementById('checkoutFormStep').classList.remove('hidden');
    document.getElementById('checkoutSuccessStep').classList.add('hidden');

    const subtotal = appState.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const discount = subtotal * (appState.discountPercent / 100);
    const shipping = subtotal >= 25 ? 0 : 3.50;
    const finalTotal = Math.max(0, subtotal - discount + shipping);

    const summaryBox = document.getElementById('checkoutItemsSummary');
    if (summaryBox) {
        summaryBox.innerHTML = appState.cart.map(i => `
            <div class="flex justify-between text-xs py-1 text-gray-600">
                <span class="line-clamp-1 max-w-[200px]">${i.quantity}x ${escapeHtml(i.product.title)}</span>
                <span class="font-bold text-gray-900">$${(i.product.price * i.quantity).toFixed(2)}</span>
            </div>
        `).join('');
    }

    document.getElementById('checkoutTotalAmount').textContent = `$${finalTotal.toFixed(2)}`;
    dialog.showModal();
}

function processCheckoutOrder(e) {
    e.preventDefault();
    const btn = document.getElementById('confirmOrderBtn');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<span class="loading loading-spinner loading-xs mr-2"></span> Placing Order...`;
    }

    setTimeout(() => {
        const orderId = 'LL-' + Math.floor(100000 + Math.random() * 900000);
        document.getElementById('generatedOrderId').textContent = orderId;

        document.getElementById('checkoutFormStep').classList.add('hidden');
        document.getElementById('checkoutSuccessStep').classList.remove('hidden');

        // Reset cart
        appState.cart = [];
        appState.discountPercent = 0;
        appState.promoCode = null;
        localStorage.removeItem('livinglab_promo');
        localStorage.removeItem('livinglab_discount');
        saveCart();
        renderCart();

        if (btn) {
            btn.disabled = false;
            btn.innerHTML = `<i class="fa-solid fa-lock mr-2"></i> Confirm Grocery Order`;
        }
    }, 1100);
}

// --- Auth Modal (Login / Register) ---
function openAuthModal(mode = 'login') {
    const dialog = document.getElementById('authModal');
    if (!dialog) return;

    switchAuthTab(mode);
    dialog.showModal();
}

function switchAuthTab(tab) {
    const loginForm = document.getElementById('authLoginForm');
    const registerForm = document.getElementById('authRegisterForm');
    const loginTabBtn = document.getElementById('loginTabBtn');
    const registerTabBtn = document.getElementById('registerTabBtn');

    if (tab === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        loginTabBtn.classList.add('border-green-600', 'text-green-700', 'font-bold');
        loginTabBtn.classList.remove('text-gray-500');
        registerTabBtn.classList.remove('border-green-600', 'text-green-700', 'font-bold');
        registerTabBtn.classList.add('text-gray-500');
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        registerTabBtn.classList.add('border-green-600', 'text-green-700', 'font-bold');
        registerTabBtn.classList.remove('text-gray-500');
        loginTabBtn.classList.remove('border-green-600', 'text-green-700', 'font-bold');
        loginTabBtn.classList.add('text-gray-500');
    }
}

function handleAuthSubmit(e, type) {
    e.preventDefault();
    document.getElementById('authModal').close();
    showToast(type === 'login' ? 'Welcome back! Logged in successfully.' : 'Registration successful! Welcome to Living Lab.', 'success', 'fa-circle-check');
}

// --- Modern Web Guidance: Dialog Light-Dismiss Fallback ---
function setupModernDialogDismissal() {
    const dialogs = document.querySelectorAll('dialog');
    dialogs.forEach(dialog => {
        // Fallback for browsers without native closedby support
        if (!('closedBy' in HTMLDialogElement.prototype)) {
            dialog.addEventListener('click', (event) => {
                if (event.target !== dialog) return;
                const rect = dialog.getBoundingClientRect();
                const isDialogContent = (
                    rect.top <= event.clientY &&
                    event.clientY <= rect.top + rect.height &&
                    rect.left <= event.clientX &&
                    event.clientX <= rect.left + rect.width
                );
                if (isDialogContent) return;
                dialog.close();
            });
        }
    });
}

// --- Live Flash Sale Countdown Timer ---
function startFlashSaleCountdown() {
    const hoursEl = document.getElementById('saleHours');
    const minsEl = document.getElementById('saleMinutes');
    const secsEl = document.getElementById('saleSeconds');
    if (!hoursEl || !minsEl || !secsEl) return;

    let totalSeconds = 11 * 3600 + 45 * 60 + 20;

    setInterval(() => {
        totalSeconds = Math.max(0, totalSeconds - 1);
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;

        hoursEl.textContent = String(h).padStart(2, '0');
        minsEl.textContent = String(m).padStart(2, '0');
        secsEl.textContent = String(s).padStart(2, '0');
    }, 1000);
}

// --- Floating Toast Notifications ---
function showToast(message, type = 'info', iconClass = 'fa-circle-info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const colors = {
        success: 'bg-emerald-600 text-white',
        error: 'bg-rose-600 text-white',
        warning: 'bg-amber-500 text-white',
        info: 'bg-green-700 text-white'
    };

    const toast = document.createElement('div');
    toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl ${colors[type] || colors.info} text-xs font-semibold transition-all duration-300 transform translate-y-4 opacity-0`;
    toast.innerHTML = `
        <i class="fa-solid ${iconClass} text-base flex-shrink-0"></i>
        <span class="flex-grow">${escapeHtml(message)}</span>
        <button onclick="this.parentElement.remove()" class="opacity-70 hover:opacity-100 ml-2 transition">
            <i class="fa-solid fa-xmark text-xs"></i>
        </button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('translate-y-4', 'opacity-0');
    }, 10);

    setTimeout(() => {
        toast.classList.add('translate-y-4', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

// --- Event Listeners Setup ---
function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('grocerySearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            appState.searchQuery = e.target.value;
            applyProductFilters();
        });
    }

    // Sort select
    const sortSelect = document.getElementById('grocerySortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            appState.sortBy = e.target.value;
            applyProductFilters();
        });
    }

    // Newsletter subscription form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                showToast(`🎉 Subscribed! Use promo code "FRESH20" for 20% off your order.`, 'success', 'fa-envelope-open-text');
                emailInput.value = '';
            }
        });
    }
}

// --- Utilities ---
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function truncateString(str, max = 22) {
    if (!str) return '';
    return str.length > max ? str.slice(0, max) + '...' : str;
}
