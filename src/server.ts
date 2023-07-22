import App from "@/app";
import AuthRoute from "@routes/auth.route";
import userRoute from "@routes/user.route";
const app = new App([new AuthRoute(), new userRoute()]);
const server = app.listen();
export default server;
