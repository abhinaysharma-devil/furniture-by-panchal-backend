const otpTemplate = (otp) => {
  return `
    <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>OTP Verification - FurnitureByPanchal</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .email-container {
        max-width: 600px;
        margin: auto;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      .header {
        background-color: #ebebebff;
        color: #fff;
        text-align: center;
        padding: 20px 0;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
      }
      .content {
        padding: 30px 20px;
        text-align: center;
      }
      .content h2 {
        color: #333;
        font-size: 22px;
        margin-bottom: 10px;
      }
      .otp-code {
        display: inline-block;
        font-size: 32px;
        letter-spacing: 6px;
        background-color: #9efb56;
        color: #111;
        padding: 12px 24px;
        border-radius: 8px;
        margin: 20px 0;
      }
      .footer {
        font-size: 13px;
        color: #777;
        text-align: center;
        padding: 15px;
        background-color: #f9f9f9;
      }
      @media only screen and (max-width: 600px) {
        .otp-code {
          font-size: 26px;
          padding: 10px 18px;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <img src="https://furniturebypanchal.com/fbp-logo-removebg-preview.png" alt="FurnitureByPanchal Logo" style="width: 300px; height: auto; margin-top: 10px;" />
      </div>
      <div class="content">
        <h2>Your One-Time Password (OTP)</h2>
        <p>Please use the OTP below to continue your secure login or transaction:</p>
        <div class="otp-code">${otp}</div>
        <p>This code is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
      </div>
      <div class="footer">
        &copy; 2025 FurnitureByPanchal.com • All rights reserved<br />
        Having trouble? Contact support at <a href="mailto:panchalabhinay@gmail.com">panchalabhinay@gmail.com</a>
      </div>
    </div>
  </body>
</html>

  `;
}

// const orderTemplateForGuest = (orderDetails) => {
//   return `
//     <!DOCTYPE html>
// <html>
//   <head>
//     <meta charset="UTF-8" />
//     <title>OTP Verification - FurnitureByPanchal</title>
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//     <style>
//       body {
//         font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//         background-color: #f4f4f4;
//         margin: 0;
//         padding: 0;
//       }
//       .email-container {
//         max-width: 600px;
//         margin: auto;
//         background-color: #ffffff;
//         border-radius: 10px;
//         box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//         overflow: hidden;
//       }
//       .header {
//         background-color: #fd721c;
//         color: #fff;
//         text-align: center;
//         padding: 20px 0;
//       }
//       .header h1 {
//         margin: 0;
//         font-size: 24px;
//       }
//       .content {
//         padding: 30px 20px;
//         text-align: center;
//       }
//       .content h2 {
//         color: #333;
//         font-size: 22px;
//         margin-bottom: 10px;
//       }
//       .otp-code {
//         display: inline-block;
//         font-size: 32px;
//         letter-spacing: 6px;
//         background-color: #9efb56;
//         color: #111;
//         padding: 12px 24px;
//         border-radius: 8px;
//         margin: 20px 0;
//       }
//       .footer {
//         font-size: 13px;
//         color: #777;
//         text-align: center;
//         padding: 15px;
//         background-color: #f9f9f9;
//       }
//       @media only screen and (max-width: 600px) {
//         .otp-code {
//           font-size: 26px;
//           padding: 10px 18px;
//         }
//       }
//     </style>
//   </head>
//   <body>
//     <div class="email-container">
//       <div class="header">
//         <img src="https://furniturebypanchal.com/fbp-logo-removebg-preview.png" alt="FurnitureByPanchal Logo" style="width: 100px; height: auto; margin-top: 10px;" />
//       </div>
//       <div class="content">
//         <h2>Order Details</h2>
//         <p>Please find your order details below:</p>

//         <div className="p-6">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//               <div className="border border-gray-200 rounded-lg p-4 text-center">
//                 <Calendar className="h-6 w-6 text-primary mx-auto mb-2" />
//                 <h3 className="font-medium mb-1">Order Date</h3>
//                 <p className="text-gray-600">${orderDate}</p>
//               </div>

//               <div className="border border-gray-200 rounded-lg p-4 text-center">
//                 <Truck className="h-6 w-6 text-primary mx-auto mb-2" />
//                 <h3 className="font-medium mb-1">Estimated Delivery</h3>
//                 <p className="text-gray-600">${deliveryDate}</p>
//               </div>
//             </div>

//             <div className="border-t border-gray-200 pt-6 mb-6">
//               <h2 className="text-lg font-semibold mb-4">Order Details</h2>

//               <div className="divide-y divide-gray-200">
//                 ${JSON.parse(orderByIdData.orderDetails).items.map((item, index) => (
//                   <div key={index} className="py-4 flex items-center">
//                     <div className="flex-grow">
//                       <p className="font-medium">{item.title}</p>
//                       <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="border-t border-gray-200 pt-4 mt-4">
//                 <div className="flex justify-between py-2">
//                   <span className="text-gray-600">Subtotal</span>
//                   <span>${formatPrice(JSON.parse(orderByIdData.orderDetails).total)}</span>
//                 </div>
//                 <div className="flex justify-between py-2">
//                   <span className="text-gray-600">Shipping</span>
//                   <span>${JSON.parse(orderByIdData.orderDetails).total > 25000 ? 'Free' : formatPrice(500)}</span>
//                 </div>
//                 <div className="flex justify-between py-2">
//                   <span className="text-gray-600">Tax (GST 18%)</span>
//                   <span>${formatPrice(JSON.parse(orderByIdData.orderDetails).total * 0.18)}</span>
//                 </div>
//                 <div className="flex justify-between py-2 font-semibold text-lg">
//                   <span>Total</span>
//                   <span className="text-primary">
//                     ${formatPrice(
//                       JSON.parse(orderByIdData.orderDetails).total +
//                       (JSON.parse(orderByIdData.orderDetails).total > 25000 ? 0 : 500) +
//                       (JSON.parse(orderByIdData.orderDetails).total * 0.18)
//                     )}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="border-t border-gray-200 pt-6">
//               <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <p className="font-medium">${JSON.parse(orderByIdData.orderDetails)?.shippingAddress?.name}</p>
//                   <p>${JSON.parse(orderByIdData.orderDetails)?.shippingAddress?.address}</p>
//                   <p>
//                     ${JSON.parse(orderByIdData.orderDetails)?.shippingAddress?.city}, ${JSON.parse(orderByIdData.orderDetails)?.shippingAddress?.state} - ${JSON.parse(orderByIdData.orderDetails)?.shippingAddress?.pincode}
//                   </p>
//                   <p>Phone: ${JSON.parse(orderByIdData.orderDetails)?.shippingAddress?.phone}</p>
//                 </div>

//                 <div className="md:text-right">
//                   <p className="font-medium">Delivery Method</p>
//                   <p>Standard Delivery</p>
//                   <p className="text-gray-600">Delivered within 5-7 business days</p>
//                 </div>
//               </div>
//             </div>
//           </div>


//         <p>This code is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
//       </div>
//       <div class="footer">
//         &copy; 2025 FurnitureByPanchal.com • All rights reserved<br />
//         Having trouble? Contact support at <a href="mailto:support@furniturebypanchal.com">support@furniturebypanchal.com</a>
//       </div>
//     </div>
//   </body>
// </html>

//   `;
// }

const orderTemplateForAdmin = (orderDetails) => {
  return `
    <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>OTP Verification - FurnitureByPanchal</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .email-container {
        max-width: 600px;
        margin: auto;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      .header {
        background-color: #ebebebff;
        color: #fff;
        text-align: center;
        padding: 20px 0;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
      }
      .content {
        padding: 30px 20px;
        text-align: left;
      }
      .content h2 {
        color: #333;
        font-size: 22px;
        margin-bottom: 10px;
      }
      .otp-code {
        display: inline-block;
        font-size: 32px;
        letter-spacing: 6px;
        background-color: #9efb56;
        color: #111;
        padding: 12px 24px;
        border-radius: 8px;
        margin: 20px 0;
      }
      .footer {
        font-size: 13px;
        color: #777;
        text-align: center;
        padding: 15px;
        background-color: #f9f9f9;
      }
      @media only screen and (max-width: 600px) {
        .otp-code {
          font-size: 26px;
          padding: 10px 18px;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <img src="https://furniturebypanchal.com/fbp-logo-removebg-preview.png" alt="FurnitureByPanchal Logo" style="width: 300px; height: auto; margin-top: 10px;" />
      </div>
      <div class="content">
        <h2>You have a new order</h2>
        <p>Here are Details</p>
        <div><b>ID - </b>${orderDetails.id}</div>
        <div><b>USER ID -</b>${orderDetails.userId}</div>
        <div><b>ORDER DETAILS -</b> ${orderDetails?.orderDetails}</div>
        <div><b>STATUS -</b>${orderDetails.status}</div>
      </div>
      <div class="footer">
        &copy; 2025 FurnitureByPanchal.com • All rights reserved<br />
        Having trouble? Contact support at <a href="mailto:panchalabhinay@gmail.com">panchalabhinay@gmail.com</a>
      </div>
    </div>
  </body>
</html>

  `;
}

const clientConcernTemplate = (payload) => {
  return `
    <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>OTP Verification - FurnitureByPanchal</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .email-container {
        max-width: 600px;
        margin: auto;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      .header {
        background-color: #ebebebff;
        color: #fff;
        text-align: center;
        padding: 20px 0;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
      }
      .content {
        padding: 30px 20px;
        text-align: left;
      }
      .content h2 {
        color: #333;
        font-size: 22px;
        margin-bottom: 10px;
      }
      .otp-code {
        display: inline-block;
        font-size: 32px;
        letter-spacing: 6px;
        background-color: #9efb56;
        color: #111;
        padding: 12px 24px;
        border-radius: 8px;
        margin: 20px 0;
      }
      .footer {
        font-size: 13px;
        color: #777;
        text-align: center;
        padding: 15px;
        background-color: #f9f9f9;
      }
      @media only screen and (max-width: 600px) {
        .otp-code {
          font-size: 26px;
          padding: 10px 18px;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <img src="https://furniturebypanchal.com/fbp-logo-removebg-preview.png" alt="FurnitureByPanchal Logo" style="width: 300px; height: auto; margin-top: 10px;" />
      </div>
      <div class="content">
        <h2>Client Concern</h2>
        <p>Here are Details</p>
        <div><b>Name - </b>${payload.name}</div>
        <div><b>Email - </b>${payload.email}</div>
        <div><b>Phone - </b>${payload.phone}</div>
        <div><b>Message - </b>${payload.message}</div>
      </div>
      <div class="footer">
        &copy; 2025 FurnitureByPanchal.com • All rights reserved<br />
        Having trouble? Contact support at <a href="mailto:panchalabhinay@gmail.com">panchalabhinay@gmail.com</a>
      </div>
    </div>
  </body>
</html>

  `;
}
export { orderTemplateForAdmin, otpTemplate, clientConcernTemplate };