const currency = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
});

const brandEmail = "orders@everythinghooked.online";
const brandSite = "www.everythinghooked.online";

export async function sendOrderConfirmationEmail(order) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ORDER_EMAIL_FROM;

  if (!apiKey || !from || apiKey === "re_your_resend_api_key") {
    console.warn("Order confirmation email skipped: RESEND_API_KEY or ORDER_EMAIL_FROM is missing.");
    return { skipped: true };
  }

  const email = buildOrderConfirmationEmail(order);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [order.customer_email],
      reply_to: process.env.ORDER_EMAIL_REPLY_TO,
      subject: email.subject,
      html: email.html,
      text: email.text,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend email failed with ${response.status}: ${body}`);
  }

  return response.json();
}

export function buildOrderConfirmationEmail(order) {
  const items = Array.isArray(order.cart_data) ? order.cart_data : [];
  const orderNumber = shortOrderId(order.id);
  const subtotal = items.reduce((total, item) => total + Number(item.totalAmount ?? 0), 0);
  const total = Number(order.total_amount ?? subtotal);
  const firstName = firstNameOnly(order.customer_name);
  const assetBaseUrl = getAssetBaseUrl();

  const itemRows = items.map((item) => buildItemRow(item, assetBaseUrl)).join("");
  const textItems = items
    .map(
      (item) =>
        `- ${item.name} (${item.color} / ${item.size}) x ${item.qty}: ${currency.format(
          Number(item.totalAmount ?? 0) / 100,
        )}`,
    )
    .join("\n");

  return {
    subject: `EverythingHooked order ${orderNumber} confirmed`,
    html: `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light only" />
    <meta name="supported-color-schemes" content="light only" />
    <title>EverythingHooked order confirmed</title>
    <style>
      :root {
        color-scheme: light only;
        supported-color-schemes: light;
      }

      body,
      table,
      td,
      div,
      p,
      h1,
      h2,
      span {
        color-scheme: light only;
      }

      @media screen and (max-width: 600px) {
        .email-outer {
          padding: 20px 10px 18px !important;
        }

        .email-shell {
          max-width: 100% !important;
        }

        .email-brand {
          font-size: 34px !important;
        }

        .email-tagline {
          font-size: 11px !important;
          letter-spacing: 3px !important;
        }

        .email-hero {
          padding-left: 16px !important;
          padding-right: 16px !important;
        }

        .email-title {
          font-size: 30px !important;
          line-height: 1.12 !important;
        }

        .email-copy {
          font-size: 16px !important;
        }

        .email-status-wrap {
          padding-left: 12px !important;
          padding-right: 12px !important;
        }

        .email-card-pad {
          padding-left: 18px !important;
          padding-right: 18px !important;
        }

        .email-order-title {
          font-size: 20px !important;
        }

        .email-item-image,
        .email-item-detail,
        .email-item-price {
          display: block !important;
          width: 100% !important;
        }

        .email-item-image {
          padding: 0 0 14px !important;
        }

        .email-item-detail {
          padding: 0 !important;
        }

        .email-item-price {
          padding: 12px 0 0 !important;
          text-align: left !important;
        }

        .email-product-img {
          width: 100% !important;
          max-width: 230px !important;
          height: auto !important;
        }

        .email-hide-mobile {
          display: none !important;
        }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:#fff0f7!important;color:#09090b!important;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="#fff0f7" style="background:#fff0f7!important;background-image:linear-gradient(180deg,#fff0f7 0%,#fff7fb 52%,#ffebf8 100%)!important;color:#09090b!important;">
      <tr>
        <td align="center" class="email-outer" style="padding:28px 14px 20px;color:#09090b!important;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="email-shell" style="max-width:640px;width:100%;color:#09090b!important;">
            <tr>
              <td align="center" style="padding:0 0 22px;color:#09090b!important;">
                <div class="email-brand" style="font-family:Georgia,Times,serif;font-style:italic;font-size:42px;line-height:1;color:#09090b!important;">
                  EverythingHooked<span style="color:#c25bf5!important;">&hearts;</span>
                </div>
                <div class="email-tagline" style="margin-top:12px;color:#ec4699!important;font-size:13px;font-weight:700;letter-spacing:4px;text-transform:uppercase;">
                  Handmade with care &hearts;
                </div>
              </td>
            </tr>

            <tr>
              <td class="email-hero" style="padding:0 40px 14px;color:#09090b!important;">
                <h1 class="email-title" style="margin:0 0 12px;text-align:center;font-size:36px;line-height:1.15;color:#09090b!important;">
                  Your order is confirmed <span style="color:#ec4699!important;">&hearts;</span>
                </h1>
                <p class="email-copy" style="margin:0 auto;max-width:560px;font-size:18px;line-height:1.45;color:#09090b!important;">
                  Hi ${escapeHtml(firstName)},<br />
                  Thank you for your order! Your payment has been received and we'll start preparing your handmade piece with love.
                </p>
              </td>
            </tr>

            <tr>
              <td align="center" class="email-status-wrap" style="padding:0 40px 22px;color:#09090b!important;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="#fff7fb" style="max-width:560px;background:#fff7fb!important;border:1px solid #ebe0e6;border-radius:16px;box-shadow:0 8px 24px rgba(236,70,153,0.16);color:#09090b!important;">
                  <tr>
                    <td align="center" width="45%" style="padding:18px 12px;">
                      <div style="width:42px;height:42px;border-radius:50%;margin:0 auto 8px;background:#ec4699!important;color:#ffffff;font-size:28px;line-height:42px;font-weight:700;">&#10003;</div>
                      <div style="font-weight:700;font-size:15px;color:#09090b!important;">Payment received</div>
                    </td>
                    <td align="center" width="10%" style="padding:18px 0;color:#c25bf5!important;font-size:28px;">&rarr;</td>
                    <td align="center" width="45%" style="padding:18px 12px;">
                      <div style="width:42px;height:42px;border-radius:50%;margin:0 auto 8px;background:#f8f2f5!important;border:2px solid #c25bf5;color:#c25bf5!important;font-size:23px;line-height:40px;">&#9673;</div>
                      <div style="font-weight:700;font-size:15px;color:#09090b!important;">Preparing your order</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:0 0 14px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="#fff7fb" style="background:#fff7fb!important;border:1px solid #ebe0e6;border-radius:16px;box-shadow:0 8px 24px rgba(236,70,153,0.14);color:#09090b!important;">
                  <tr>
                    <td class="email-card-pad" style="padding:24px 28px 0;color:#09090b!important;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          <td valign="middle" style="width:48px;">
                            <div style="width:38px;height:38px;border-radius:50%;background:#f8f2f5!important;color:#ec4699!important;text-align:center;line-height:38px;font-size:24px;">&#128203;</div>
                          </td>
                          <td valign="middle">
                            <h2 class="email-order-title" style="margin:0;font-size:22px;letter-spacing:0.5px;color:#09090b!important;">ORDER ${orderNumber}</h2>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td class="email-card-pad" style="padding:16px 28px 0;color:#09090b!important;">
                      ${itemRows}
                    </td>
                  </tr>
                  <tr>
                    <td class="email-card-pad" style="padding:10px 28px 24px;color:#09090b!important;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #ebe0e6;padding-top:16px;">
                        <tr>
                          <td style="font-size:16px;padding:4px 0;color:#09090b!important;">Subtotal</td>
                          <td align="right" style="font-size:16px;padding:4px 0;color:#09090b!important;">${currency.format(subtotal / 100)}</td>
                        </tr>
                        <tr>
                          <td style="font-size:16px;padding:4px 0;color:#09090b!important;">Delivery</td>
                          <td align="right" style="font-size:16px;padding:4px 0;color:#09090b!important;">R 0,00<br /><span style="font-size:13px;">(Included)</span></td>
                        </tr>
                        <tr>
                          <td style="font-size:19px;font-weight:800;padding:14px 0 0;color:#09090b!important;">Total paid</td>
                          <td align="right" style="font-size:19px;font-weight:800;padding:14px 0 0;color:#ec4699!important;">${currency.format(total / 100)}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:0 0 14px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f8f2f5" style="background:#f8f2f5!important;border:1px solid #ebe0e6;border-radius:16px;color:#09090b!important;">
                  <tr>
                    <td align="center" width="110" style="padding:18px 12px;">
                      <div style="width:54px;height:54px;border-radius:50%;background:#fff7fb!important;color:#ec4699!important;text-align:center;line-height:54px;font-size:30px;">&#128197;</div>
                    </td>
                    <td style="padding:18px 12px;">
                      <div style="font-weight:800;font-size:18px;color:#09090b!important;">Estimated dispatch</div>
                      <div style="font-weight:800;font-size:17px;color:#ec4699!important;margin-top:4px;">5 - 7 business days</div>
                      <div style="font-size:15px;color:#09090b!important;margin-top:4px;">We'll email you as soon as your order is on its way!</div>
                    </td>
                    <td align="center" width="110" style="padding:18px 12px;color:#c25bf5!important;font-size:40px;">&#9825;</td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:0 0 18px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="#fff7fb" style="border:1px dashed #ebe0e6;border-radius:16px;background:#fff7fb!important;color:#09090b!important;">
                  <tr>
                    <td align="center" width="110" style="padding:18px 12px;color:#ec4699!important;font-size:34px;">&#9993;</td>
                    <td style="padding:18px 12px;">
                      <div style="font-weight:800;font-size:17px;color:#09090b!important;">Questions about your order?</div>
                      <div style="font-size:15px;color:#09090b!important;margin-top:4px;">Reply to this email and we'll be happy to help.</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:0 12px 10px;">
                <div style="font-family:Georgia,Times,serif;font-style:italic;font-size:24px;color:#09090b!important;">Thank you for supporting handmade! &hearts;</div>
                <div style="margin-top:10px;color:#ec4699!important;font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">Made with care by real hands</div>
                <div style="margin-top:18px;font-size:14px;color:#09090b!important;">
                  ${brandEmail} &nbsp; | &nbsp; ${brandSite}
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `,
    text: `Your order is confirmed

Hi ${firstName},
Thank you for your order! Your payment has been received and we'll start preparing your handmade piece with love.

Order ${orderNumber}

${textItems}

Subtotal: ${currency.format(subtotal / 100)}
Delivery: R 0,00 (Included)
Total paid: ${currency.format(total / 100)}

Estimated dispatch: 5 - 7 business days

Questions about your order? Reply to this email and we'll be happy to help.
`,
  };
}

function buildItemRow(item, assetBaseUrl) {
  const imageUrl = absoluteImageUrl(item.image, assetBaseUrl);
  const imageCell = imageUrl
    ? `<img class="email-product-img" src="${escapeHtml(imageUrl)}" width="124" height="124" alt="${escapeHtml(item.name)}" style="display:block;width:124px;height:124px;object-fit:cover;border-radius:10px;" />`
    : `<div class="email-product-img" style="width:124px;height:124px;border-radius:10px;background:#f8f2f5!important;"></div>`;

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #ebe0e6;padding:10px 0 16px;color:#09090b!important;">
      <tr>
        <td class="email-item-image" valign="top" width="146" style="padding:0 22px 0 0;color:#09090b!important;">
          ${imageCell}
        </td>
        <td class="email-item-detail" valign="top" style="padding:6px 0;color:#09090b!important;">
          <div style="font-size:20px;line-height:1.25;font-weight:800;color:#09090b!important;">${escapeHtml(item.name)}</div>
          <div style="margin-top:10px;font-size:15px;color:#71717a!important;">
            ${escapeHtml(item.color || "Custom")} &nbsp; &bull; &nbsp; Size ${escapeHtml(item.size || "Custom")} &nbsp; &bull; &nbsp; Qty ${Number(item.qty ?? 1)}
          </div>
          <div style="display:inline-block;margin-top:14px;padding:7px 12px;border-radius:999px;background:#f8f2f5!important;color:#09090b!important;font-size:14px;">
            <span style="color:#ec4699!important;">&hearts;</span> Handmade to order
          </div>
        </td>
        <td class="email-item-price" valign="top" align="right" width="120" style="padding:28px 0 0;font-size:18px;font-weight:800;color:#09090b!important;white-space:nowrap;">
          ${currency.format(Number(item.totalAmount ?? 0) / 100)}
        </td>
      </tr>
    </table>
  `;
}

function getAssetBaseUrl() {
  const configured =
    process.env.EMAIL_ASSET_BASE_URL ||
    process.env.PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

  return configured.replace(/\/$/, "");
}

function absoluteImageUrl(imagePath = "", baseUrl = "") {
  if (!imagePath) return "";
  if (/^https?:\/\//i.test(imagePath)) return imagePath;
  if (!baseUrl || baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1")) {
    return "";
  }

  return `${baseUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
}

function firstNameOnly(name = "") {
  return String(name).trim().split(/\s+/)[0] || "there";
}

function shortOrderId(id = "") {
  return `#${id.split("-")[0]?.toUpperCase() || "ORDER"}`;
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
