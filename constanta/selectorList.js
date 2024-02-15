const homepageSelector = {
    homepageMenu: "//div[@class='sc-ysqdlt-3 NsQWJ']//div[1]",
    categoryMenu:"//div[@class='sc-ysqdlt-3 NsQWJ']//div[2]",
    orderTrackMenu:"//div[@class='sc-ysqdlt-3 NsQWJ']//div[3]",
    transactionMenu:"//div[@class='sc-ysqdlt-3 NsQWJ']//div[3]",
    loginMenu:"//div[@class='sc-ysqdlt-3 NsQWJ']//div[4]",
    accountMenu:"//div[@class='sc-ysqdlt-3 NsQWJ']//div[4]",
    getLocIcon: ".sc-rq82e3-0.joFQRE.sc-30y1kl-3.gczumF"
};

const locationSelector = {
    jakartaSelatan: "//span[normalize-space()='KOTA ADM. JAKARTA SELATAN']",
    backButton: "//div[@class='sc-1crxk01-0 dTRqRo']//span[@class='sc-rq82e3-0 bYIQff']//*[name()='svg']"
}

const loginSelector = {
    usernameField:".sc-1auyczi-2.cxACAK.sc-1uj1rn4-2.gFJWwS",
    passwordField:".sc-1auyczi-2.cxACAK.sc-1uj1rn4-2.gFJWwS",
    loginButton:".sc-1nihjkh-2.VYvtK.sc-15dd0e1-0.dgredN",
    forgotPasswordButton:"",
    registerButton:""
}

const plpSelector = {
    homeserviceProduct : "body main[id='app'] div[class='sc-1crxk01-0 jkvoMP'] div div div:nth-child(1) div:nth-child(1) a:nth-child(1) div:nth-child(2) div:nth-child(3)"
};

const shortcut ={
    sukuCadang: "//label[normalize-space()='Suku Cadang']",
    layananBengkel : "//label[normalize-space()='Layanan Bengkel']",
    homeservice : "//label[normalize-space()='Home Service']"
}

const productDetailPage = {
    addToCartButton : "//button[normalize-space()='+ Keranjang']",
    addQtyCart : "//button[normalize-space()='+']",
    rdcQtyCart : "//button[normalize-space()='-']",
    checkboxCart : "//div[@class='sc-14l7xyx-3 dbTlbf']",
    addToCart :"//button[@id='add-cart-button']"
}

const cartPage ={
    cartIcon : "//div[@class='sc-pk5e3p-0 fQUczW']//button[3]//div[1]//span[1]//*[name()='svg']//*[name()='rect' and contains(@opacity,'0.01')]",
    checklistAll: ".sc-14l7xyx-0.jXJvcI",
    pointField : ".sc-1auyczi-2.gXBdsu.sc-1uj1rn4-2.gFJWwS",
    usePointButton : ".sc-w647qe-0.iggsXM",
    couponField : "//input[@placeholder='Tuliskan kupon diskon']",
    useCouponButton : "//span[@class='sc-w647qe-0 iggsXM']",
    checkoutButton :".sc-1nihjkh-2.VYvtK.sc-ysqdlt-4.sc-ysqdlt-5.eYOmyF",
    emptyCart :".sc-w647qe-0.dQZTbH",
    deleteProduct :".sc-w647qe-0.ihQTQB",
    backButton :".sc-rq82e3-0.bYIQff"
}


const checkoutPage ={
    shippingMethodButton: "//span[normalize-space()='Pilih Metode Pengiriman']",
    toggleShipment: ".sc-qbeijm-3.ewtMdp",
    firstShipment:"//div[@class='sc-1crxk01-0 irdIMa']//div[1]",
    secondShipment:"//div[@class='sc-1crxk01-0 irdIMa']//div[2]",
    useShipmentButton: "//button[@id='add-cart-button']",
    cadangPaymentButton:"//span[normalize-space()='Pilih Metode Pembayaran']",
    paymentMethodButton: "//span[@class='sc-w647qe-0 UeRhO']",
    useButton : "//button[@id='add-cart-button']",
    paymentNowButton : ".sc-1nihjkh-2.VYvtK.sc-ysqdlt-4.sc-ysqdlt-5.jgbicr"

}

const orderPage = {
    orderCreatedMsg : ".sc-w647qe-0.fgurNo",
    detailOrder : ".sc-w647qe-0.gNzNfs"
}

const paymentMethodList ={
    mandiri_va :"//span[normalize-space()='Mandiri VA']",
    bca_va: "//span[normalize-space()='BCA VA']",
    bri_va: "//span[normalize-space()='BRI VA']",
    cimb_va: "//span[normalize-space()='CIMB VA']",
    bsi_va: "//span[normalize-space()='BSI VA']",
    danamon_va: "//span[normalize-space()='Danamon VA']",
    permata_va: "//span[normalize-space()='Permata VA']"

}

const headerPageSelector ={
    homepage: "//div[@class='sc-1crxk01-0 MmIck']//button[1]//div[1]//span[1]//*[name()='svg']"
}

export {homepageSelector,loginSelector, plpSelector, shortcut, productDetailPage, cartPage, checkoutPage, orderPage, locationSelector, headerPageSelector };
