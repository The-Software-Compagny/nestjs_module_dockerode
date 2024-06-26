import Docker from 'dockerode'
import { DOCKERODE_MODULE_CONNECTION, DOCKERODE_MODULE_CONNECTION_TOKEN, DOCKERODE_MODULE_OPTIONS_TOKEN } from './dockerode.constants'
import { DockerodeModuleOptions } from './dockerode.interfaces'
import { Logger } from '@nestjs/common'
import { DockerodeModule } from './dockerode.module'

export function getDockerodeOptionsToken(connection: string): string {
  return `${connection || DOCKERODE_MODULE_CONNECTION}_${DOCKERODE_MODULE_OPTIONS_TOKEN}`
}

export function getDockerodeConnectionToken(connection: string): string {
  return `${connection || DOCKERODE_MODULE_CONNECTION}_${DOCKERODE_MODULE_CONNECTION_TOKEN}`
}

export async function createDockerodeConnection(options: DockerodeModuleOptions) {
  const { config } = options
  try {
    const docker = new Docker(config)
    const res = await docker.ping()
    Logger.log(`Dockerode connection established: ${res} !`, DockerodeModule.name)
    return docker
  } catch (error) {
    console.error(error)
    setTimeout(() => {
      createDockerodeConnection(options)
    }, 5000)
  }
}
