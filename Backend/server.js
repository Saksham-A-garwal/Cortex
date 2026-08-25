require("dotenv").config();

// Some hosts (confirmed on Render) resolve dual-stack hostnames like smtp.gmail.com to an
// IPv6 address the outbound network has no route to, failing with ENETUNREACH even though
// the same host is reachable over IPv4. Preferring IPv4 process-wide is Node's own
// documented fix for this class of issue, not just a nodemailer-specific workaround.
require("dns").setDefaultResultOrder("ipv4first");

const { ConnectDB } = require("./DataBaseConnection");
const { createApp } = require("./app");

const PORT = process.env.PORT || 5000;
const app = createApp();

ConnectDB(process.env.MONGO_URI)
  .then(() => console.log("DataBase is Connected"))
  .catch((err) =>
    console.log("Error OCcured While Connecting the DataBase", err),
  );

app.listen(PORT, () => console.log("Server is Started at", PORT));
