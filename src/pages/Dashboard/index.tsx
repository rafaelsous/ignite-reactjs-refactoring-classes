import { useEffect, useState } from 'react'

import { Food } from '../../components/Food'
import { Header } from '../../components/Header'
import { ModalAddFood } from '../../components/ModalAddFood'
import { ModalEditFood } from '../../components/ModalEditFood'

import api from '../../services/api'

import { FoodsContainer } from './styles'

interface IFoodResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  image: string;
}

type IFoodRequest = Omit<IFoodResponse, 'id' | 'available'>

export function Dashboard() {
  const [foods, setFoods] = useState<IFoodResponse[]>([])
  const [editingFood, setEditingFood] = useState({} as IFoodResponse)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    async function loadFoods() {
      await api.get('foods')
        .then(response => setFoods(response.data))
    }

    loadFoods()
  }, [])

  async function handleAddFood(food: IFoodRequest) {
    try {
      await api.post('/foods', {
        ...food,
        available: true,
      }).then(response => setFoods([...foods, response.data]))
    } catch (err) {
      console.log(err)
    }
  }

  async function handleUpdateFood(food: IFoodRequest) {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      ).then(response => response.data)

      console.log(foodUpdated)

      setFoods(foods.map(f =>
        f.id !== foodUpdated.id ? f : foodUpdated,
      ))
    } catch (err) {
      console.log(err)
    }
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`)

    setFoods(foods.filter(food => food.id !== id))
  }

  function toggleModal() {
    setIsModalOpen(!isModalOpen)
  }

  function toggleEditModal() {
    setIsEditModalOpen(!isEditModalOpen)
  }

  function handleEditFood (food: IFoodResponse) {
    setEditingFood(food);
    toggleEditModal()
  }

  return (
    <>
      <Header openModal={toggleModal} />

      <ModalAddFood
        isOpen={isModalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />

      <ModalEditFood
        isOpen={isEditModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={() => handleDeleteFood(food.id)}
              handleEditFood={() => handleEditFood(food)}
            />
          ))}
      </FoodsContainer>
    </>
  )
}
