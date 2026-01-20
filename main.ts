import { generateJwt } from "@coinbase/cdp-sdk/auth";

const main = async () => {
    // Generate the JWT using the CDP SDK
    const token = await generateJwt({
        apiKeyId: process.env.KEY_ID!,
        apiKeySecret: process.env.KEY_SECRET!,
        requestMethod: process.env.REQUEST_METHOD!,
        requestHost: process.env.REQUEST_HOST!,
        requestPath: process.env.REQUEST_PATH!,
        expiresIn: 120 // optional (defaults to 120 seconds)
    });
    
    console.log(token);
};

main();
