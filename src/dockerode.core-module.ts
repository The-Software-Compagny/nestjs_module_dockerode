import { DynamicModule, Global, Module, Provider } from '@nestjs/common'
import { DockerodeModuleAsyncOptions, DockerodeModuleOptions, DockerodeModuleOptionsFactory } from './dockerode.interfaces'
import { createDockerodeConnection, getDockerodeConnectionToken, getDockerodeOptionsToken } from './dockerode.utils'

@Global()
@Module({})
export class DockerodeCoreModule {
  public static forRoot(options: DockerodeModuleOptions, connection?: string): DynamicModule {
    const dockerodeOptionsProvider: Provider = {
      provide: getDockerodeOptionsToken(connection),
      useValue: options,
    }

    const dockerodeConnectionProvider: Provider = {
      provide: getDockerodeConnectionToken(connection),
      useValue: createDockerodeConnection(options),
    }

    return {
      module: DockerodeCoreModule,
      providers: [dockerodeOptionsProvider, dockerodeConnectionProvider],
      exports: [dockerodeOptionsProvider, dockerodeConnectionProvider],
    }
  }

  public static forRootAsync(options: DockerodeModuleAsyncOptions, connection: string): DynamicModule {
    const dockerodeConnectionProvider: Provider = {
      provide: getDockerodeConnectionToken(connection),
      useFactory(options: DockerodeModuleOptions) {
        return createDockerodeConnection(options)
      },
      inject: [getDockerodeOptionsToken(connection)],
    }

    return {
      module: DockerodeCoreModule,
      imports: options.imports,
      providers: [...this.createAsyncProviders(options, connection), dockerodeConnectionProvider],
      exports: [dockerodeConnectionProvider],
    }
  }

  public static createAsyncProviders(options: DockerodeModuleAsyncOptions, connection?: string): Provider[] {
    if (!(options.useExisting || options.useFactory || options.useClass)) {
      throw new Error('Invalid configuration. Must provide useFactory, useClass or useExisting')
    }

    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options, connection)]
    }

    return [this.createAsyncOptionsProvider(options, connection), { provide: options.useClass, useClass: options.useClass }]
  }

  public static createAsyncOptionsProvider(options: DockerodeModuleAsyncOptions, connection?: string): Provider {
    if (!(options.useExisting || options.useFactory || options.useClass)) {
      throw new Error('Invalid configuration. Must provide useFactory, useClass or useExisting')
    }

    if (options.useFactory) {
      return {
        provide: getDockerodeOptionsToken(connection),
        useFactory: options.useFactory,
        inject: options.inject || [],
      }
    }

    return {
      provide: getDockerodeOptionsToken(connection),
      async useFactory(optionsFactory: DockerodeModuleOptionsFactory): Promise<DockerodeModuleOptions> {
        return await optionsFactory.createDockerodeModuleOptions()
      },
      inject: [options.useClass || options.useExisting],
    }
  }
}
