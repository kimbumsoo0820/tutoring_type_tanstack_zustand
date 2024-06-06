import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Link } from "react-router-dom";

interface PostData {
  title: string;
  content: string;
}

const Main: React.FC = () => {
  const getPostData = async (): Promise<PostData> => {
    try {
      const res = await fetch("http://localhost:3003/0");
      const jsonData = await res.json();
      console.log(jsonData);
      return jsonData;
    } catch (e) {
      throw new Error("Network response was not ok");
    }
  };

  const { isPending, isError, data, error } = useQuery<PostData, Error>({
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
      <div
        style={{
          border: "solid 1px",
          height: "200px",
          width: "50%",
          marginTop: "50px",
        }}
      >
        <h2>{data?.title}</h2>
        <h3>{data?.content}</h3>
      </div>
    </React.Fragment>
  );
};

export default Main;
