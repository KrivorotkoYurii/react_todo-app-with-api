import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';

interface Props {
  loadingTodoIds: number[];
  todo: Todo;
  onDelete: (todoId: number) => void;
  toggleTodo: (todoId: number, updates: Partial<Todo>) => void;
  renameTodo: (
    todoId: number,
    updateChanges: string,
    todoTitle: string,
  ) => void;
  editingTodo: Todo | null;
  setEditingTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
}

export const TodoItem: React.FC<Props> = ({
  loadingTodoIds,
  todo,
  onDelete,
  toggleTodo,
  renameTodo,
  editingTodo,
  setEditingTodo,
}) => {
  const [updateChanges, setUpdateChanges] = useState('');

  const isBeingEdited = editingTodo?.id === todo.id;

  const editingField = useRef<HTMLInputElement>(null);

  const handleToggleTodo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updates = {
      completed: event.target.checked,
    };

    toggleTodo(todo.id, updates);
  };

  const handleRenameTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    renameTodo(todo.id, updateChanges, todo.title);
  };

  document.addEventListener('keyup', event => {
    if (event.key === 'Escape') {
      setEditingTodo(null);
      setUpdateChanges(todo.title);
    }
  });

  useEffect(() => {
    if (isBeingEdited) {
      editingField.current?.focus();
    }
  }, [isBeingEdited]);

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggleTodo}
        />
      </label>

      {isBeingEdited ? (
        <form onSubmit={handleRenameTodo}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={updateChanges}
            ref={editingField}
            onChange={event => setUpdateChanges(event.target.value)}
            onBlur={() => renameTodo(todo.id, updateChanges, todo.title)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setEditingTodo(todo);
              setUpdateChanges(todo.title);
            }}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loadingTodoIds.includes(todo.id),
        })}
      >
        {/* eslint-disable-next-line max-len */}
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
