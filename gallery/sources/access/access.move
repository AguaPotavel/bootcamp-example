module gallery::access;

use gallery::admin::GalleryData;
use sui::coin::{Self, Coin};
use sui::sui::SUI;

public fun payAccess(gallery: &mut GalleryData, mut payment: Coin<SUI>, ctx: &mut TxContext){
    assert!(coin::value(&payment) >= gallery.get_fee(), 1);

    let mut amount = coin::split<SUI>(&mut payment, gallery.get_fee(), ctx);

    gallery.handle_payment(amount, ctx);

    if(coin::value<SUI>(&payment) > 0){
        transfer::public_transfer(payment, tx_context::sender(ctx));
    } else {
        coin::destroy_zero<SUI>(payment);
    }
}
