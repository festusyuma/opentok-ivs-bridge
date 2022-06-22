export const repo = async (func: () => any) => {
  try {
    return await func()
  } catch (e: any) {
    console.error('repo error')
    console.error(e)
  }
}

export * from './session'
export * from './broadcast'
export * from './token'