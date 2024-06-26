import { ModuleMetadata, Type } from '@nestjs/common'
import { DockerOptions } from 'dockerode'

export interface DockerodeModuleOptions {
  config: DockerOptions
}

export { DockerOptions } from 'dockerode'

export interface DockerodeModuleOptionsFactory {
  createDockerodeModuleOptions(): Promise<DockerodeModuleOptions> | DockerodeModuleOptions
}

export interface DockerodeModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[]
  useClass?: Type<DockerodeModuleOptionsFactory>
  useExisting?: Type<DockerodeModuleOptionsFactory>
  useFactory?: (...args: any[]) => Promise<DockerodeModuleOptions> | DockerodeModuleOptions
}
