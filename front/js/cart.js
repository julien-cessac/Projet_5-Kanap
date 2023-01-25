let cart = JSON.parse(localStorage.getItem("cart"));
document.getElementById('totalPrice').innerHTML=0

for (let productInStorage of cart){
  
  fetch("http://localhost:3000/api/products/" + productInStorage.idProduct)

.then(function(res) {
   
    if (res.ok) {
      return res.json();
    }
  })

  .then(function(product) {
    displayProduct (product, productInStorage);
    totalPrice(productInStorage.quantity, product.price);
    totalQuantity(productInStorage.quantity);
  })

  .catch(function(error) {
  });
}



function displayProduct(product, productInStorage){

    let cartItems = document.querySelector("#cart__items");
    
    let cartItem = document.createElement("article");
    cartItems.appendChild(cartItem)
    cartItem.className = "cart__item";
    cartItem.setAttribute("data-id", productInStorage.idProduct);
    cartItem.setAttribute("data-color", productInStorage.color); 
  
    // premiere div (IMG)
    let cartItemDiv = document.createElement("div");
    cartItem.appendChild(cartItemDiv);
    cartItemDiv.className = "cart__item__img";
  
    let cartItemImg = document.createElement("img");
    cartItemDiv.appendChild(cartItemImg);
    cartItemImg.setAttribute("src", product.imageUrl);
    cartItemImg.setAttribute("alt", product.altTxt);
  
    // deuxieme div (CONTENT)
    let cartItemContent = document.createElement("div");
    cartItem.appendChild(cartItemContent);
    cartItemContent.className = "cart__item__content";
      //premiere div interne (NAME COLOR PRICE)
    let cartItemContentDescription = document.createElement("div");
    cartItemContent.appendChild(cartItemContentDescription);
    cartItemContentDescription.className = "cart__item__content__description";
  
    let cartItemName = document.createElement("h2");
    cartItemContentDescription.appendChild(cartItemName);
    cartItemName.innerText = product.name;
  
    let cartItemColor = document.createElement("p");
    cartItemContentDescription.appendChild(cartItemColor);
    cartItemColor.innerText = productInStorage.color; 
  
    let cartItemPrice = document.createElement("p");
    cartItemContentDescription.appendChild(cartItemPrice);
    cartItemPrice.innerText = product.price;
      
      // deuxieme div interne (SETTING)
    let cartItemContentSetting = document.createElement("div");
    cartItemContent.appendChild(cartItemContentSetting);
    cartItemContentSetting.className = "cart__item__content__settings";
          // premiere div interne (SETTING QTT)
    let cartItemSettingQuantity = document.createElement("div");
    cartItemContentSetting.appendChild(cartItemSettingQuantity);
    cartItemSettingQuantity.className = "cart__item__content__settings__quantity";
  
    let cartItemSettingQuantityQtt = document.createElement("p");
    cartItemSettingQuantity.appendChild(cartItemSettingQuantityQtt);
    cartItemSettingQuantityQtt.innerHTML = "Qté : ";
  
    let changeQuantity = document.createElement("input");
    cartItemSettingQuantity.appendChild(changeQuantity);
    changeQuantity.setAttribute("type", "number");
    changeQuantity.className = "itemQuantity";
    changeQuantity.setAttribute("name", "itemQuantity");
    changeQuantity.setAttribute("min", "1");
    changeQuantity.setAttribute("max", "100");
    changeQuantity.value = productInStorage.quantity; 
          // deuxieme div interne (SETTING DELETE)
    let cartItemSettingDelete = document.createElement("div");
    cartItemContentSetting.appendChild(cartItemSettingDelete);
    cartItemSettingDelete.className = "cart__item__content__settings__delete";
  
    let removeItem = document.createElement("p");
    cartItemSettingDelete.appendChild(removeItem);
    removeItem.className = "deleteItem";
    removeItem.innerText = "Supprimer";


////// Bouton supprimer ///////////

    removeItem.addEventListener("click", (event) => {
      event.preventDefault();

      let article = event.target.closest("article") 
      let itemID = article.getAttribute("data-id");
      let itemColor = article.getAttribute("data-color")
        
      let productInStorage = JSON.parse(localStorage.getItem("cart"));
        
      productInStorage = productInStorage.filter(el => !(el.idProduct == itemID && el.color == itemColor));
      localStorage.setItem("cart", JSON.stringify(productInStorage));
      location.reload();
    
    })

///////// Bouton quantité ///////////

    changeQuantity.addEventListener("change", (event) => {
      event.preventDefault();

      let article = event.target.closest("article")
      let itemID = article.getAttribute("data-id");
      let itemColor = article.getAttribute("data-color")

      let productInStorage = JSON.parse(localStorage.getItem("cart"));

      let indexProductInStorage = productInStorage.findIndex(el => el.idProduct == itemID && el.color == itemColor);

      productInStorage[indexProductInStorage].quantity = Math.min(changeQuantity.value)

      localStorage.setItem("cart", JSON.stringify(productInStorage));
      // location.reload(); >>>>>>>>>>>>>> à supprimer//
      totalQuantity(); // fonctionne // 
      totalPrice(); // affiche NaN au lieu du prix mis à jour //
    })
}

function totalQuantity(){ 

  var productInStorageQuantity = document.getElementsByClassName('itemQuantity');
  var Length = productInStorageQuantity.length,

  calculatedQuantity = 0;
  for (var i = 0; i < Length; ++i) {
    calculatedQuantity += productInStorageQuantity[i].valueAsNumber;
  }

  let productTotalQuantity = document.getElementById('totalQuantity');
  productTotalQuantity.innerHTML = calculatedQuantity;
}

function totalPrice(quantity, price){

  let productTotalPrice = document.getElementById('totalPrice');
  let productPrice = quantity * price;
  
  let calculatedPrice = productPrice + parseInt(productTotalPrice.textContent);
  productTotalPrice.innerHTML = calculatedPrice;
}



//////// FORMULAIRE //////////

var textRegex = new RegExp("^[a-zA-Zà-ÿÀ-Ý\s'\-]+$"); 
// let addressRegex = new RegExp("^[0-9a-zA-Zà-ÿÀ-Ý\s\'\-\,]+$"); 
var emailRegex = new RegExp('^[a-zA-Z0-9.\-_]+[@]{1}[a-zA-Z0-9.\-_]+[.]{1}[a-z]{2,10}$');

let productInStorage = JSON.parse(localStorage.getItem("cart"));
let idProducts = [];
for (let i = 0; i<productInStorage.length;i++) {
idProducts.push(productInStorage[i].idProduct);
}

//////////////////////////// BOUTON ENVOI //////////////////////////////

let orderBtn = document.querySelector("#order");
orderBtn.addEventListener("click", (event) =>{
  event.preventDefault();

  const formValue = {
    contact: {
      firstName : document.querySelector("#firstName").value,
      lastName : document.querySelector("#lastName").value,
      address : document.querySelector("#address").value,
      city : document.querySelector("#city").value,
      email : document.querySelector("#email").value,
    },
    products: idProducts,
  }

post (formValue);
}) 

//////////// FIN DU BOUTON ///////////

function post (formValue) {

  if (firstNameCheck(formValue.contact.firstName) & lastNameCheck(formValue.contact.lastName) & 
  addressCheck(formValue.contact.address) & cityCheck(formValue.contact.city) & 
  emailCheck(formValue.contact.email) & (productInStorage.length>0) ){
  
  const options = {
    method: 'POST',
    headers: {
        'Accept': 'application/json', 
        "Content-Type": "application/json"
    },
    body: JSON.stringify(formValue),
  };


  fetch("http://localhost:3000/api/products/order", options)

    .then((response) => response.json())
    .then((data) => {
      localStorage.removeItem("cart");
      document.location.href = "confirmation.html?orderId=" + idProducts;
    })

  } else {
    alert("formulaire incorrecte")
  }
}

function firstNameCheck(firstName) {

  const firstNameErrorMsg = document.getElementById('firstNameErrorMsg');

  if (textRegex.test(firstName)) {
    firstNameErrorMsg.innerHTML = '';
    return true;
  } else {
    firstNameErrorMsg.innerHTML = 'Veuillez indiquer votre prénom';
    return false;
  }
}

function lastNameCheck(lastName) {

  const lastNameErrorMsg = document.getElementById('lastNameErrorMsg');

  if (textRegex.test(lastName)){
    lastNameErrorMsg.innerHTML = '';
    return true;
  }else{
    lastNameErrorMsg.innerHTML = 'Veuillez indiquer votre nom.';
    return false;
  }
}

function addressCheck(address) {

  const addressErrorMsg = document.getElementById('addressErrorMsg');

  if (address.match(/^[0-9a-zA-Zà-ÿÀ-Ý\s\'\-\,]+$/g)){
    addressErrorMsg.innerHTML = '';
    return true;
  }else{
    addressErrorMsg.innerHTML = 'Veuillez indiquer votre adresse.';
    return false;
  }
}

function cityCheck(city) {

  const cityErrorMsg = document.getElementById('cityErrorMsg');

  if (textRegex.test(city)){
    cityErrorMsg.innerHTML = '';
    return true;
  }else{
    cityErrorMsg.innerHTML = 'Veuillez indiquer votre ville.';
    return false;
  }
}

function emailCheck(email) {

  const emailErrorMsg = document.getElementById('emailErrorMsg');

  if (emailRegex.test(email)){
    emailErrorMsg.innerHTML = '';
    return true;
  }else{
    emailErrorMsg.innerHTML = 'Veuillez indiquer votre adresse email.';
    return false;
  }
}