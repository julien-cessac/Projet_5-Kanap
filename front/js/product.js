var str = window.location.href;
var url = new URL(str);
var idProduct = url.searchParams.get("id");

fetch("http://localhost:3000/api/products/" + idProduct)

.then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })

  .then(function(product) {
    displayProduct (product)
  })

  .catch(function(error) {
  });



  function displayProduct (product){
    let productImg = document.querySelector(".item__img");
    let itemImg = document.createElement("img")
    productImg.appendChild (itemImg)
    itemImg.setAttribute("src", product.imageUrl);
    itemImg.setAttribute("alt", product.altTxt);
    
    let productName = document.querySelector("#title");
    productName.innerText = product.name

    let productPrice = document.querySelector("#price");
    productPrice.innerText = product.price

    let productDescription = document.querySelector("#description");
    productDescription.innerText = product.description

    let productColorsList = document.querySelector("#colors");
    for (let color of product.colors) {
        let productColors = document.createElement("option")
        productColors.setAttribute("value", color );
        productColors.innerText = color
        productColorsList.appendChild (productColors)
    }
  }

// panier //
let addToCartBtn = document.querySelector("#addToCart");
addToCartBtn.addEventListener("click", (event) => {

    let quantitySelected = document.querySelector("#quantity").value;
    let colorSelected = document.querySelector("#colors").value;
    
    if ( !(quantitySelected > 0 && quantitySelected <= 100) ) {
    alert('La quantité est incorrecte')
    return
    }
    
    if (colorSelected === "") {
      alert("couleur non selectionnée")
      return
    }
    addToCart (idProduct, colorSelected, parseInt(quantitySelected));
    alert("Produit ajouté au panier");

})

function saveCart (cart){
    localStorage.setItem("cart", JSON.stringify(cart));
}

function getCart() {
    let cart = localStorage.getItem("cart");
    if (cart == null) {
        return [];
    } else {
        return JSON.parse(cart);
    }
}

function addToCart (idProduct, colorSelected,quantitySelected){
  
    let product = {
      idProduct: idProduct,
      color: colorSelected,
      quantity: quantitySelected,
    }

    let cart = getCart();
    let foundProduct = cart.find(p => p.color  == product.color && p.idProduct == product.idProduct);
  
     if(foundProduct != undefined){
        //  foundProduct.quantity += quantity;
         foundProduct.quantity += quantitySelected; // correction //
     }else{
        cart.push(product);
        console.log("push")
     }
    
     saveCart(cart); 
}
