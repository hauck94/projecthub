import { useState } from 'react';
import styled from 'styled-components';
import Widget from '../../components/Widget';
import { TodoWidgetData } from './TodoWidgetModel';
import { DefaultButton } from '../../components/DefaultButton';
import { DefaultInput } from '../../components/DefaultInput';

const WidgetBackground = styled.div`
  background-color: #fcd059;
  height: 100%;
`;

const EntriesContainer = styled.div`
  overflow: auto;
  max-height: 300px;
  max-width: 800px;
  margin-bottom: 10px;
`;

const SingleEntryContainer = styled.div`
  width: 100%;
  margin-bottom: 10px;
  height: auto;
  float: left;
`;

const DeleteButtonContainer = styled.div`
  float: right;
`;

const TextContainer = styled.p`
  max-width: 660px;
  float: left;
  margin: 0;
`;

const TodoWidget: Widget<TodoWidgetData> = ({ saveData, data }) => {
  const [todos, setTodos] = useState<string[]>(data.data.todos ?? []);
  const [title, setTitle] = useState<string>(data.data.title);
  const [backgroundColor, setBackgroundColor] = useState<string>(data.data.backgroundColor);
  const [fontColor, setFontColor] = useState<string>(data.data.fontColor);

  const addingTodo = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement;

      const copyOfTodos = todos.slice();
      copyOfTodos.push(target.value);

      setTodos(copyOfTodos);
      target.value = '';
      //TODO: add call to backend
    }
  };

  function setData() {
    saveData({
      ...data,
      data: {
        todos,
        title,
        backgroundColor,
        fontColor,
      },
    });
  }

  return (
    <WidgetBackground style={{ backgroundColor: data.data.backgroundColor }}>
      <h4>{data.data.title}</h4>
      <EntriesContainer>
        {todos.map((text, index) => {
          return (
            <SingleEntryContainer>
              <TextContainer style={{ color: data.data.fontColor }}>- {text}</TextContainer>
              <DeleteButtonContainer>
                <DefaultButton
                  onClick={() => {
                    const copyOfTodos = todos.slice();
                    copyOfTodos.splice(index, 1);
                    setTodos(copyOfTodos);
                    setData();
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path
                      className="delete-widget"
                      d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                    />
                  </svg>
                </DefaultButton>
              </DeleteButtonContainer>
            </SingleEntryContainer>
          );
        })}
      </EntriesContainer>
      <DefaultInput name="text" placeholder="Add Todo and press Enter" type="text" onKeyDown={addingTodo} />
    </WidgetBackground>
  );
};

export default TodoWidget;
