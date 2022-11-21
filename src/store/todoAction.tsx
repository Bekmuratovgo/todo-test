import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { todoSlice } from "./todoSlice";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { ITodo } from "../interface";

const todosCollectionRef = collection(db, 'todo');
const storage = getStorage();

const todoDoc = (id: string) => {
  return doc(db, 'todo', id);
}

/**
 * @function toggleModalVisible - нужен для переключении модалки
 * @param val -переключатель модалки: visible or none
 * @returns 
 */
export const toggleModalVisible = (val: boolean) => async (dispatch: any) => {
  await dispatch(todoSlice.actions.setModalToggle(val));
}

/**
 * @function getAllTodos -возвращает все Todo
 * Сначала мы делаем Loading true-чтобы включить loader, потом запрос идет и сетается в стейт. Потом Loading false-ставим чтобы отключить Loader component
 * @returns 
 */
export const getAllTodos = () => async (dispatch: any) => {
  await dispatch(todoSlice.actions.setLoading(true));

  const { docs } = await getDocs(todosCollectionRef);
  const res = docs.map((doc: any) => ({ ...doc.data(), id: doc.id }));

  await dispatch(todoSlice.actions.setAllTodos(res));
  await dispatch(todoSlice.actions.setLoading(false));
}

/**
 * @function createTodo- создает todo. Работает по аналогии getAllTodos функция
 * @param item -новая todo ктр мы хотим создать
 * @returns 
 */
export const createTodo = (item: ITodo) => async (dispatch: any) => {
  await dispatch(todoSlice.actions.setLoading(true));

  let data;
  const storageRef = ref(storage, `img/${item.file.name}`)
  const uploadTask = uploadBytesResumable(storageRef, item.file);

  uploadTask.on('state_changed', async (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
    data = await { ...item, file: downloadURL };

    if (progress === 100) { // if 100% done
      await addDoc(todosCollectionRef, data);
      await getAllTodos()(dispatch);
      await dispatch(todoSlice.actions.setLoading(false));
    }
  }
  );
}

/**
 * @function updateTodoРаботает по аналогии createTodo
 * @param id -текущего todo ктрго хотим отредактировать
 * @param editItem -текущий todo объект
 * @returns 
 */
export const updateTodo = (id: string, editItem: ITodo) => async (dispatch: any) => {
  await dispatch(todoSlice.actions.setLoading(true));

  let data;
  const storageRef = ref(storage, `img/${editItem.file.name}`)
  const uploadTask = uploadBytesResumable(storageRef, editItem.file);

  uploadTask.on('state_changed', async (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    
    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
    data = { ...editItem, file: downloadURL };

    if (progress === 100 || isNaN(progress)) { // if 100% done      
      await updateDoc(todoDoc(id), data);
      await getAllTodos()(dispatch);
      await dispatch(todoSlice.actions.setLoading(false));
    }
  });

}

/**
 * @function deleteTodo - удаляет todo
 * @param id -текущий id todo
 * @returns 
 */
export const deleteTodo = (id: string) => async (dispatch: any) => {
  await dispatch(todoSlice.actions.setLoading(true));

  await deleteDoc(todoDoc(id));
  await getAllTodos()(dispatch);

  await dispatch(todoSlice.actions.setLoading(false))
}

/**
 * @function todoChecked -нужен для того чтобы отмечать выполнение todo, например: isChecked-true это значит todo выполнено и визуально видно что он выполнен
 * @param val -переключает значение isChecked
 * @param item - текущий todo
 * @returns 
 */
export const todoChecked = (val: boolean, item: ITodo) => async (dispatch: any) => {
  await dispatch(todoSlice.actions.setLoading(true));

  const data = {
    ...item,
    isChecked: val,
  }
  
  await updateDoc(todoDoc(item.id!), data);
  await dispatch(todoSlice.actions.setChecked(val));
  await getAllTodos()(dispatch);

  await dispatch(todoSlice.actions.setLoading(false))
}