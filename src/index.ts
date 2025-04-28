import listEndpoints from "express-list-endpoints";
import kickRoutes from "./modules/kick/kick.routes";
import { app, server } from "./server";

app.use("/kick", kickRoutes);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

const PORT = process.env.PORT || 3000; 
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(listEndpoints(app));
  console.log(`Backend server at http://localhost:${PORT}`);
});
