import React, { FC, ReactElement } from 'react';
import { useDispatch } from 'react-redux';
import Delete from '../../assets/icons/Delete';
import Edit from '../../assets/icons/Edit';
import { ITodo } from '../../interface';
import { deleteTodo, todoChecked } from '../../store/todoAction';
import Timer from '../Timer/Timer';
import './Card.less';

interface CardProps {
    item: ITodo[],
    handleEditCreateFunc: (isOpen: boolean, item: ITodo) => Promise<void>
}

const Card: FC<CardProps> = ({ item, handleEditCreateFunc }): ReactElement => {
    const dispatch = useDispatch();

    /**
     * @function shortFileName -нужен для того чтобы возвращать только имя файла
     * @param name - Здесь у нас полное имя file. Например: https://firebasestorage.googleapis.com/v0/b/todo-react-a910f.appspot.com/o/img%2FNY.jpg?alt=media&token=a6c9f0c0-67c0-4954-9b1b-1bd73055f41d
     * @returns мы возвращаем только название картинки, остальные слова пропускаем
     */
    const shortFileName = (name: string | undefined) => {       
        return name?.split('%2F')[1].split('?')[0]; //Сокращение длинной имени file
    }
        
    return (
        <>
            {item?.map((item: ITodo, index: number) => {
                return (
                    <div
                        key={index} className={`card ${ item.isChecked && 'cardDone'}`}
                    >
                        { !item.isChecked && item.timer || item.timer === 0 ? <Timer timer={item.timer} /> : null }
                        <Checkbox item={item} />
                        <h3>
                            <span className='card_span'>Title: </span>
                            {item.title}
                        </h3>
                        <p>
                            <span className='card_span'>Description: </span>
                            {item.desc}
                        </p>
                        <p>
                            <span className='card_span'>File: </span>
                            {shortFileName(item.file)}
                        </p>
                        <p>
                            <span className='card_span'>Timer:</span>
                            {item.timer}
                        </p>
                        <div className='card_inner'>
                            <div
                                className='card_inner__wrapperIcon'
                                onClick={() => handleEditCreateFunc(true, item)}
                            >
                                <Edit width='12px' />
                            </div>
                            <div
                                className='card_inner__wrapperIcon'
                                onClick={() => deleteTodo(item.id!)(dispatch)}
                            >
                                <Delete width='12px' />
                            </div>
                        </div>
                    </div>
                )
            })}
        </>
    );
}
interface CheckboxProps {
    item: ITodo
}

const Checkbox: FC<CheckboxProps> = ({ item }): ReactElement => {
    const dispatch = useDispatch();

    return (
        <div className='container_wrapper'>
            <label className="container">
                <input 
                    type="checkbox" 
                    checked={item.isChecked || false} 
                    onClick={() => todoChecked(!item.isChecked, item)(dispatch)} 
                    readOnly 
                />
                <span className="checkmark"></span>
            </label>
        </div>
    );
};

export default Card;
