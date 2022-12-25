import axios, { AxiosError, AxiosResponse, CreateAxiosDefaults } from "axios";
interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}
interface Created {}
interface Data {
  title: string;
  body: string;
  userId: number;
}
(async () => {
  try {
    const res = await axios.get<Post, AxiosResponse<Post>>(
      "https://jsonplaceholder.typicode.com/posts/1"
    );
    // post<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
    // 제네릭 순서 -> 반환값 타입 매개변수 타입
    const postRes = await axios.post<Created, AxiosResponse<Created>, Data>(
      "https://jsonplaceholder.com/posts",
      {
        title: "foo",
        body: "bar",
        userId: 1,
      }
    );
    console.log(res.data);
  } catch (err) {
    // 1번째 커스텀 타입 가드
    if (err instanceof AxiosError) {
      err.response;
    }
    // 2번째 타입가드
    if (axios.isAxiosError(err)) {
      console.error(
        (err.response as AxiosResponse<{ message: string }>)?.data.message
      );
    }
  }
})();
