$(document).ready(function () {
    var productQuantity = {};
    var initialProductPrice = {}; 
    var productPrice = {};

    function hitungTotalSetelahPajak(totalSebelumPajak){
        var pajak = totalSebelumPajak * 0.1;
        var totalSetelahPajak = totalSebelumPajak + pajak;
        return {
            pajak: pajak,
            totalSetelahPajak: totalSebelumPajak
        };
    }

    function updateTotal(total){
        $("#total-price").text("Rp. " + total.toLocaleString("id-ID"));
    }

    function updatePajak(pajak){
        $("#tax-ppn").text("Rp. " + pajak.toLocaleString("id-ID"));
    }

    function updateTotalAmount(totalAmout){
        $("#total-amount").text("Rp. " + totalAmout.toLocaleString("id-ID"));
    }

    function updateTotalAfterQuantityChange(){
        var totalPrices = 0;
        for (var item in productQuantity){
            totalPrices += productPrice[item] * productQuantity[item];
        }

        var { pajak, totalSetelahPajak } = hitungTotalSetelahPajak(totalPrices);
        updateTotal(totalPrices);
        updatePajak(pajak);
        updateTotalAmount(totalSetelahPajak);
    }

    $(".product").on('click', function(){
        var $clickedItem = $(this);
        var itemName = $clickedItem.find('h6').first().text().trim();
        var itemPriceText = $clickedItem.find('p').text().trim();
        var itemPrice = parseFloat(itemPriceText.replace("Rp. ", '').replace('.', '').replace(',', '.'));

        if (!isNaN(itemPrice)){
            var formattedItemName = itemName.replace(/\s+/g, '_').toLowerCase();

            if (!productQuantity[formattedItemName]){
                productQuantity[formattedItemName] = 1;
                productPrice[formattedItemName] = itemPrice;
                initialProductPrice[formattedItemName] = itemPrice;
                var newElement =`
                    <div id="card-item" class="row mt-1 border"  style="display: none;">
                        <div class="col-md-10 p-2 m-0" style="display: flex; justify-content: space-between; height: 0.7cm;">
                            <p>${nameProduct}</p>
                            <p id="unit-price" style="font-size: 1rem;">Unit Price : Rp. ${itemPrice.toLocaleString('id-ID')}</p>
                        </div>
                        <div class="col-md-10 p-0 m-0" style="display: flex; justify-content: space-around; height: 0cm;">
                            <p id="product-price" style="font-family: monospace; font-weight: bold; font-size: 1.1rem;">${itemPriceText}</p>
                            <p id="price" style="font-family: monospace; font-weight: bold; font-size: 1.1rem;"></p>
                            <p id="quantity" style="font-size: 1rem;">Quantity : </p>
                            <p class="product-quantity" id="qty_${formattedItemName}" style="font-size: 1rem;">${productQuantity[formattedItemName]}</p>
                        </div>
                        <div class="col-md-2 p-0 m-0 btn-delete" style="display: flex; justify-content: space-around;">
                            <i class='bx bx-trash bx-md bx-pull-right' id="trash-icon"></i>
                        </div>
                    </div>
                `;
                $("#list-order").append(newElement);
                updateTotalAfterQuantityChange();
            }else{
                productQuantity[formattedItemName]++;
                var updatedItemPrice = itemPrice * productQuantity[formattedItemName];
                productPrice[formattedItemName] = itemPrice;
                $('#qty_' + formattedItemName).text(productQuantity[formattedItemName]);
                $('#list-order #card-item').each(function() {
                    var currentItemName = $(this).find('#prdk p').first().text().trim();
                    if (currentItemName === nameProduct) {
                        $(this).find('#prdk #unit-price').text('Unit Price : Rp. ' + updatedItemPrice.toLocaleString('id-ID'));
                    }
                });
                updateTotalAfterQuantityChange();
            }
        }else{
            console.error("Harga produk tidak valid");
        }
    });

    $('#list-order').on('click', '#btn-delete', function() {
    var $item = $(this).closest('#card-item');
    var itemNameElement = $item.find('#prdk p').first();
    var itemName = itemNameElement.text().trim();
    var itemPriceText = $item.find('#prdk #unit-price').text().trim();
    var itemPrice = parseFloat(itemPriceText.replace('Unit Price : Rp. ', '').replace('.', '').replace(',', '.'));

    if (!isNaN(itemPrice)) {
        var formattedItemName = itemName.replace(/\s+/g, '_').toLowerCase();
        var quantityElement = $('#qty_' + formattedItemName);
        var currentQuantity = parseInt(quantityElement.text());

        if (currentQuantity > 1) {
            currentQuantity--;
            quantityElement.text(currentQuantity); 
            productQuantity[formattedItemName]--; 

            var updatedItemPrice = initialProductPrice[formattedItemName] * currentQuantity;
            $item.find('#prdk #unit-price').text('Unit Price : Rp. ' + updatedItemPrice.toLocaleString('id-ID'));

            updateTotalAfterQuantityChange();
        } else {
            delete productQuantity[formattedItemName];
            delete productPrice[formattedItemName];
            $item.remove();
            updateTotalAfterQuantityChange();
        }
    } else {
        console.error('Harga item tidak valid');
    }
});

    $("#trash-icon").on("click", function () {
        $(this).closest(".product-list").remove();
    });

    $("#Payment-button").click(function () {
        window.print();
    });
});