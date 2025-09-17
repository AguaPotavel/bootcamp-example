module gallery::admin;

use sui::balance::{Self, Balance, zero};
use std::vector::{empty};
use sui::coin::{Self, Coin};
use sui::sui::SUI;

public struct AdminCap has key {
    id: UID,
}

public struct GalleryData has key {
    id: UID,
    fee: u64,
    addresses: vector<address>,
    balance: Balance<SUI>,
}

fun init(ctx: &mut TxContext){
    let admin_cap = AdminCap {
        id: object::new(ctx)
    };

    transfer::transfer(admin_cap, tx_context::sender(ctx));

    let gallery = GalleryData {
        id: object::new(ctx),
        fee: 1_000_000_00,
        addresses: empty(),
        balance: zero<SUI>(),
    };

    transfer::share_object(gallery);
}

fun add_address(gallery: &mut GalleryData, address: address){
    gallery.addresses.push_back(address);
}

public(package) fun get_fee(gallery: &mut GalleryData): u64{
    gallery.fee
}

public(package) fun handle_payment(gallery: &mut GalleryData, mut payment: Coin<SUI>, ctx: &mut TxContext){
    coin::put<SUI>(&mut gallery.balance, payment);
    add_address(gallery, tx_context::sender(ctx));
}

public fun withdraw_balance(gallery: &mut GalleryData, _cap: &AdminCap, amount: u64, ctx: &mut TxContext): Coin<SUI>{
    coin::take<SUI>(&mut gallery.balance, amount, ctx)
}
