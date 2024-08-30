import { NextResponse } from "next/server";
import { getSession } from "next-auth/react";
import { headers } from "next/headers";
import { storage, ref, uploadBytes, getDownloadURL } from "@/lib/firebase";
import { Product } from "@/models/Product";
import User from "@/models/User";
import connectMongoDB from "@/lib/mongodb";

// Helper function to get session
async function getServerSession() {
  const req = {
    headers: Object.fromEntries(headers()),
  };
  const session = await getSession({ req });
  return session;
}

// Helper function to upload image to Firebase
async function uploadImageToFirebase(file) {
  const storageRef = ref(storage, "products/" + file.name);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function GET(request) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    connectMongoDB();
    const products = await Product.find();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Error fetching products" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Normalize the role for comparison
  const userRole = session.user.role.toLowerCase().replace(" ", "-");

  if (userRole !== "team-member") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectMongoDB();
    const body = await request.json();

    // Extract product data
    const { name, price, description, imageUrl } = body;

    // Validate required fields
    if (!name || !price || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate price
    if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      return NextResponse.json(
        { error: "Price must be a positive number" },
        { status: 400 }
      );
    }

    // Create and save the product
    const product = new Product({
      name,
      price: parseFloat(price),
      description,
      imageUrl,
    });
    await product.save();

    console.log("Product saved:", product);

    // Update the user (example: add to user's products list)
    await User.findByIdAndUpdate(session.user.id, {
      $push: { products: product._id },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Error creating product: " + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  const session = await getServerSession();

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    connectMongoDB();
    const formData = await request.formData();
    const productId = formData.get("id");

    // Extract update data
    const updates = {};
    for (const [key, value] of formData.entries()) {
      if (key !== "id" && key !== "image") {
        updates[key] = value;
      }
    }

    // If there's a new image, upload it and get the new URL
    const newImage = formData.get("image");
    if (newImage) {
      updates.imageUrl = await uploadImageToFirebase(newImage);
    }

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(productId, updates, {
      new: true,
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Error updating product" },
      { status: 500 }
    );
  }
}
