import { revalidatePath } from 'next/cache'

export function revalidateAllPages(payload: { logger: { info: (msg: string) => void } }) {
  payload.logger.info('Revalidating all portfolio pages')
  revalidatePath('/')
  revalidatePath('/resume')
}
