import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Link } from "react-router-dom";
import { UserType } from "./User";
interface PostData {
  id: string;
  title: string;
  content: string;
}

const Main: React.FC = () => {
  const quryClient = useQueryClient();
  const getPostData = async (): Promise<PostData[]> => {
    try {
      const res = await fetch("http://localhost:3003/post");
      const jsonData = await res.json();
      console.log(jsonData);
      return jsonData;
    } catch (e) {
      throw new Error("Network response was not ok");
    }
  };
  const getUserData = async (queryFnContext: any): Promise<UserType[]> => {
    const { queryKey, pageParam, signal, meta } = queryFnContext;
    const res = await fetch("http://localhost:3003/user", { signal }); // signal을 이용하면 호출중에 페이지 unmount시 자동으로 fetch 캔슬
    return await res.json();
  };

  const onMouseOverUserPage = () => {
    // 탠스택 쿼리에서 mouseOver에서 preFetchQuery도 사용 가능
    quryClient.prefetchQuery({
      queryKey: ["user"],
      queryFn: getUserData,
      staleTime: 1000 * 60 * 0.1, // 1m
    });
  };

  const {
    isPending,
    isError,
    data: postList,
    error,
  } = useQuery<PostData[], Error>({
    queryKey: ["post"],
    queryFn: getPostData,
    staleTime: 1000 * 60 * 1, // 1분
  });

  if (isPending) {
    return <>Loading...</>;
  }
  return (
    <React.Fragment>
      <h1>Welcome to Main page</h1>✔<Link to="/detail">Go to Detail page</Link>
      <br />✔
      <Link to="/user" onMouseOver={onMouseOverUserPage}>
        Go to User page
      </Link>
      {postList?.map(({ id, title, content }) => (
        <div
          style={{
            border: "solid 1px",
            height: "200px",
            width: "50%",
            marginTop: "10px",
            padding: "0 20px",
          }}
          key={id}
        >
          <h2>{title}</h2>
          <h3>{content}</h3>
        </div>
      ))}
    </React.Fragment>
  );
};

export default Main;
