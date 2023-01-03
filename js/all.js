// ******************** place order ********************* //
let orderItems;
let cartItems;
$(document).ready(function () {
    if (localStorage.getItem("lasthourcart") != null) {
        cartItems = JSON.parse(localStorage.getItem("lasthourcart"))
        appendCart()
    }
    else {
        cartItems = []
    }
    if (localStorage.getItem("lasthourorder") != null) {
        orderItems = JSON.parse(localStorage.getItem("lasthourorder"))
    }
    else {
        orderItems = []
    }
})
$('.side_collapse_parent').click(function () {
    if (!$(this).hasClass("active")) {
        $('.side_collapse_parent').removeClass("active")
        $(this).addClass("active")
        $(".side_collapse").remove();
        let side_collapse = document.createElement("div");
        side_collapse.setAttribute("class", "side_collapse")
        side_collapse.innerHTML = `
        <div class="addtocart-form">
        <h2>Quantity *</h2>
        <input name="quantity" min="1" value="1" type="number">
        <h2>Additional Info</h2>
        <textarea name="additional-info" id="" cols="30" rows="10"></textarea>          
        <input name="item" type="hidden" value="${$(this).find("span").first().html()}" />
        <input name="price" type="hidden" value="${$(this).find(".price-value").text()}" />
        <button onclick="addtocart()" class="save">Add to Cart</button>
        </div>`
        this.append(side_collapse);
    }
});
// remove side panel on outside click 
$("body").click(function (e) {
    let isInSidePanel = ($(e.target).parents(".side_collapse_parent").length > 0 && !$(e.target).hasClass("side_collapse_parent"))
    if (!isInSidePanel) {
        $('.side_collapse_parent').removeClass("active")
        $(".side_collapse").remove()
    }
})

function addtocart() {
    let tempItem
    tempItem = {
        id: Date.now(),
        additionalInfo: $(".addtocart-form textarea[name='additional-info']").val(),
        quantity: $(".addtocart-form input[name='quantity']").val(),
        item: $(".addtocart-form input[name='item']").val(),
        price: (Number($(".addtocart-form input[name='price']").val()) * Number($(".addtocart-form input[name='quantity']").val())),
    }
    $('.side_collapse_parent').removeClass("active")
    $(".side_collapse").remove()
    cartItems.push(tempItem)
    localStorage.setItem("lasthourcart", JSON.stringify(cartItems))
    createToast("1 item has been added to cart!")
    appendCart()
}
function appendCart() {
    if (cartItems.length > 0) {
        let cartItemHtml = ""
        let totalAmount = 0;
        $(".viewcart-offcanvas .no-items").removeClass("d-flex")
        $(".viewcart-offcanvas .cart-listing").addClass("d-flex")
        $(".viewcart-offcanvas .cart-listing .cart-ul").html("")
        cartItems.map((curItem, ind) => {
            totalAmount += curItem.price
            cartItemHtml += `
            <li data-id="${curItem.id}" class="cart-item">
            <ul>
            <li>
            <h4>${curItem.item}</h4>
            <button onclick="removeCartItem(this)"><i class="fas fa-trash"></i></button>
            </li>
            <li>
            <h5><span>Quantity:</span><span>${curItem.quantity}</span></h5>
            <h5><span>Price:</span><span>${curItem.price} PKR</span></h5>
            </li>
            <li>
            <p>${curItem.additionalInfo}</p>
            </li>
            </ul>
            </li>`
        })
        $(".viewcart-offcanvas .cart-listing .cart-ul").html(cartItemHtml)
        $(".viewcart-offcanvas .offcanvas-footer .total-amount span").last().html(totalAmount + " PKR")
    }
    else {
        $(".viewcart-offcanvas .no-items").addClass("d-flex")
        $(".viewcart-offcanvas .cart-listing").removeClass("d-flex")
    }
}
// toast message
function createToast(message) {
    let toast = document.createElement("div")
    $(toast).append(`<div class="toast align-items-center show" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="d-flex">
    <div class="toast-body">${message}</div>
    <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    </div>`)
    $(".toast-container").append(toast)
    setTimeout(() => {
        $(toast).remove()
    }, 5000);
}

function removeCartItem(btn) {
    let targetId = $(btn).parents(".cart-item").data("id")
    let tempItem;
    cartItems.map((curItem) => {
        if (curItem.id == targetId) {
            tempItem = curItem
        }
    })
    let targetIndex = cartItems.indexOf(tempItem)
    cartItems.splice(targetIndex, 1)
    localStorage.setItem("lasthourcart", JSON.stringify(cartItems))
    appendCart()
}

$(".place-order").click(async function(){
    await orderItems.push(cartItems)
    localStorage.removeItem("lasthourcart")
    cartItems = []
    appendCart();
    window.location.href = "currentOrders.html"
})


// ******************** place order ********************* //