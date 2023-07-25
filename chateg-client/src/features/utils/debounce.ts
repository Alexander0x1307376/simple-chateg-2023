/* eslint-disable @typescript-eslint/no-explicit-any */
export const debounce = (
  callback: (...args: any) => void,
  delayTime: number
) => {
  let timer: number;

  return (...args: any) => {
    clearTimeout(timer);

    const executeCallback = () => {
      callback.apply(this, args);
    };

    timer = setTimeout(executeCallback, delayTime);
  };
};

export const debounceAsync = <Args extends any[], ReturnValue>(
  callback: (...arg: Args) => ReturnValue | Promise<ReturnValue>,
  delayTime: number
) => {
  let timer: number;

  return (...args: Args) => {
    clearTimeout(timer);

    const executeCallback = async () => {
      await callback.apply(this, args);
    };

    timer = setTimeout(executeCallback, delayTime);
  };
};
