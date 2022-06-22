export * from './session'
export * from './broadcast'
export * from './token'

export const service = async (func: () => any) => {
  try {
    return await func()
  } catch (e: any) {
    console.error('service error')
    console.error(e)
  }
}