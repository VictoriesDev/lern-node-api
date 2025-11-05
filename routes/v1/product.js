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
    const data_products = [];
    for (const product of products) {
      data_products.push({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        createdAt: product.createdAt,
      });
    }
    await response(res, 200, {
      status: 200,
      message: "ผลิตภัณฑ์ทั้งหมด",
      data: products,
    });
  } catch (error) {
    return await response(res, 500, {
      status: 500,
      message: error.message,
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
        message: "ไม่พบผลิตภัณฑ์",
        data: [],
      });
    }
    await response(res, 200, {
      status: 200,
      message: "พบผลิตภัณฑ์",
      data: products,
    });
  } catch (error) {
    return await response(res, 500, {
      status: 500,
      message: error.message,
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
    await response(res, 201, {
      status: 201,
      message: "Product created successfully",
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
    await response(res, 200, {
      status: 200,
      message: "Product updated successfully",
    });
  } catch (error) {
    return await response(res, 500, {
      status: 500,
      message: error.message,
    });
  }
});

// TODO : delete product by id
router.delete("/:id", async function (req, res, next) {
  const { id } = req.params;
  try {
    await ProductSchema.findOneAndDelete({ _id: id });
    await response(res, 200, {
      status: 200,
      message: "ลบผลิตภัณฑ์สำเร็จ",
    });
  } catch (error) {
    return await response(res, 500, {
      status: 500,
      message: error.message,
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
    return await response(res, 200, {
      status: 200,
      message: "รายการสั่งซื้อสำหรับผลิตภัณฑ์นี้",
      data: orders,
    });
  } catch (error) {
    return await response(res, 500, {
      status: 500,
      message: error.message,
    });
  }
});

// TODO สร้างคำสั่งซื้อ
router.post("/:id/orders", async (req, res, next) => {
  const { id } = req.params;
  const { user_id, quantity } = req.body;

  try {
    // check stock
    const product = await ProductSchema.findById(id);
    const totalAmount = product.price * quantity;
    if (!product) {
      return await response(res, 404, {
        status: 404,
        message: "ไม่พบผลิตภัณฑ์",
      });
    }
    if (product.stock < quantity) {
      return await response(res, 400, {
        status: 400,
        message: "สินค้าไม่เพียงพอในสต็อก",
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
    });
  } catch (error) {
    return await response(res, 500, {
      status: 500,
      message: error.message,
    });
  }
});

module.exports = router;
