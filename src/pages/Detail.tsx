import React, { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useModal from "../hooks/useModal";
import Modal from "../components/modal/Modal";
import WriteForm from "../components/WriteForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface Post {
  title: string;
  content: string;
}

const Detail: React.FC = () => {
  const { isOpen, openModal, closeModal } = useModal();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const setPostToDataBase = async (newPost: Post): Promise<Response> => {
    console.log("???", newPost);
    try {
      const res = await fetch("http://localhost:3003/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });
      return res;
    } catch (e) {
      console.error("Error in setPostToDataBase", e);
      throw new Error("글쓰기 오류");
    }
  };

  const postMutation = useMutation<Response, Error, Post>({
    mutationFn: setPostToDataBase,
    onSuccess: () => {
      console.log("데이터 삽입 성공");
      queryClient.invalidateQueries({ queryKey: ["post"] }); // 해당 키의 캐시가 더이상 유효한 데이터가 아님을 알림 => 다시 받아옴
    },
  });

  const onClickSetPost = (newPost: Post): void => {
    console.log("Mutation state:", postMutation);
    console.log("onClickSetPost newPost =>", newPost);
    postMutation.mutate(newPost);
    console.log("After mutate");
    navigate("/");
    // setPost((prevPost) => [...prevPost, newPost]);
  };

  return (
    <div>
      <h1>Welcome to Detail page</h1>
      <Link to="/">Go to Home</Link>
      <br />
      <button style={{ marginTop: "30px" }} onClick={openModal}>
        <h1>OPEN MODAL</h1>
      </button>

      <Modal isOpen={isOpen} closeModal={closeModal}>
        <WriteForm onClickSetPost={onClickSetPost} closeModal={closeModal} />
      </Modal>
    </div>
  );
};

export default Detail;
