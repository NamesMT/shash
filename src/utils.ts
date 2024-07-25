export function validParams(...params: any[]) {
  for (const param of params) {
    if (typeof param !== 'string' || param.length === 0)
      throw new Error('Invalid params')
  }
}
