
import 'dotenv/config'
import { connectDB } from "./config/db.ts";
import { createApp } from "./app.ts";

const port = process.env.PORT || 4000;

export async function startServer() {
  
  await connectDB();
  const app = await createApp();

  app.listen(port, () => {
    
    console.log(`🚀Server running on http://localhost:${port}/graphql`);
  })
}

startServer();