// ******************** place order ********************* //
let orderItems;
let cartItems;
let completedOrders
$(document).ready(function () {
    // cart items
    if (localStorage.getItem("lasthourcart") != null) {
        cartItems = JSON.parse(localStorage.getItem("lasthourcart"))
        appendCart()
    }
    else {
        cartItems = []
    }
    // order items
    if (localStorage.getItem("lasthourorder") != null) {
        orderItems = JSON.parse(localStorage.getItem("lasthourorder"))
    }
    else {
        orderItems = []
    }
    // completed orders 
    if (localStorage.getItem("lasthourcompleted") != null) {
        completedOrders = JSON.parse(localStorage.getItem("lasthourcompleted"))
    }
    else {
        completedOrders = []
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
    let tempData
    if ($(".addtocart-form textarea[name='additional-info']").val() == "") {
        $(".addtocart-form textarea[name='additional-info']").val("(no additionl info given)")
    }
    tempData = {
        id: Date.now(),
        additionalInfo: $(".addtocart-form textarea[name='additional-info']").val(),
        quantity: $(".addtocart-form input[name='quantity']").val(),
        item: $(".addtocart-form input[name='item']").val(),
        price: (Number($(".addtocart-form input[name='price']").val()) * Number($(".addtocart-form input[name='quantity']").val())),
    }
    $('.side_collapse_parent').removeClass("active")
    $(".side_collapse").remove()
    cartItems.push(tempData)
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
    createToast(`${tempItem.quantity}x ${tempItem.item} has been removed!`)
    appendCart()
}

$(".place-order").click(function () {
    let orderno = localStorage.getItem("lasthourorderno") ? localStorage.getItem("lasthourorderno") : 201
    let tempItem = {
        id: orderno,
        items: cartItems
    }
    localStorage.setItem("lasthourorderno", Number(orderno) + 1)
    orderItems.push(tempItem)
    localStorage.setItem("lasthourorder", JSON.stringify(orderItems))
    localStorage.removeItem("lasthourcart")
    createToast("Order Placed Successfully!")
    $(".close-canvas").click()
    cartItems = []
    appendCart();
})


// ******************** Order Info ********************* //
function renderOrderData(order, elem) {
    let tempData = "";
    $(elem).html("")
    // order.forEach(curOrder => function(){
    for (let i = 0; i < order.length; i++) {
        if (elem == "#queue-order" && i == 0) {
            continue;
        }
        tempData += `
        <div class="your_account_card">
            <div class="your_account_card_inner">
                <div class="your_account_card_inner_content">
                    <div class="your_note">
                        <div class="d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center">
                                <img src="images/checklist.png" alt="">
                                <h6>Order Summary</h6>
                            </div>
                            <span>Order number: ${order[i].id}</span>
                        </div>
                    </div>
                </div>
                <hr>
                <div class="order_summary">
                    <ul class="p-0 m-0">`
        order[i].items.map(curItem => {
            tempData += `<li>
                            <div><strong>x${curItem.quantity}</strong> ${curItem.item}</div><strong>${curItem.price} PKR</strong>
                        </li>`
        })
        tempData += `</ul>
                </div>
            </div>
        </div>
            `
    }
    if(tempData != ""){
        $(elem).html(tempData)
    }
    else{
        if(elem == "#queue-order"){
            $(elem).html(`<p class="no-data-text">None of the order is Pending!</p>`)
        }
        else{
            $(elem).html(`<p class="no-data-text">None of the order is Completed!</p>`)
        }
    }
}
function renderActiveOrder() {
    let tempItem = "";
    if (orderItems.length > 0) {
        $("#active-order-no").html("#" + orderItems[0].id)
        orderItems[0].items.map(curItem => {
            tempItem += `<li>
                <h6><span>${curItem.item}</span><span>${curItem.quantity}</span></h6>
                <p>${curItem.additionalInfo}</p>
            </li>`
        })
        $("#active-order-items").html(tempItem)
        let progress = $(".order-processing-card .progress")
        let progressBarWidth = 0;
        $(progress).removeClass("d-none")
        let proressInterval = setInterval(() => {
            if (progressBarWidth < 100) {
                progressBarWidth += 1
                $(progress).children().css("width", `${progressBarWidth}%`)
            }
        }, 200);
        setTimeout(() => {
            $("#active-order-no").html("")
            completedOrders.push(orderItems[0]);
            createToast(`order # ${orderItems[0].id} has been ready`)
            orderItems.splice(0, 1)
            localStorage.setItem("lasthourcompleted", JSON.stringify(completedOrders))
            localStorage.setItem("lasthourorder", JSON.stringify(orderItems))
            clearInterval(proressInterval);
            renderOrderData(orderItems, "#queue-order")
            renderOrderData(completedOrders, "#order-completed")
            renderActiveOrder()
        }, 20000);
    }
    else{
        $(".order-processing-card .progress").addClass("d-none")
        $("#active-order-items").html(`<p class="no-data-text">None of the order is in process!</p>`)
    }
}
$(document).ready(function () {
    renderOrderData(orderItems, "#queue-order")
    renderOrderData(completedOrders, "#order-completed")
    renderActiveOrder()
})