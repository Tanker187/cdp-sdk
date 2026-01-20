import * as jose from 'jose';
import * as crypto from "crypto";

// Get environment variables
const walletSecret = process.env.WALLET_SECRET!;
const requestMethod = process.env.REQUEST_METHOD!;
const requestHost = process.env.REQUEST_HOST!;
const requestPath = process.env.REQUEST_PATH!;
const requestBody = process.env.REQUEST_BODY;

// Create the JWT payload
const now = Math.floor(Date.now() / 1000);
const uri = `${requestMethod} ${requestHost}${requestPath}`;

const payload: jose.JWTPayload = {
  iat: now,
  nbf: now,
  jti: crypto.randomBytes(16).toString('hex'),
  uris: [uri]
};

function sortKeys(obj: any): any {
  if (!obj || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sortKeys);
  }

  return Object.keys(obj)
    .sort()
    .reduce(
      (acc, key) => {
        acc[key] = sortKeys(obj[key]);
        return acc;
      },
      {} as Record<string, any>,
    );
}

// Add request body if present
if (requestBody) {
  const sortedBody = sortKeys(JSON.parse(requestBody));
  payload.reqHash = crypto
    .createHash('sha256')
    .update(Buffer.from(JSON.stringify(sortedBody)))
    .digest('hex');
}

// Generate the JWT
(async () => {
  const ecKey = crypto.createPrivateKey({
    key: walletSecret,
    format: "der",
    type: "pkcs8",
    encoding: "base64",
  });

  // Sign JWT
  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'ES256', typ: 'JWT' })
    .sign(ecKey);

  console.log(jwt);
})();
