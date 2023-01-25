const urlId = new URLSearchParams(window.location.search).get("orderId");

const orderId = document.getElementById("orderId");
orderId.innerText = urlId;
