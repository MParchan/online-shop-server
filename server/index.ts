import app from "./app";

const port: number = Number(process.env.PORT) || 5002;
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
