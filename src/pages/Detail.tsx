import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import useModal from "../hooks/useModal";
import Modal from "../components/modal/Modal";
import WriteForm from "../components/WriteForm";
import { useMutation } from "@tanstack/react-query";

export interface Post {
  title: string;
  content: string;
}

const Detail: React.FC = () => {
  const { isOpen, openModal, closeModal } = useModal();
  // const [post, setPost] = useState<Post[]>([
  //   {
  //     title: "initialTitle",
  //     content: "initialContent",
  //   },
  // ]);

  const setPost = async (newPost: Post) => {
    return await fetch("http://localhost:3003/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost),
    });
  };

  const onClickSetPost = (newPost: Post): void => {
    console.log("onClickSetPost newPost =>", newPost);
    const { data, isError, isPending, error } = useMutation({
      mutationFn: setPost(newPost),
    });
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

      {post.map((postData) => (
        <div style={{ marginTop: "50px" }} key={`title ${postData.title}`}>
          <h2>{postData.title}</h2>
          <h3>{postData.content}</h3>
        </div>
      ))}
    </div>
  );
};

export default Detail;
