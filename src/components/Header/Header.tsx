import React, { useEffect, useRef, Dispatch, SetStateAction } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  toggleTodo: (todoId: number, updates: Partial<Todo>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  inputChange: string;
  loadingTodoIds: number[];
  focusOnChange: boolean;
  onInputChange: Dispatch<SetStateAction<string>>;
}

export const Header: React.FC<Props> = ({
  todos,
  toggleTodo,
  handleSubmit,
  inputChange,
  loadingTodoIds,
  focusOnChange,
  onInputChange,
}) => {
  const todoInputField = useRef<HTMLInputElement>(null);

  const allCompleted = todos.every(todo => todo.completed);

  useEffect(() => {
    if (todoInputField.current) {
      todoInputField.current.focus();
    }
  }, [focusOnChange]);

  const handleToggleAll = () => {
    if (allCompleted) {
      todos.forEach(todo => {
        const updates = {
          completed: false,
        };

        toggleTodo(todo.id, updates);
      });
    } else {
      const notCompletedTodos = todos.filter(todo => !todo.completed);

      notCompletedTodos.forEach(notCompletedTodo => {
        const updates = {
          completed: true,
        };

        toggleTodo(notCompletedTodo.id, updates);
      });
    }
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: allCompleted })}
          data-cy="ToggleAllButton"
          disabled={loadingTodoIds.includes(0)}
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          disabled={loadingTodoIds.includes(0)}
          ref={todoInputField}
          value={inputChange}
          onChange={event => onInputChange(event.target.value.trimStart())}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
