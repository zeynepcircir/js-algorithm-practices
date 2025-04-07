(() => {
    const API_URL = "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json";
    const LOCAL_STORAGE_KEY = "recommendedProducts";
    const FAVORITES_KEY = "favoriteProducts";

    const init = async () => {
        if (document.querySelector('.product-detail')) {
            const products = await fetchProducts();
            const productLength = products.length;
            buildHTML();
            buildCSS(productLength);
            populateCarousel(products);
            setEvents();
            setupFavoriteFilterToggle();
            priceFilter();
            search();
        }
    };

    const fetchProducts = async () => {
        let products = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

        if (!products) {
            const response = await fetch(API_URL);
            products = await response.json();
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
        }

        return products;
    };

    const buildHTML = () => {

            const carouselHTML = `
                <div class="custom-recommendation-section">
                    <div class="custom-carousel">
                        <div class="product-container">
                                <select id="priceFilter" class="price-filter">
                                    <option value="all">Tüm Ürünler</option>
                                    <option value="under100">100 TL'nin altı</option>
                                    <option value="above100">100 TL'nin üstünde</option>
                                </select>
                                <button class="btn favorite">FAVORİLERİ FİLTRELE</button>
                                <input type="text" id="searchInput" class="search-input" placeholder="Ürün ara..."/>
                            <h2>You Might Also Like</h2>
                            <div class="custom-recommendation-carousel">
                                <button class="carousel-btn prev">&#10094;</button>
                                <div class="carousel-parent">
                                    <div class="carousel-track" id="recommended-products"></div>
                                </div>
                                <button class="carousel-btn next">&#10095;</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        
            document.querySelector(".product-detail").insertAdjacentHTML("afterend", carouselHTML);
        };
        

    const buildCSS = (productLength) => {
        const itemWidth = 100 / productLength;
        const carouselWidth = (100 / 5.3) * productLength;

        const css = `
            #root {
                overflow-x: hidden;
            }
    
            .custom-recommendation-section {
                background-color: #faf9f7;
                position: relative;
            }
    
            .custom-recommendation-section .custom-carousel {
                display: flex;
                justify-content: center;
                margin-left: 15px;
            }
    
            .custom-recommendation-section .custom-carousel .product-container {
                display: block;
                width: 80%;
            }
    
            .custom-recommendation-section h2 {
                color: #29323b;
                font-weight: lighter;
                font-size: 32px;
                line-height: 43px;
                padding: 15px 0;
                margin: 0;
            }
    
            .custom-recommendation-carousel {
                position: relative;
                padding-bottom: 24px;
            }
    
            .carousel-parent {
                position: relative;
                overflow: hidden;
            }
    
            .carousel-track {
                display: flex;
                align-items: stretch;
                width: ${carouselWidth}%;
                transform: translateX(0%) translateX(0px);
                flex-direction: row;
            }
    
            .carousel-track::-webkit-scrollbar {
                display: none;
            }
    
            .product-item-container {
                width: ${itemWidth}%;
                padding-bottom: unset;
                height: unset;
            }
    
            .product-item-limit {
                width: calc(100% - 10px);
                height: calc(100% - 10px);
            }
    
            .product-item {
                width: 21rem;
                height: 38rem;
                background: white;
                text-align: center;
                position: relative;
                cursor: pointer;
                transition: transform 0.2s ease-in-out;
            }
    
            .image-wrapper {
                position: relative;
            }
    
            #productImage {
                width: 100%;
                height: 100%;
                vertical-align: middle;
                border: 0;
                overflow: clip;
            }
    
            .product-info {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding: 0 10px;
                font-size: 16px;
                color: #333;
                text-align: start;
            }
    
            .product-info p {
                margin: 5px 0;
                font-size: 14px;
            }
    
            .product-info .price {
                color: #193db0;
                font-size: 18px;
                font-weight: bold;
            }
    
            a {
                text-decoration: none;
                color: #333;
            }
    
            a:hover {
                text-decoration: none;
                color: #333;
            }
    
            .heart {
                position: absolute;
                top: 10px;
                right: 15px;
                width: 32px;
                height: 32px;
                background-color: #fff;
                border-radius: 5px;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                transition: all 0.2s ease-in-out;
            }
    
            .heart.active {
                background-color: white !important;
                border: 1px solid #b6b7b9 !important;
            }
    
            .heart.active svg path {
                fill: #193db0 !important;
                stroke: #193db0 !important;
                stroke-width: 1.5px !important;
            }
    
            .carousel-btn {
                background: none;
                border: none;
                font-size: 30px;
                cursor: pointer;
                padding: 5px;
                position: absolute;
                top: 50%;
                z-index: 10;
                color: #555;
                transition: 0.2s;
            }
    
            .carousel-btn:hover {
                color: #000;
            }
    
            .prev {
                left: -35px;
            }
    
            .next {
                right: -35px;
            }
    
            .add-to-cart-btn {
                display: none;
            }

            @media (max-width: 1290px) and (min-width: 992px){
                .carousel-track{
                    width: 270% !important;
                }
            }
    
            @media (max-width: 992px) {
                .carousel-btn {
                    display: none !important;
                }
    
                .carousel-parent {
                    -webkit-overflow-scrolling: touch;
                    cursor: grab;
                }
    
                .carousel-track {
                    width: max-content !important;
                }
    
                .product-item-container {
                    width: 300px !important;
                    flex: 0 0 auto !important;
                }
    
                .product-item {
                    width: 100% !important;
                    height: auto !important;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
    
                .product-info {
                    min-height: 130px;
                }
    
                .product-info .price {
                    font-size: 16px !important;
                }
    
                .add-to-cart-btn {
                    display: block;
                    margin-top: 8px;
                    background-color: #193db0;
                    color: white;
                    font-weight: bold;
                    border: none;
                    border-radius: 6px;
                    padding: 10px 0;
                    font-size: 14px;
                    cursor: pointer;
                }
    
                .custom-recommendation-section .custom-carousel {
                    justify-content: flex-start;
                }
    
                .custom-recommendation-section .custom-carousel .product-container {
                    width: 100%;
                }
    
                .custom-recommendation-section h2 {
                    font-size: 24px;
                    line-height: 33px;
                }
            }
        `;

        const styleElement = document.createElement("style");
        styleElement.innerHTML = css;
        document.head.appendChild(styleElement);
    };


    const populateCarousel = (products) => {
        const carousel = document.getElementById("recommended-products");
        products.forEach(product => {
            const productHTML = `
           
                <div class="product-item-container">

                    <div class="product-item-limit">
                        <div class="product-item" data-id="${product.id}">
                            <div class="image-wrapper">
                                <a href="${product.url}" target="_blank">
                                    <img id="productImage" src="${product.img}" alt="${product.name}" />
                                </a>
                            </div>
                            <div class="product-info">
                                <a href="${product.url}" target="_blank">
                                    <p>${product.name}</p>
                                </a>
                                <span class="price">${product.price} TL</span>
                                <button class="add-to-cart-btn">ADD TO CART</button>
                            </div>
                            <div class="heart ${isFavorite(product.id) ? 'active' : ''}" data-product-id="${product.id}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20.576" height="19.483" viewBox="0 0 20.576 19.483"><path fill="none" stroke="#555" stroke-width="1.5px" d="M19.032 7.111c-.278-3.063-2.446-5.285-5.159-5.285a5.128 5.128 0 0 0-4.394 2.532 4.942 4.942 0 0 0-4.288-2.532C2.478 1.826.31 4.048.032 7.111a5.449 5.449 0 0 0 .162 2.008 8.614 8.614 0 0 0 2.639 4.4l6.642 6.031 6.755-6.027a8.615 8.615 0 0 0 2.639-4.4 5.461 5.461 0 0 0 .163-2.012z" transform="translate(.756 -1.076)"></path></svg>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            carousel.insertAdjacentHTML("beforeend", productHTML);
        });
    };

    const setEvents = () => {
        const scrollAmount = (window.innerWidth * 0.8) / 5.3;

        document.querySelector(".prev").addEventListener("click", () => {
            document.querySelector(".carousel-parent").scrollBy({ left: -1 * scrollAmount, behavior: "smooth" });
        });

        document.querySelector(".next").addEventListener("click", () => {
            document.querySelector(".carousel-parent").scrollBy({ left: scrollAmount, behavior: "smooth" });
        });

        document.querySelectorAll(".heart").forEach(heart => {
            heart.addEventListener("click", function (event) {

// .heart ikonu bir ürün kutusunun içinde yer alıyor.

// Eğer dıştaki .product-item veya başka bir container da click olayına sahipse, kalbe tıklanınca o dış container'ın olaylarının da tetiklenmesini istemezsin.

// Bu yüzden stopPropagation() kullanılmış → sadece kalp butonuna ait işlem çalışsın, yukarıya (parent) sıçramasın.
                event.stopPropagation();
                const productId = this.dataset.productId;
                toggleFavorite(productId);
                this.classList.toggle("active");
            });
        });

        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                //Sayfa yenileme/form gönderimi gibi varsayılan davranışı engelle
                e.preventDefault();

                const detailBtn = document.querySelector('.product-add-to-cart');
                if (detailBtn) {
                    detailBtn.click();
                } else {
                    console.error('Ürün detayındaki SEPETE EKLE butonu bulunamadı.');
                }
            });
        });

        setupResponsiveScroll();

    };

    const setupFavoriteFilterToggle = () => {
        const favBtn = document.querySelector('.favorite');
        let showingFavorites = false;

        favBtn.addEventListener('click', async () => {
            const allProducts = await fetchProducts();
            const favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];

            const filtered = showingFavorites
                ? allProducts
                : allProducts.filter(p => favorites.includes(p.id.toString()));


            const carousel = document.getElementById("recommended-products");
            carousel.innerHTML = "";
            populateCarousel(filtered);  
            
            setEvents();

            showingFavorites = !showingFavorites;
            favBtn.textContent = showingFavorites ? "TÜM ÜRÜNLERİ GÖSTER" : "FAVORİLERİ LİSTELE";
        });
    }

    const priceFilter = () => {
        const priceFilter = document.getElementById("priceFilter");
    
        priceFilter.addEventListener("change", async () => {
            const allProducts = await fetchProducts();
            const selectedValue = priceFilter.value;
    
            let filteredProducts = allProducts;
    
            if (selectedValue === "under100") {
                filteredProducts = allProducts.filter(p => parseFloat(p.price) < 100);
            } else if (selectedValue === "above100") {
                filteredProducts = allProducts.filter(p => parseFloat(p.price) > 100);
            }
    
            const carousel = document.getElementById("recommended-products");
            carousel.innerHTML = "";
            populateCarousel(filteredProducts);
            setEvents();
        });
    };
    

    const search = () =>{
        const input = document.getElementById("searchInput");

        input.addEventListener("input", async () => {
            const allProducts = await fetchProducts();
            const searchTerm = input.value.trim().toLowerCase();

            const filtered = allProducts.filter(p => 
                p.name.toLowerCase().includes(searchTerm)
            );

            const carousel = document.getElementById("recommended-products");
            carousel.innerHTML = "";
            populateCarousel(filtered);
            setEvents();
        })
    }

    const enableMobileScroll = () => {
        const carousel = document.querySelector(".carousel-parent");
        let startX, scrollLeft;
        carousel.style.cursor = "grab";

        carousel.addEventListener("touchstart", (e) => {
            startX = e.touches[0].pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        }, { passive: true });

        carousel.addEventListener("touchmove", (e) => {
            const x = e.touches[0].pageX - carousel.offsetLeft;
            const walk = (x - startX) * 1.5;
            carousel.scrollLeft = scrollLeft - walk;
        }, { passive: true });
    };


    const setupResponsiveScroll = () => {
        if (window.innerWidth <= 10992) {
            enableMobileScroll();
        }

        window.addEventListener("resize", () => {
            if (window.innerWidth <= 10992) {
                enableMobileScroll();
            }
        });
    };

    const toggleFavorite = (id) => {
        let favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
        if (favorites.includes(id)) {
            favorites = favorites.filter(fav => fav !== id);
        } else {
            favorites.push(id);
        }
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    };

    const isFavorite = (id) => {
        const favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
        return favorites.includes(`${id}`);
    };

    init();
})();