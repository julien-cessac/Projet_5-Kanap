fetch("http://localhost:3000/api/products")

.then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(products) {
    for (let product of products) {
        displayProduct(product)
     }
  })
  .catch(function(error) {
  });


function displayProduct (product){

  let productList = document.querySelector(".items");
  let productLink = document.createElement("a");
  productList.append(productLink)
  productLink.href = "./product.html?id=" + product._id;

  let productBox = document.createElement("article");
  productLink.appendChild(productBox)

  let productImg = document.createElement("img");
  productBox.appendChild(productImg);
  productImg.setAttribute("src", product.imageUrl);
  productImg.setAttribute("alt", product.altTxt);
  productImg.setAttribute("title", product.altTxt);

  let productName = document.createElement("h3");
  productBox.appendChild(productName);
  productName.textContent = product.name;
  productName.className = "productName";

  let productDescription = document.createElement("p");
  productBox.appendChild(productDescription);
  productDescription.textContent = product.description;
  productDescription.className = "productDescription";

}

