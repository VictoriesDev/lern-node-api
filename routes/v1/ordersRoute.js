var express = require("express");
var router = express.Router();
const { response } = require("../../func/response.js");

// MODEL
const OrderSchema = require("../../models/orders.model");
const BillSchema = require("../../models/billings.model");

// TODO check product
router.get("/", async (req, res, next) => {
  try {
    const orders = await OrderSchema.find()
      .populate("user_id", "username email") // ดึงข้อมูล user ที่เกี่ยวข้อง
      .populate("product_id", "name price stock"); // ดึงข้อมูลสินค้า
    return await response(res, 200, {
      status: 200,
      message: "รายการสั่งซื้อทั้งหมด",
      data: orders,
    });
  } catch (error) {
    return await response(res, 500, {
      status: 500,
      message: error.message,
    });
  }
});

// TODO TEST
// // check product orders
// router.get("/test/:product_id/orders", async (req, res, next) => {
//   const { product_id } = req.params;
//   try {
//     const orders = await BillSchema.find({
//       "products.product_id": product_id,
//     });
//     return await response(res, 200, {
//       status: 200,
//       message: "รายการสั่งซื้อสำหรับผลิตภัณฑ์นี้",
//       data: orders,
//     });
//   } catch (error) {
//     return await response(res, 500, {
//       status: 500,
//       message: error.message,
//     });
//   }
// });

// // test create order
// router.post("/test/:user_id/orders", async (req, res, next) => {
//   const { user_id } = req.params;
//   const { products, totalAmount } = req.body;
//   try {
//     const canUpdate = [];
//     // check stock
//     for (const item of products) {
//       const check_stock = await ProductSchema.findById(item.product_id);
//       if (check_stock.stock < item.quantity) {
//         return await response(res, 400, {
//           status: 400,
//           message: "สินค้าไม่เพียงพอในสต็อก",
//         });
//       }

//       canUpdate.push({ product_id: item.product_id, quantity: item.quantity });
//     }

//     // update stock
//     for (const item of canUpdate) {
//       await ProductSchema.findByIdAndUpdate(item.product_id, {
//         $inc: { stock: -item.quantity },
//       });
//     }

//     const newBill = new BillSchema({
//       user: user_id,
//       products: canUpdate,
//       totalAmount: totalAmount,
//     });
//     await newBill.save();
//     return await response(res, 201, {
//       status: 201,
//       message: "Bill created successfully",
//     });
//   } catch (error) {
//     return await response(res, 500, {
//       status: 500,
//       message: error.message,
//     });
//   }
// });

module.exports = router;
