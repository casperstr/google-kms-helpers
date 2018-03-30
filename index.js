
const { google } = require("googleapis");

module.exports.decryptKMS = (ciphertext, keyname) => new Promise((resolve, reject) => {
    google.auth.getApplicationDefault((err, authClient) => {
        if (err) {
            reject(new Error("Failed to acquire credentials"));
        }
        if (
            authClient.createScopedRequired &&
            authClient.createScopedRequired()
        ) {
            authClient = authClient.createScoped([
                "https://www.googleapis.com/auth/cloud-platform"
            ]);
        }

        const cloudkms = google.cloudkms({
            version: "v1",
            auth: authClient
        });
        const request = {
            name: keyname,
            resource: {
                ciphertext: ciphertext
            }
        };
        cloudkms.projects.locations.keyRings.cryptoKeys.decrypt(
            request,
            (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(Buffer.from(res.data.plaintext, "base64").toString())
                }
            }
        );
    });
});
