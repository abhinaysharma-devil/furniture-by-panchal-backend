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
        background-color: #fd721c;
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
        <h1>FurnitureByPanchal</h1>
      </div>
      <div class="content">
        <h2>Your One-Time Password (OTP)</h2>
        <p>Please use the OTP below to continue your secure login or transaction:</p>
        <div class="otp-code">${otp}</div>
        <p>This code is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
      </div>
      <div class="footer">
        &copy; 2025 FurnitureByPanchal.com • All rights reserved<br />
        Having trouble? Contact support at <a href="mailto:support@furniturebypanchal.com">support@furniturebypanchal.com</a>
      </div>
    </div>
  </body>
</html>

  `;
}

export default otpTemplate;