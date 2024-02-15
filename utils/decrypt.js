import { decrypt } from "./cryptoencdec.js";

// dev 40157b4f27aad84328d8c034b201ddee
// REACT_APP_ENCRYPTION_KEY_PAYMENT_CHECKOUT = ?wZfE(}{/8#/CqCG8naCVF383=L9*?Ne
// public/checkout = (iSjbBXQCT4fP[cLrYjz6?@7mrh,3!m9
// REACT_APP_ENCRYPTION_KEY_SUMMARY = t3GTNiE*zr$9QbwcKuXktZ_;6v7bbXwv
// REACT_APP_ENCRYPTION_KEY_EARNING = Q+uK&=/kAvZEwqm+=x%?#ikikzN.Q?Vn

// stg 081022a167c1c313d1b737a0ad360049
// REACT_APP_ENCRYPTION_KEY_PAYMENT_CHECKOUT = ?wZfE(}{/8#/CqCG8naCVF383=L9*?Ne
// public/checkout = (iSjbBXQCT4fP[cLrYjz6?@7mrh,3!m9
// REACT_APP_ENCRYPTION_KEY_SUMMARY = t3GTNiE*zr$9QbwcKuXktZ_;6v7bbXwv
// REACT_APP_ENCRYPTION_KEY_EARNING = Q+uK&=/kAvZEwqm+=x%?#ikikzN.Q?Vn

// prod
// REACT_APP_ENCRYPTION_KEY_PAYMENT_CHECKOUT = hwp36833f9H_+&MY3!W@mPMX4=yL0tGJ
// public/checkout = vtr=cRlDb2*mu&N~4@~n)vL9(4id2WkZ
// REACT_APP_ENCRYPTION_KEY_SUMMARY = M9QRvYq1Hm&g1&qb6dA#~rZgxW=lEm5f
// REACT_APP_ENCRYPTION_KEY_EARNING=S&-VOr&66c = ^G6p5yuMCBAPum3CugZnE

// dev
// REGISTER_SECRET_KEY = 03gVW05w4GeHBpm5D2Q0fMGQ+FHm+YE=
// stg
// REGISTER_SECRET_KEY = sr6RBMSI2cAwKxsKlE9jmEZm26TG9y8=
// prod
// REGISTER_SECRET_KEY = VksC0UTYRTb3s0LSnDN9li+tBRQzEUk=

// dev
// OTP_SECRET_KEY = 8tOkizsW2t0368D4duyEYciUjf8uct4=
// stg
// OTP_SECRET_KEY = q/ccfqtdASswKKmoUN/9La36YTV5p1g=
// prod
// OTP_SECRET_KEY = /Y3qiI7nBLDaSFRiYOgva/CQKP/50A0=

const decryptProcess = async (ivData, data, type) => {
  let key = "";

  if (type === "summary") {
    key = "M9QRvYq1Hm&g1&qb6dA#~rZgxW=lEm5f";
  } else {
    
  }
  //const key = "sr6RBMSI2cAwKxsKlE9jmEZm26TG9y8=";
  const iv = ivData;
  const encryptedData = data;
  const dataDecrypted = decrypt({ iv, encryptedData }, key);
  // console.log(dataDecrypted);
  return dataDecrypted;
}

export default decryptProcess;

