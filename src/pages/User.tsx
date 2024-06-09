import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";

export interface UserType {
  id?: string;
  name: string;
  age: string;
}

const User = () => {
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const queryClient = useQueryClient();

  const getUserData = async (queryFnContext: any): Promise<UserType[]> => {
    const { queryKey, pageParam, signal, meta } = queryFnContext;
    const res = await fetch("http://localhost:3003/user", { signal }); // signal을 이용하면 호출중에 페이지 unmount시 자동으로 fetch 캔슬
    return await res.json();
  };
  const {
    data: userList,
    isPending,
    error,
  } = useQuery<UserType[], Error>({
    queryKey: ["user"],
    queryFn: getUserData,
    staleTime: 1000 * 60 * 0.1, // 1m
    // select로 특정 부분만 불러올 수 있음
    // keepPreviouseData : true //이 명령어로  페이지네이션이 일어날 때 기존 데이터를 보여줄 수 있음
  });
  const setUserFetchData = async (newUser: UserType) => {
    const res = await fetch("http://localhost:3003/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });
    return res;
  };

  const userMutation = useMutation({
    // 낙관적 업데이트!!!!
    mutationFn: setUserFetchData,
    onMutate: async (newUser: UserType) => {
      console.log("onMutate 호출");

      const previousUsers = queryClient.getQueryData<UserType[]>(["user"]);
      queryClient.setQueryData(["user"], (old: UserType) => [...old, newUser]);
      return { previousUsers };
      // if (previousUsers) {
      //   queryClient.setQueryData(["user"], [...previousUsers, newUser]);
      // }
    },
    onError: (err, newUser, context) => {
      console.log("onError");
      console.log("context", context);
      queryClient.setQueryData(["user"], context?.previousUsers);
    },
    onSettled: () => {
      console.log("onSettled");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  /*
  const userMutation = useMutation({
    // invalidateQueries 추가하면 user라는 키를 가진 쿼리 캐시를 다시 refetch함
    mutationFn: setUserFetchData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
*/
  const onSubmitUserHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newuser = { name, age };
    userMutation.mutate(newuser);
  };

  if (isPending) {
    return <>Loading...</>;
  }
  if (error) {
    return <>error!</>;
  }

  return (
    <div>
      <Link to={"/"}>홈으로</Link>
      <form onSubmit={onSubmitUserHandler}>
        <label htmlFor="name">이름 : </label>
        <input
          type="text"
          id="name"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <br />
        <label htmlFor="age">나이 : </label>
        <input
          type="text"
          id="age"
          onChange={(e) => setAge(e.target.value)}
          value={age}
        />
        <button>추가</button>
      </form>
      {userList?.map((user: UserType) => (
        <div
          style={{
            border: "solid 1px",
            height: "130px",
            width: "50%",
            marginTop: "10px",
            padding: "0 20px",
          }}
          key={user.id}
        >
          <h2>이름 : {user.name}</h2>
          <h3>나이 : {user.age}</h3>
        </div>
      ))}
    </div>
  );
};

export default User;
