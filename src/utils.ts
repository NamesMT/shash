export function validParams(paramsMap: Record<string, any>) {
  for (const [key, value] of Object.entries(paramsMap)) {
    switch (key) {
      case 'id': {
        if (!value)
          throw new Error('"id" must be truthy')

        break
      }

      default: {
        if (!(typeof value === 'string' && value.length > 0))
          throw new Error(`Invalid param: "${key}"`)
      }
    }
  }
}
