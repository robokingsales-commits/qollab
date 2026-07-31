/**
 * Solapi Alimtalk Notification Hook (Cashnote Style)
 */

export interface AlimtalkMessageInput {
  to: string;
  templateId: string;
  variables: Record<string, string>;
}

export async function sendSolapiAlimtalk(input: AlimtalkMessageInput): Promise<boolean> {
  try {
    const apiKey = process.env.SOLAPI_API_KEY;
    const apiSecret = process.env.SOLAPI_API_SECRET;
    const senderPhone = process.env.SOLAPI_SENDER_PHONE;

    if (!apiKey || !apiSecret) {
      console.log(`[Alimtalk Mock Send] to: ${input.to}, template: ${input.templateId}`, input.variables);
      return true;
    }

    // Call Solapi REST API
    const response = await fetch("https://api.solapi.com/messages/v4/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `HMAC-SHA256 apiKey=${apiKey}, date=${new Date().toISOString()}`,
      },
      body: JSON.stringify({
        message: {
          to: input.to,
          from: senderPhone,
          kakaoOptions: {
            pfId: "KA01PF20260731QOLLAB",
            templateId: input.templateId,
            variables: input.variables,
          },
        },
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("Failed to send Solapi Alimtalk:", error);
    return false;
  }
}

/**
 * 1. Voucher Issuance Alimtalk Notification
 */
export async function sendVoucherIssuedAlimtalk(
  phone: string,
  voucherCode: string,
  storeName: string,
  validUntil: string
): Promise<boolean> {
  return sendSolapiAlimtalk({
    to: phone,
    templateId: "TPL_VOUCHER_ISSUED_01",
    variables: {
      "#{storeName}": storeName,
      "#{voucherCode}": voucherCode,
      "#{validUntil}": validUntil,
    },
  });
}

/**
 * 2. Daily Sales Summary Alimtalk (Cashnote Style)
 */
export async function sendDailySalesSummaryAlimtalk(
  phone: string,
  storeName: string,
  totalSalesKRW: number,
  voucherCount: number
): Promise<boolean> {
  return sendSolapiAlimtalk({
    to: phone,
    templateId: "TPL_DAILY_SALES_SUMMARY_02",
    variables: {
      "#{storeName}": storeName,
      "#{totalSales}": `${Math.round(totalSalesKRW).toLocaleString("ko-KR")}원`,
      "#{voucherCount}": `${voucherCount}건`,
    },
  });
}

/**
 * 3. Weekly Settlement Approval Alimtalk (Cashnote Style)
 */
export async function sendWeeklySettlementApprovalAlimtalk(
  phone: string,
  storeName: string,
  netAmountKRW: number,
  periodStr: string
): Promise<boolean> {
  return sendSolapiAlimtalk({
    to: phone,
    templateId: "TPL_WEEKLY_SETTLEMENT_03",
    variables: {
      "#{storeName}": storeName,
      "#{netAmount}": `${Math.round(netAmountKRW).toLocaleString("ko-KR")}원`,
      "#{period}": periodStr,
    },
  });
}
