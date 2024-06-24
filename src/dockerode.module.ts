import { DynamicModule, Module } from '@nestjs/common'
import { DockerodeCoreModule } from './dockerode.core-module'
import { DockerodeModuleAsyncOptions, DockerodeModuleOptions } from './dockerode.interfaces'

@Module({})
export class DockerodeModule {
  public static forRoot(options: DockerodeModuleOptions, connection?: string): DynamicModule {
    return {
      module: DockerodeModule,
      imports: [DockerodeCoreModule.forRoot(options, connection)],
      exports: [DockerodeCoreModule],
    }
  }

  public static forRootAsync(options: DockerodeModuleAsyncOptions, connection?: string): DynamicModule {
    return {
      module: DockerodeModule,
      imports: [DockerodeCoreModule.forRootAsync(options, connection)],
      exports: [DockerodeCoreModule],
    }
  }
}
