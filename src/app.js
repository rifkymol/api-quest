const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const echoRoutes = require("./routes/echo.routes");
const healthRoutes = require("./routes/health.routes");
const itemsRoutes = require("./routes/items.routes");
const pingRoutes = require("./routes/ping.routes");
const protectedRoutes = require("./routes/protected.routes");
const notFoundMiddleware = require("./middlewares/notFound.middleware");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.use("/echo", echoRoutes);
app.use("/health", healthRoutes);
app.use("/ping", pingRoutes);
app.use("/items", itemsRoutes);
app.use("/protected", protectedRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
