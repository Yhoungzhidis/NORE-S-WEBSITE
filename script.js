// Products Data
const products = [
    {
      id: 1,
      name: "Paracetamol Extra Strength",
      description:
        "Fast-acting pain relief for headaches, muscle aches, and fever reduction. Each tablet contains 500mg of paracetamol.",
      price: 5.99,
      category: "Pain Relief",
      image: "images/products/paracetamol.png",
    },
    {
      id: 2,
      name: "Vitamin C Complex",
      description: "Immune support supplement with 1000mg of Vitamin C plus zinc and elderberry extract.",
      price: 12.5,
      category: "Supplements",
      image: "images/products/vitamin-c.png",
    },
    {
      id: 3,
      name: "Allergy Relief Tablets",
      description: "24-hour non-drowsy relief from seasonal allergies and hay fever symptoms.",
      price: 8.75,
      category: "Allergy",
      image: "images/products/allergy.png",
    },
    {
      id: 4,
      name: "First Aid Kit - Basic",
      description:
        "Essential first aid supplies for home, office, or travel. Includes bandages, antiseptic wipes, and more.",
      price: 15.99,
      category: "First Aid",
      image: "images/products/first-aid.png",
    },
    {
      id: 5,
      name: "Digital Thermometer",
      description: "Fast and accurate temperature readings with digital display. Suitable for all ages.",
      price: 9.99,
      category: "Medical Devices",
      image: "images/products/thermometer.png",
    },
    {
      id: 6,
      name: "Cough Syrup - Honey & Lemon",
      description: "Soothes throat irritation and suppresses cough with natural honey and lemon extracts.",
      price: 7.25,
      category: "Cold & Flu",
      image: "images/products/cough-syrup.png",
    },
    {
      id: 7,
      name: "Multivitamin Daily",
      description: "Complete daily nutrition with essential vitamins and minerals for adults.",
      price: 14.5,
      category: "Supplements",
      image: "images/products/multivitamin.png",
    },
    {
      id: 8,
      name: "Hand Sanitizer - 250ml",
      description: "Kills 99.9% of germs without water. Contains moisturizers to prevent skin dryness.",
      price: 3.99,
      category: "Personal Care",
      image: "images/products/hand-sanitizer.png",
    },
    {
      id: 9,
      name: "Blood Pressure Monitor",
      description: "Automatic digital blood pressure monitor for home use with memory function.",
      price: 45.99,
      category: "Medical Devices",
      image: "images/products/bp-monitor.png",
    },
  ]
  
  // DOM Elements
  const menuToggle = document.getElementById("menuToggle")
  const closeMenu = document.getElementById("closeMenu")
  const mobileNav = document.getElementById("mobileNav")
  const cartCountElements = document.querySelectorAll("#cartCount, #mobileCartCount")
  const currentYearElements = document.querySelectorAll("#currentYear")
  
  // Set current year in footer
  currentYearElements.forEach((el) => {
    if (el) el.textContent = new Date().getFullYear()
  })
  
  // Mobile Menu Toggle
  if (menuToggle && closeMenu && mobileNav) {
    menuToggle.addEventListener("click", () => {
      mobileNav.classList.add("active")
    })
  
    closeMenu.addEventListener("click", () => {
      mobileNav.classList.remove("active")
    })
  }
  
  // Cart Functionality
  let cart = JSON.parse(localStorage.getItem("cart")) || []
  
  // Update cart count
  function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0)
  
    cartCountElements.forEach((el) => {
      if (el) el.textContent = totalItems
    })
  }
  
  // Add to cart
  function addToCart(productId) {
    const product = products.find((p) => p.id === productId)
  
    if (!product) return
  
    const existingItem = cart.find((item) => item.id === productId)
  
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({
        ...product,
        quantity: 1,
      })
    }
  
    localStorage.setItem("cart", JSON.stringify(cart))
    updateCartCount()
  
    // Show confirmation
    alert(`${product.name} added to cart!`)
  }
  
  // Remove from cart
  function removeFromCart(productId) {
    cart = cart.filter((item) => item.id !== productId)
    localStorage.setItem("cart", JSON.stringify(cart))
    updateCartCount()
  
    // Update cart page if we're on it
    if (window.location.pathname.includes("cart.html")) {
      renderCart()
    }
  
    // Update checkout page if we're on it
    if (window.location.pathname.includes("checkout.html")) {
      renderCheckout()
    }
  }
  
  // Initialize cart count
  updateCartCount()
  
  // Products Page Functionality
  const productsGrid = document.getElementById("productsGrid")
  const searchInput = document.getElementById("searchInput")
  const clearSearch = document.getElementById("clearSearch")
  const noResults = document.getElementById("noResults")
  const clearFilters = document.getElementById("clearFilters")
  const categoryTabs = document.querySelectorAll(".tab-btn")
  
  // Render products on products page
  function renderProducts(filteredProducts = products) {
    if (!productsGrid) return
  
    productsGrid.innerHTML = ""
  
    if (filteredProducts.length === 0) {
      if (noResults) noResults.style.display = "block"
      return
    }
  
    if (noResults) noResults.style.display = "none"
  
    filteredProducts.forEach((product) => {
      const productCard = document.createElement("div")
      productCard.className = "product-card"
  
      productCard.innerHTML = `
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}">
          <button class="wishlist-btn">
            <i class="far fa-heart"></i>
          </button>
        </div>
        <div class="product-content">
          <span class="product-category">${product.category}</span>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="product-price">$${product.price.toFixed(2)}</div>
          <button class="btn btn-primary add-to-cart" data-id="${product.id}">
            <i class="fas fa-shopping-cart"></i> Add to Cart
          </button>
        </div>
      `
  
      productsGrid.appendChild(productCard)
    })
  
    // Add event listeners to add to cart buttons
    document.querySelectorAll(".add-to-cart").forEach((button) => {
      button.addEventListener("click", () => {
        const productId = Number.parseInt(button.getAttribute("data-id"))
        addToCart(productId)
      })
    })
  }
  
  // Filter products by search and category
  function filterProducts() {
    if (!searchInput) return
  
    const searchTerm = searchInput.value.toLowerCase()
    const activeCategory = document.querySelector(".tab-btn.active")?.getAttribute("data-category") || "all"
  
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm)
  
      const matchesCategory = activeCategory === "all" || product.category === activeCategory
  
      return matchesSearch && matchesCategory
    })
  
    renderProducts(filtered)
  }
  
  // Initialize products page
  if (productsGrid) {
    renderProducts()
  
    // Search functionality
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        if (searchInput.value) {
          clearSearch.classList.add("active")
        } else {
          clearSearch.classList.remove("active")
        }
  
        filterProducts()
      })
    }
  
    // Clear search
    if (clearSearch) {
      clearSearch.addEventListener("click", () => {
        searchInput.value = ""
        clearSearch.classList.remove("active")
        filterProducts()
      })
    }
  
    // Category tabs
    if (categoryTabs.length > 0) {
      categoryTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
          categoryTabs.forEach((t) => t.classList.remove("active"))
          tab.classList.add("active")
          filterProducts()
        })
      })
    }
  
    // Clear filters
    if (clearFilters) {
      clearFilters.addEventListener("click", () => {
        searchInput.value = ""
        clearSearch.classList.remove("active")
        categoryTabs.forEach((t) => {
          t.classList.remove("active")
          if (t.getAttribute("data-category") === "all") {
            t.classList.add("active")
          }
        })
  
        filterProducts()
      })
    }
  }
  
  // Add to cart buttons on home page
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = Number.parseInt(button.getAttribute("data-id"))
      addToCart(productId)
    })
  })
  
  // Cart Page Functionality
  const emptyCart = document.getElementById("emptyCart")
  const cartContent = document.getElementById("cartContent")
  const cartItemsList = document.getElementById("cartItemsList")
  const subtotalElement = document.getElementById("subtotal")
  const totalElement = document.getElementById("total")
  
  // Render cart page
  function renderCart() {
    if (!emptyCart || !cartContent || !cartItemsList) return
  
    if (cart.length === 0) {
      emptyCart.style.display = "block"
      cartContent.style.display = "none"
      return
    }
  
    emptyCart.style.display = "none"
    cartContent.style.display = "block"
  
    cartItemsList.innerHTML = ""
  
    let subtotal = 0
  
    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity
      subtotal += itemTotal
  
      const tr = document.createElement("tr")
  
      tr.innerHTML = `
        <td>
          <div class="cart-product">
            <div class="cart-product-image">
              <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-product-info">
              <h3>${item.name}</h3>
              <p>${item.category}</p>
            </div>
          </div>
        </td>
        <td class="text-center">${item.quantity}</td>
        <td class="text-right">$${itemTotal.toFixed(2)}</td>
        <td class="text-right">
          <button class="remove-item" data-id="${item.id}">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `
  
      cartItemsList.appendChild(tr)
    })
  
    // Update totals
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`
    if (totalElement) totalElement.textContent = `$${(subtotal + 5).toFixed(2)}`
  
    // Add event listeners to remove buttons
    document.querySelectorAll(".remove-item").forEach((button) => {
      button.addEventListener("click", () => {
        const productId = Number.parseInt(button.getAttribute("data-id"))
        removeFromCart(productId)
      })
    })
  }
  
  // Initialize cart page
  if (window.location.pathname.includes("cart.html")) {
    renderCart()
  }
  
  // Checkout Page Functionality
  const emptyCheckout = document.getElementById("emptyCheckout")
  const checkoutContent = document.getElementById("checkoutContent")
  const checkoutItems = document.getElementById("checkoutItems")
  const checkoutSubtotal = document.getElementById("checkoutSubtotal")
  const checkoutTotal = document.getElementById("checkoutTotal")
  const checkoutForm = document.getElementById("checkoutForm")
  
  // Render checkout page
  function renderCheckout() {
    if (!emptyCheckout || !checkoutContent || !checkoutItems) return
  
    if (cart.length === 0) {
      emptyCheckout.style.display = "block"
      checkoutContent.style.display = "none"
      return
    }
  
    emptyCheckout.style.display = "none"
    checkoutContent.style.display = "block"
  
    checkoutItems.innerHTML = ""
  
    let subtotal = 0
  
    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity
      subtotal += itemTotal
  
      const div = document.createElement("div")
      div.className = "checkout-item"
  
      div.innerHTML = `
        <div class="checkout-item-name">
          ${item.name} <span class="checkout-item-quantity">x${item.quantity}</span>
        </div>
        <div>$${itemTotal.toFixed(2)}</div>
      `
  
      checkoutItems.appendChild(div)
    })
  
    // Update totals
    if (checkoutSubtotal) checkoutSubtotal.textContent = `$${subtotal.toFixed(2)}`
    if (checkoutTotal) checkoutTotal.textContent = `$${(subtotal + 5).toFixed(2)}`
  }
  
  // Initialize checkout page
  if (window.location.pathname.includes("checkout.html")) {
    renderCheckout()
  
    // Handle checkout form submission
    if (checkoutForm) {
      checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault()
  
        // Clear cart
        cart = []
        localStorage.setItem("cart", JSON.stringify(cart))
        updateCartCount()
  
        // Redirect to thank you page
        window.location.href = "thank-you.html"
      })
    }
  }
  
  // Thank You Page
  const orderNumber = document.getElementById("orderNumber")
  
  // Initialize thank you page
  if (window.location.pathname.includes("thank-you.html")) {
    // Generate random order number
    if (orderNumber) {
      orderNumber.textContent = Math.floor(100000 + Math.random() * 900000)
    }
  }
  
  // Contact Form
  const contactForm = document.getElementById("contactForm")
  const formSuccess = document.getElementById("formSuccess")
  
  // Handle contact form submission
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()
  
      // Show success message
      if (formSuccess) {
        formSuccess.style.display = "block"
  
        // Reset form
        contactForm.reset()
  
        // Hide success message after 5 seconds
        setTimeout(() => {
          formSuccess.style.display = "none"
        }, 5000)
      }
    })
  }
  
  // Payment Method Selection
  const paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]')
  const paymentDetails = document.querySelectorAll(".payment-details")
  
  // Function to show the selected payment details
  function showPaymentDetails(paymentMethod) {
    // Hide all payment details first
    paymentDetails.forEach((detail) => {
      detail.classList.remove("active")
    })
  
    // Show the selected payment details
    const selectedDetails = document.getElementById(`${paymentMethod}Details`)
    if (selectedDetails) {
      selectedDetails.classList.add("active")
    }
  }
  
  // Add event listeners to payment method radios
  if (paymentMethodRadios.length > 0) {
    paymentMethodRadios.forEach((radio) => {
      radio.addEventListener("change", () => {
        if (radio.checked) {
          showPaymentDetails(radio.value)
        }
      })
    })
  }
  
  // Initialize products page event listeners
  if (window.location.pathname.includes("products.html")) {
    // Make sure all "Add to Cart" buttons have event listeners
    document.addEventListener("DOMContentLoaded", () => {
      const addToCartButtons = document.querySelectorAll(".add-to-cart")
  
      addToCartButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const productId = Number.parseInt(button.getAttribute("data-id"))
          addToCart(productId)
        })
      })
    })
  }
  