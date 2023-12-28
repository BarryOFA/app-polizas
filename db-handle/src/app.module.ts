import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import appConfig from './config/config'
import { HealthModule } from './modules/health/health.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TraceMiddleware } from './commons/middleware/trace.middleware'
import { LoggerMiddleware } from './commons/middleware/logger.middleware'
import { ApikeyMiddleware } from './commons/middleware/apikey.middleware'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { ResponseInterceptor } from './commons/interceptors/response.interceptor'
import { HttpModule } from '@nestjs/axios'
import { ClientesModule } from './modules/clientes/clientes.module'
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `${process.cwd()}/src/config/env/${process.env.NODE_ENV}.env`,
        `${process.cwd()}/src/config/env/.env`,
      ],
      expandVariables: true,
      load: [appConfig],
    }),
    {
      ...HttpModule.registerAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          timeout: configService.get('AXIOS_HTTP_TIMEOUT'),
        }),
        inject: [ConfigService],
      }),
      global: true,
    },
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'public'),
    // }),

    MongooseModule.forRoot(process.env.MONGODB, {
      dbName: 'Cluster0',
    }),
    HealthModule,
    ClientesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TraceMiddleware, LoggerMiddleware)
      .forRoutes({ path: '/**', method: RequestMethod.ALL })
    consumer
      .apply(ApikeyMiddleware)
      .exclude({ path: 'api/v1/health', method: RequestMethod.GET })
      .forRoutes({ path: '/**', method: RequestMethod.ALL })
  }
}
