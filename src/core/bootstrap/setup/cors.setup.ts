import { INestApplication } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import corsConfig from "src/core/config/cors.config";

export async function setupCors(app: INestApplication): Promise<void> {
 const corsOptions = app.get<ConfigType<typeof corsConfig>>(corsConfig.KEY);
 app.enableCors({
    origin: corsOptions.origin,
    credentials: corsOptions.credentials,
    methods: corsOptions.methods,
    allowedHeaders: corsOptions.allowedHeaders,
 })
}