
db.carts.aggregate([
    {
        $match:{
            userId:ObjectId("687b0d0cfa674d6fba68438b")
        },
       

    },
    {
         $unwind:"$items"
    },
    {
        $lookup:{
            from:"products",
            foreignField:"_id",
            localField:"items.productId",
            as:"productDetails"
        }
    },
    {
        $addFields:{
            product:{$arrayElemAt:["$productDetails",0]}
        }
    },
    {
        $addFields:{
            total:{
                $multiply:["$product.productPrice","$items.quantity"]
            }
        }
    }
])



const { id: productId } = req.params; // Get productId from route params
  const { quantity } = req.body; // Get quantity from request body
  const { id: userId } = req.session.user; // Get userId from session

  // --- 1. Input Validation ---
  const numQuantity = Number(quantity);
  if (isNaN(numQuantity) || numQuantity <= 0) {
    return res.status(400).json({ message: "A valid, positive quantity is required." });
  }

  try {
    // --- 2. NEW: Validate that the product exists ---
    // This is the crucial step to prevent adding non-existent items to the cart.
    const product = await productModel.findById(productId);
    if (!product) {
        return res.status(404).json({ message: "Product not found. Cannot add to cart." });
    }

    // --- 3. Find the user's cart ---
    let cart = await cartModel.findOne({ userId });

    if (cart) {
      // --- CART EXISTS ---
      // --- 4. Check if product is already in the cart ---
      const productIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (productIndex > -1) {
        // Product is in the cart, so update its quantity.
        cart.items[productIndex].quantity += numQuantity;
      } else {
        // Product is not in the cart, add it as a new item.
        cart.items.push({ productId, quantity: numQuantity });
      }

      // --- 5. IMPORTANT: Mark the array as modified ---
      cart.markModified('items');
      await cart.save();
      res.json({ message: "Cart updated successfully." });

    } else {
      // --- CART DOES NOT EXIST ---
      // --- 6. Create a new cart with the item ---
      const newCartData = {
        userId,
        items: [{ productId, quantity: numQuantity }],
      };
      await cartModel.create(newCartData);
      res.status(201).json({ message: "Product added and new cart created." });
    }
  } catch (err) {
    // --- 7. Error Handling ---
    console.error("Error in addToCart:", err);
    res.status(500).json({ message: "Server error while adding to cart." });
  }

















  try {
        const userId = req.session.user.id;

        // --- 1. Find the user's cart ---
        const cart = await cartModel.findOne({ userId });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Your cart is empty. Cannot create an order." });
        }

        // --- 2. OPTIMIZATION: Fetch all product details in one query ---
        const productIds = cart.items.map(item => item.productId);
        
        // For debugging: Let's see what IDs are in the cart and what products are found.
        console.log("Product IDs from cart:", productIds);
        const products = await productModel.find({ '_id': { $in: productIds } });
        console.log("Products found in database:", products);

        // Create a Map for fast lookups { 'productId': productObject } to avoid nested loops.
        const productMap = new Map(products.map(p => [p._id.toString(), p]));

        let total = 0;
        const orderItems = [];

        // --- 3. Build the final order items array ---
        for (const cartItem of cart.items) {
            const product = productMap.get(cartItem.productId.toString());

            if (!product) {
                // This warning will now be much rarer because of the validation in addTocart.
                console.warn(`Product with ID ${cartItem.productId} not found for order creation. It may have been deleted.`);
                continue;
            }

            const subtotal = product.productPrice * cartItem.quantity;
            total += subtotal;

            orderItems.push({
                productId: product._id,
                productName: product.productName,
                productPrice: product.productPrice,
                quantity: cartItem.quantity,
                subtotal,
            });
        }
        
        if (orderItems.length === 0) {
            // This error should now only happen if a product was deleted *after* being added to the cart.
            return res.status(400).json({ message: "The products in your cart are no longer available." });
        }

        // --- 4. Create the new order ---
        const newOrder = await orderModel.create({
            userId,
            items: orderItems,
            total,
            deliveryStatus: "pending",
        });

        // --- 5. Clear the user's cart ---
        cart.items = [];
        await cart.save();

        res.status(201).json({ message: "Order placed successfully!", order: newOrder });

    } catch (err) {
        // --- 6. Error Handling ---
        console.error("Error in createOrder:", err);
        res.status(500).json({ message: "Server error while creating the order." });
    }









db.orders.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "userDetails"
    }
  },
  {$unwind:"$items"},
  { $unwind: "$userDetails" },
  {
    $project: {
      _id: 1,
      userName: "$userDetails.name",
      total: 1,
      deliveryStatus: 1,
      items: 1
    }
  }
])

