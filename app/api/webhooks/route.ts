import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const POST = async (req: NextRequest) => {
  console.log("Webhook POST received");
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("Stripe-Signature") as string;
    console.log("Received Stripe Signature:", signature);

    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log("Received Stripe Event:", event);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("webhooks_POST", session);

      const customerInfo = {
        clerkId: session?.client_reference_id,
        name: session?.customer_details?.name,
        email: session?.customer_details?.email,
      };

      const shippingAddress = {
        street: session?.shipping_details?.address?.line1,
        city: session?.shipping_details?.address?.city,
        state: session?.shipping_details?.address?.state,
        postalCode: session?.shipping_details?.address?.postal_code,
        country: session?.shipping_details?.address?.country,
      };

      const retrieveSession = await stripe.checkout.sessions.retrieve(
        session.id,
        { expand: ["line_items.data.price.product"] }
      );

      const lineItems = await retrieveSession?.line_items?.data;

      const orderItems = lineItems?.map((item: any) => {
        return {
          product: item.price.product.metadata.productId,
          color: item.price.product.metadata.color || "N/A",
          size: item.price.product.metadata.size || "N/A",
          quantity: item.quantity,
        };
      });

      await connectToDB().catch((err) => {
        console.log("Database connection error: ", err);
      });

      const newOrder = new Order({
        customerClerkId: customerInfo.clerkId,
        products: orderItems,
        shippingAddress,
        shippingRate: session?.shipping_cost?.shipping_rate,
        totalAmount: session.amount_total ? session.amount_total / 100 : 0,
      });

      console.log("New Order: ", newOrder);

      await newOrder.save();

      let customer = await Customer.findOne({ clerkId: customerInfo.clerkId });

      if (customer) {
        customer.orders.push(newOrder._id);
      } else {
        customer = new Customer({
          ...customerInfo,
          orders: [newOrder._id],
        });
      }
      console.log("Customer to be saved: ", customer);
      await customer.save();
    }

    return new NextResponse("Order created", { status: 200 });
  } catch (err) {
    console.log("[webhooks_POST] Error:", err);
    return new NextResponse("Failed to process the event", { status: 500 });
  }
};
