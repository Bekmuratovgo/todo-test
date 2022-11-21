
export interface InitialState {
    todos: [],
    isOpen: boolean,
    loading: boolean,
    editCurrentCard: null,
    isChecked: boolean,
    time: null
}

export interface ITodo {
    title: string,
    desc: string,
    timer?: number | null,
    file?: any,
    isChecked?: boolean,
    id?: string
}
