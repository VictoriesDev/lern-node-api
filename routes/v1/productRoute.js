var express = require("express");
var router = express.Router();
const { response } = require("../../func/response.js");

// MODEL
const ProductSchema = require("../../models/products.model");
const OrderSchema = require("../../models/orders.model");

// TODO : get all products
router.get("/", async function (req, res, next) {
  try {
    const products = await ProductSchema.find();

    if (products.length === 0) {
      return await response(res, 404, {
        status: 404,
        message: "No products found",
        data: [],
      });
    }
    const show_products = [];
    for (const product of products) {
      show_products.push({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        createdAt: product.createdAt,
      });
    }
    return await response(res, 200, {
      status: 200,
      message: "ข้อมูลสินค้าทั้งหมด",
      data: show_products,
    });
  } catch (error) {
    return await response(res, 500, {
      status: 500,
      message: error.message,
      data: null,
    });
  }
});

// TODO : get product by id
router.get("/:id", async function (req, res, next) {
  const { id } = req.params;
  try {
    const products = await ProductSchema.find({ _id: id });
    if (products.length === 0) {
      return await response(res, 404, {
        status: 404,
        message: "ไม่พบข้อมูลสินค้า",
        data: null,
      });
    }

    const show_products = {
      name: products[0].name,
      description: products[0].description,
      price: products[0].price,
      stock: products[0].stock,
      createdAt: products[0].createdAt,
    };

    return await response(res, 200, {
      status: 200,
      message: "พบข้อมูลสินค้า",
      data: show_products,
    });
  } catch (error) {
    return await response(res, 500, {
      status: 500,
      message: error.message,
      data: null,
    });
  }
});

// TODO : create product
router.post("/", async function (req, res, next) {
  const { name, price, description, stock } = req.body;
  console.log("data", req.body);
  try {
    const newProduct = new ProductSchema({
      name,
      description,
      price,
      stock,
    });

    await newProduct.save();
    return await response(res, 201, {
      status: 201,
      message: "สร้างสินค้าสำเร็จ",
      data: newProduct,
    });
  } catch (error) {
    return await response(res, 500, {
      status: 500,
      message: error.message,
    });
  }
});

// TODO : update product by id
router.put("/:id", async function (req, res, next) {
  const { id } = req.params;
  const { name, price, description, stock } = req.body;
  try {
    let newData = {};
    if (name != null && name !== "") {
      newData.name = name;
    }
    if (price != null && price !== "") {
      newData.price = price;
    }
    if (description != null && description !== "") {
      newData.description = description;
    }
    if (stock != null && stock !== "") {
      newData.stock = stock;
    }

    await ProductSchema.findOneAndUpdate({ _id: id }, newData, { new: true });
    return await response(res, 200, {
      status: 200,
      message: "อัพเดตสินค้าสำเร็จ",
      data: [],
    });
  } catch (error) {
    return await response(res, 500, {
      status: 500,
      message: error.message,
      data: null,
    });
  }
});

// TODO : delete product by id
router.delete("/:id", async function (req, res, next) {
  const { id } = req.params;
  try {
    await ProductSchema.findOneAndDelete({ _id: id });
    return await response(res, 200, {
      status: 200,
      message: "ลบสินค้าสำเร็จ",
      data: [],
    });
  } catch (error) {
    return await response(res, 500, {
      status: 500,
      message: error.message,
      data: null,
    });
  }
});

// TODO check product
router.get("/:id/orders", async (req, res, next) => {
  const { id } = req.params;
  try {
    const orders = await OrderSchema.find({ product_id: id })
      .populate("user_id", "username email") // ดึงข้อมูล user ที่เกี่ยวข้อง
      .populate("product_id", "name price stock"); // ดึงข้อมูลสินค้า

    if (orders.length === 0) {
      return await response(res, 404, {
        status: 404,
        message: "ไม่พบคำสั่งซื้อสำหรับสินค้านี้",
        data: null,
      });
    }

    const show_orders = [];
    for (const order of orders) {
      show_orders.push({
        user: order.user_id.email,
        product: order.product_id.name,
        quantity: order.quantity,
        totalAmount: order.totalAmount,
        orderDate: order.createdAt,
      });
    }
    return await response(res, 200, {
      status: 200,
      message: "รายการสั่งซื้อสำหรับสินค้านี้",
      data: show_orders,
    });
  } catch (error) {
    return await response(res, 500, {
      status: 500,
      message: error.message,
      data: null,
    });
  }
});

// TODO สร้างคำสั่งซื้อ
router.post("/:id/orders", async (req, res, next) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const user_id = req.user_id;
  try {
    // check stock
    const product = await ProductSchema.findById(id);
    const totalAmount = product.price * quantity;
    if (!product) {
      return await response(res, 404, {
        status: 404,
        message: "กรุณาเลือกสินค้าที่ต้องการสั่งซื้อ",
        data: null,
      });
    }
    if (product.stock < quantity) {
      return await response(res, 400, {
        status: 400,
        message: "สินค้าไม่เพียงพอในสต็อก",
        data: null,
      });
    }

    // update stock
    await ProductSchema.findByIdAndUpdate(id, {
      $inc: { stock: -quantity },
    });

    const newOrder = new OrderSchema({
      user_id: user_id,
      product_id: id,
      quantity,
      totalAmount,
    });

    await newOrder.save();

    return await response(res, 201, {
      status: 201,
      message: "สร้างคำสั่งซื้อสำเร็จ",
      data: newOrder,
    });
  } catch (error) {
    return await response(res, 500, {
      status: 500,
      message: error.message,
      data: null,
    });
  }
});

module.exports = router;
