import React, { FC, ReactElement, useState } from 'react';
import Close from '../../assets/icons/Close';
import './Modal.less';
import { useDispatch, useSelector } from 'react-redux';
import { toggleModalVisible } from '../../store/todoAction';
import { ITodo } from '../../interface';
import { State } from '../../store/store';


interface ModalProps {
    currentEditCard: any,
    setCurrentEditCard: (item: ITodo | null) => void;
    saveEdittedCreatedCard: (e: React.FormEvent, item: ITodo | null | {}, id?: string) => Promise<void>;
}

const Modal: FC<ModalProps> = ({
    currentEditCard, setCurrentEditCard, saveEdittedCreatedCard
}): ReactElement => {

    const { isOpen } = useSelector((state: State) => state.todoReducer);
    const [newCard, setNewCard] = useState({});

    const dispatch = useDispatch();

    /**
     * @function handleChangeEditCreate - отрабатывает на onChange и в редактировании и в создании Todo. Если isCreate === true то мы создаем Todo, заполняем стейт newCard. Если нет заполняем setCurrentEditCard. setCurrentEditCard находится в Main
     * @param target - e.target
     * @param isCreate - булевое значение определяющий что Todo создается или редактируется
     */
    const handleChangeEditCreate = (target: any, isCreate?: boolean) => {
        if (isCreate) {
            setNewCard(
                {
                    ...newCard,
                    [target.name]: target.name === 'file' ? target.files[0] : target.value,
                }
            )
        } else {
            setCurrentEditCard(
                {
                    ...currentEditCard,
                    [target.name]: target.name === 'file' ? target.files[0] : target.value,
                }
            )
        }
    }

    return (
        <>
            {
                isOpen &&
                <div className="modal">
                    <div className='modal_inner'>
                        <div
                            onClick={() => {
                                setCurrentEditCard(null)
                                toggleModalVisible(false)(dispatch)
                            }}
                            className='modal_inner__closeBtn'
                        >
                            <Close width='15px' />
                        </div>
                        <div>
                            {
                                currentEditCard ?
                                    <form
                                        className='modal_inner__editBlock'
                                        onSubmit={
                                            (e: React.FormEvent) => saveEdittedCreatedCard(e, null, currentEditCard.id)
                                        }>
                                        <h3>Редактировать</h3>
                                        <input
                                            required
                                            name='title'
                                            placeholder='title'
                                            onChange={(e: React.FormEvent) => handleChangeEditCreate(e.target)}
                                            value={currentEditCard.title}
                                        />
                                        <input
                                            name='desc'
                                            required
                                            placeholder='desc'
                                            onChange={(e: React.FormEvent) => handleChangeEditCreate(e.target)}
                                            value={currentEditCard.desc}
                                        />
                                        <input
                                            value={currentEditCard?.file?.name || currentEditCard.file || ''}
                                            readOnly
                                        />
                                        <input
                                            name='file'
                                            type='file'
                                            defaultValue={''}
                                            placeholder='file'
                                            onChange={(e: React.FormEvent) => handleChangeEditCreate(e.target)}
                                        />
                                        <input
                                            name='timer'
                                            placeholder='timer'
                                            onChange={(e: React.FormEvent) => handleChangeEditCreate(e.target)}
                                            value={currentEditCard.timer! >= 0 ? currentEditCard.timer : ''}
                                            type='number'
                                        />
                                        <button type='submit'>Сохранить</button>
                                    </form>
                                    :
                                    <form className='modal_inner__createBlock' onSubmit={(e: React.FormEvent) => saveEdittedCreatedCard(e, newCard)}>
                                        <h3>Создать</h3>
                                        <input
                                            required
                                            name='title'
                                            placeholder='title'
                                            onChange={(e: React.FormEvent) => handleChangeEditCreate(e.target, true)}
                                        />
                                        <input
                                            required
                                            name='desc'
                                            placeholder='desc'
                                            onChange={(e: React.FormEvent) => handleChangeEditCreate(e.target, true)}
                                        />
                                        <input
                                            type='file'
                                            name='file'
                                            placeholder='file'
                                            onChange={(e: React.FormEvent) => handleChangeEditCreate(e.target, true)}
                                        />
                                        <input
                                            name='timer'
                                            placeholder='timer'
                                            onChange={(e: React.FormEvent) => handleChangeEditCreate(e.target, true)}
                                        />
                                        <button type='submit'>Создать</button>
                                    </form>
                            }
                        </div>
                    </div>
                </div>
            }
        </>

    );
}

export default Modal;
