import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidateAllPages } from '@/utilities/revalidateAll'

export const revalidateProjects: CollectionAfterChangeHook = ({ req }) => {
  revalidateAllPages(req.payload)
}

export const revalidateProjectsOnDelete: CollectionAfterDeleteHook = ({ req }) => {
  revalidateAllPages(req.payload)
}
