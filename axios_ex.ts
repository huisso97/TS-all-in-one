// interface에는 axios로 구현할 수 있는 방법들을 적용하여 구현한다.
//  get, post, 객체가 들어간 함수, 주소, 객체가 들어간 함수, axiosERror
// 제네릭에는 변수(T,R)로 저장해서 구현한다.
// 선택 타입은 필수 타입 앞에 올 수 없다. 그래서 선택 타입 뒤에 필수 타입을 매개변수로 쓸 시, 뒤에오는 필수 타입(아래의 A interface의 D)은 any로 고정하여 처리한다.

import { AxiosError, AxiosResponse, isAxiosError } from "axios";

interface Config<D = any> {
  method?: "post" | "get" | "patch" | "delete" | "head" | "options";
  url?: string;
  data?: D;
}
interface A {
  get: <T = any, R = AxiosResponse<T>>(url: string) => Promise<R>;
  post: <T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data: D
  ) => Promise<R>;
  isAxiosError: (error: unknown) => error is AxiosError;
  (config: Config): void;
  (url: string, config: Config): void;
}

const typedAxios: A = axios;

async () => {
  try {
  const res = await typedAxios.get(
    "https://jsonplaceholder.tvpicode.com/posts/1"
  );
  const postRes = await typedAxios.post(
    "https://jsonplaceholder.tvpicode.com/posts/1",
    "data"
  );
  } catch (err) {
    if (typedAxios.isAxiosError(err))
  }
};
