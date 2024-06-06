import React, { useRef } from "react";
import { Post } from "../pages/Detail";

type WriteFormProps = {
  onClickSetPost: (post: Post) => void;
  closeModal: () => void;
};

const WriteForm: React.FC<WriteFormProps> = ({
  onClickSetPost,
  closeModal,
}) => {
  const title = useRef<HTMLInputElement>(null);
  const content = useRef<HTMLInputElement>(null);

  const isFormValid = () => {
    return title.current?.value && content.current?.value;
  };

  const handleWrite = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isFormValid()) {
      const newtitle = title.current!.value || "WriteForm Error";
      const newContent = content.current!.value || "WriteForm Error";
      onClickSetPost({
        title: newtitle,
        content: newContent,
      });
      closeModal();
    } else {
      window.alert("제목과 내용을 모두 입력하세요");
      return;
    }
  };
  const onChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event);
  };
  return (
    <div>
      <h2>포스트 작성</h2>
      <form onSubmit={handleWrite}>
        <div>
          <div>
            <label htmlFor="title">제목</label>
            <input type="text" id="title" ref={title} />
          </div>
          <div>
            <label htmlFor="content">내용</label>
            <input type="text" id="content" ref={content} />
          </div>
          <div>
            <label htmlFor="image">프로필 등록</label>
            <input
              style={{ marginLeft: "50px" }}
              type="file"
              id="image"
              name="profile"
              accept="image/*"
              onChange={onChangeImage}
            />
          </div>
          <button>작성</button>
        </div>
      </form>
    </div>
  );
};

export default WriteForm;
