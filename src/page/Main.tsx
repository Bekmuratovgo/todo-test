import { FC, ReactElement, useEffect, useState } from 'react';
import { createTodo, getAllTodos, toggleModalVisible, updateTodo } from '../store/todoAction';
import { useDispatch, useSelector } from 'react-redux';
import Plus from '../assets/icons/Plus';
import Card from '../components/Card/Card';
import Modal from '../components/Modal/Modal';
import Loader from '../components/Loader/Loader'; 
import './Main.less';
import { ITodo } from '../interface';
import { State } from '../store/store';

const Main: FC = (): ReactElement => {
  const { todos, loading } = useSelector((state: State) => state.todoReducer);
  const [currentEditCard, setCurrentEditCard] = useState<ITodo | null>(null);
  const dispatch = useDispatch();
  
  /**
   * 
   * @param isOpen -boolean значение чтобы закрывать открывать модалку
   * @param item - при нажатии на кнопку edit- открывается модалка с item полями. То есть мы передаем  item в компонент Modal чтобы в дальнейшем редактировать
   */
  const handleEditCreateFunc = async (isOpen: boolean, item: ITodo) => {
    setCurrentEditCard(item);
    toggleModalVisible(isOpen)(dispatch);
  }

  /**
   * @function saveEdittedCreatedCard - создает или редактирует todo в зависимости от параметров. 
   * Если есть item то создает Todo и закрывает модалку
   * @param e - первый арг чтобы отменять действие события
   * @param item - это новый создающийся todo
   * @param id - для редактирования сущ-щего todo
   */
  const saveEdittedCreatedCard = async (e: React.FormEvent, item: any, id?: string) => {
    e.preventDefault();

    if (item) {
      toggleModalVisible(false)(dispatch);
      await createTodo(item!)(dispatch)
    } else {
      toggleModalVisible(false)(dispatch);
      await updateTodo(id!, currentEditCard!)(dispatch);
    }
    setCurrentEditCard(null);
  }

  /**
   * @function getAllTodos - это action который стягивает весь todo из firebase
   */
  useEffect(() => {
    getAllTodos()(dispatch);
  }, []);
  
  return (
    <div className="main">
      <div className='main_inner'>
        <div className="todo">
          <h2>Какие планы на сегодня?</h2>
          <div>
            <div className='todo_inner'>
              <button onClick={() => toggleModalVisible(true)(dispatch)} className='todo_inner__addBtn'>
                <Plus width={'18px'} />
                Добавить задачу
              </button>

              {loading && <Loader />}
            </div>

            <div>
              <Card
                handleEditCreateFunc={handleEditCreateFunc}
                item={todos}
              />
            </div>
          </div>
        </div>
      </div>

      <Modal
        currentEditCard={currentEditCard}
        setCurrentEditCard={setCurrentEditCard}
        saveEdittedCreatedCard={saveEdittedCreatedCard}
      />
    </div>
  );
}

export default Main;
