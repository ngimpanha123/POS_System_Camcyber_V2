// ================================================================>> Costom Library
/** @User */
import UsersType    from "./user/type.model";
import User         from "./user/user.model";

/** @Product */
import ProductsType from "./product/type.model";
import Product from "./product/product.model";

/** @Order */
import Order        from "./order/order.model";
import OrderDetails from "./order/detail.model";

const models = [

    /** @UserGroup */
    UsersType,
    User,

    /** @ProductGroup */
    ProductsType,
    Product,

    /** @OrderGroup */
    Order,
    OrderDetails,
];

export default models;
