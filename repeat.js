const favorite = () => {
    const favButton = document.querySelector('.favorite');
    let showFavorites = false;


    favButton.addEventListener('click', async () => {
        const allProducts = await fetchProducts();
        const favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];

        const filtered = showFavorites
            ? allProducts
            : allProducts.filter(p => favorites.includes(p.id.toStringfy()));

        const carousel = document.getElementById("recommended-products");
        carousel.innerHTML = "";
        populateCarousel(filtered);
        

        setEvents();

        showingFavorites = !showingFavorites;
        favButton.textContent = showFavorites ? "Tümü" : "Favoriler";




    });
}






<select class="price-filter" id="priceFilter">
    <option value="all">Tüm ürünler</option>
    <option value="under100">100 tl altı</option>
    <option value="above100">100 tl üstü</option>
</select>



const priceFilter = () => {
    const priceFilter = document.getElementById("priceFilter");

    priceFilter.addEventListener("change", async () => {
        const allProducts = await fetchProducts();
        const selectedValue = priceFilter.value;

        let filteredProducts = allProducts;

        if(selectedValue === "under100"){
            filteredProducts = allProducts.filter(p => parseFloat(p.price) < 100);
        }else if(selectedValue === "above100"){
            filteredProducts = allProducts.filter(p => parseFloat(p.price) > 100);
        }

        const carousel = document.getElementById("recommended-products");
        carousel.innerHTML = "";
        populateCarousel(filteredProducts);
        setEvents();
    })
}