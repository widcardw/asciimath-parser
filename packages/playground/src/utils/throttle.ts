function throttle(fn: (...arg: any[]) => any, delay: number) {
  let timer: NodeJS.Timer | null
  return function () {
    // @ts-expect-error types
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this
    // eslint-disable-next-line prefer-rest-params
    const args = arguments
    if (timer)
      return
    timer = setTimeout(() => {
      fn.apply(_this, args as any) // _this.fn(args);
      timer = null
    }, delay)
  }
}

export {
  throttle,
}
