import { v4 as uuidv4 } from 'uuid';
import { useHttp } from '../../hooks/http.hook';
import { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { heroCreated } from '../heroesList/heroesSlice';
import { selectAll } from '../heroesFilters/filtersSlice';
import store from '../../store';

const HeroesAddForm = () => {
    const [name, setName] = useState('')
    const [textArea, setTextArea] = useState('')
    const [checkbox, setCheckbox] = useState(null)

    const { filtersLoadingStatus } = useSelector(state => state.filters);
    const filters = selectAll(store.getState())
    const dispatch = useDispatch()
    const { request } = useHttp()

    const onSubmitHandler = (e) => {
        e.preventDefault()
        // Можно сделать и одинаковые названия состояний,
        // хотел показать вам чуть нагляднее
        // Генерация id через библиотеку

        const newObj = {
            id: uuidv4(),
            name: name,
            description: textArea,
            element: checkbox
        }

        // Отправляем данные на сервер в формате JSON
        // ТОЛЬКО если запрос успешен - отправляем персонажа в store

        request('http://localhost:3001/heroes', 'POST', JSON.stringify(newObj))
            .then(dispatch(heroCreated(newObj)))
            .catch(err => console.log(err))
        
        // Очищаем форму после отправки
        setName('')
        setTextArea('')
        setCheckbox('')
    }

    const renderFilters = (filters, status) => {
        if (status === "loading") {
            return <option>Загрузка элементов</option>
        } else if (status === "error") {
            return <option>Ошибка загрузки</option>
        }
        
        // Если фильтры есть, то рендерим их
        if (filters && filters.length > 0 ) {
            return filters.map(({name, label}) => {
                // Один из фильтров нам тут не нужен
                // eslint-disable-next-line
                if (name === 'all') return;

                return <option key={name} value={name}>{label}</option>
            })
        }
    }

    return (
        <form className="border p-4 shadow-lg rounded" onSubmit={onSubmitHandler}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    type="text"
                    name="name"
                    className="form-control"
                    id="name"
                    placeholder="Как меня зовут?" />
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    value={textArea}
                    onChange={(e) => setTextArea(e.target.value)}
                    required
                    name="text"
                    className="form-control"
                    id="text"
                    placeholder="Что я умею?"
                    style={{ "height": '130px' }} />
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select
                    select={checkbox}
                    onChange={e => setCheckbox(e.target.value)}
                    required
                    className="form-select"
                    id="element"
                    name="element">
                    <option >Я владею элементом...</option>

                    {renderFilters(filters, filtersLoadingStatus)}

                </select>
            </div>

            <button type="submit" className="btn btn-primary">Создать</button>
        </form>
    )
}

export default HeroesAddForm;