import { Inject } from '@nestjs/common'
import { getDockerodeConnectionToken } from './dockerode.utils'

export const InjectDockerode = (connection?: string) => {
  return Inject(getDockerodeConnectionToken(connection))
}
