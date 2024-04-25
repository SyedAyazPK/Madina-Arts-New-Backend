"use-strict";

module.exports = (app) => {
  app.use("/api/v2/auth", require("../controller/AuthController"));
  app.use("/api/v2/user", require("../controller/UserController"));
  app.use("/api/v2/brand", require("../controller/BrandController"));
  app.use("/api/v2/category", require("../controller/CategoryController"));
  app.use("/api/v2/attribute", require("../controller/AttributeController"));
  app.use("/api/v2/variation", require("../controller/VariationController"));
  app.use("/api/v2/product", require("../controller/ProductController"));
  app.use("/api/v2/inventory", require("../controller/InventoryController"));
  app.use("/api/v2/filter", require("../controller/FilterController"));
  app.use("/api/v2/cart", require("../controller/CartController"));
  app.use("/api/v2/checkout", require("../controller/CheckoutController"));
  app.use("/api/v2/review", require("../controller/ReviewController"));
  app.use(
    "/api/v2/customer",
    require("../controller/BlockedCustomerController")
  );
  app.use(
    "/api/v2/cash-withdraw",
    require("../controller/CashWithdrawController")
  );
  app.use("/api/v2/order", require("../controller/OrderController"));
  app.use("/api/v2/coupon", require("../controller/CoupenController"));
  app.use("/api/v2/uploadFile", require("../controller/FileController"));
  app.use(
    "/api/v2/shippingzone",
    require("../controller/ShippingZoneController")
  );
  app.use(
    "/api/v2/shipmentTracking",
    require("../controller/ShipmentController")
  );
  app.use(
    "/api/v2/accountPrivacy",
    require("../controller/AccountsPrivacyController")
  );
  app.use(
    "/api/v2/shippingProvider",
    require("../controller/ShippingProviderController")
  );
  app.use("/api/v2/report", require("../controller/ReportController"));
};
