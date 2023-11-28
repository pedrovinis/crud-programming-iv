import React, { useCallback, useEffect, useState } from "react"
import "./App.css"
import Axios from "axios"

const BACKEND_URL = "http://localhost:3001"

const defaultValues = {
  id: "",
  model: "",
  automaker: "",
  power: "",
  year: "",
  value: "",
}

export default function App() {
  const [values, setValues] = useState(defaultValues)
  const [editVehicleId, setEditVehicleId] = useState("")
  const [vehicles, setVeihicles] = useState([])

  const isEditing = !!editVehicleId

  const clearInputs = useCallback(() => {
    setValues(defaultValues)
  }, [])

  const handleRegisterVehicle = (e) => {
    e.preventDefault()

    Axios.post(`${BACKEND_URL}/register`, values).finally(() => {
      setVehicles((prev) => [...prev, values])
    })

    clearInputs()
  }

  useEffect(() => {
    Axios.get(`${BACKEND_URL}/getVehicles`).then((response) => {
      setVehicles(response.data)
    })
  }, [])

  const handleOnChangeValue = (value) => {
    setValues((prevValues) => ({
      ...prevValues,
      [value.target.name]: value.target.value,
    }))
  }

  const onSaveEdit = () => {
    Axios.put(`${BACKEND_URL}/edit`).then(() => {
      const vehicleIndex = vehicles.findIndex((vehicle) => vehicle.id === editVehicleId)
      vehicles[vehicleIndex] = values

      setVehicles([...vehicles])
      clearInputs()
    })
  }

  const onEditVehicle = (id) => {
    const values = vehicles.find((vehicle) => vehicle.id === id)
    setValues(values)
    setEditVehicleId(id)
  }

  const onCancelEdit = () => {
    setEditVehicleId("")
    clearInputs()
  }

  const onDelete = (id) => {
    const hasConfirmed = confirm(`Are you sure you wanna delete vehicle with id '${id}'?`)
    if (!hasConfirmed) return

    Axios.delete(`${BACKEND_URL}/delete/${id}`)

    const newVehiCles = vehicles.filter((vehicle) => vehicle.id !== id)
    setVehicles([...newVehicles])

    if (editVehicleId === id) {
      onCancelEdit()
    }
  }

  return (
    <div className='page'>
      <form className='form' onSubmit={handleRegisterVehicle}>
        <h1 className='form-title'>Vehicle Registration</h1>
        <input
          className='input'
          name='id'
          placeholder='ID'
          required
          minLength={7}
          maxLength={7}
          disabled={isEditing}
          value={values.id}
          onChange={handleOnChangeValue}
        />
        <input className='input' name='model' placeholder='Model' required onChange={handleOnChangeValue} value={values.model} />
        <input
          type='number'
          name='year'
          className='input'
          min={1960}
          max={new Date().getUTCFullYear() + 1}
          placeholder='Year'
          required
          onChange={handleOnChangeValue}
          value={values.year}
        />
        <select className='input' name='automaker' defaultValue='' onChange={handleOnChangeValue} value={values.automaker}>
          <option defaultChecked disabled>
            Automaker
          </option>
          <option value='Audi'>Audi</option>
          <option value='BMW'>BMW</option>
          <option value='Porsche'>Porsche</option>
          <option value='Mercedes'>Mercedes</option>
          <option value='Volkswagen'>Volkswagen</option>
        </select>
        <input
          type='number'
          name='power'
          className='input'
          min={0}
          placeholder='Power HP'
          required
          onChange={handleOnChangeValue}
          value={values.power}
        />
        <input
          type='number'
          name='value'
          className='input'
          min={0}
          placeholder='Value ($)'
          step={0.01}
          required
          onChange={handleOnChangeValue}
          value={values.value}
        />
        {isEditing ? (
          <>
            <button
              type='submit'
              className='submitButton'
              onClick={(e) => {
                e.preventDefault()
                onSaveEdit()
              }}
            >
              Save
            </button>
            <button
              className='submitButton'
              onClick={(e) => {
                e.preventDefault()
                onCancelEdit()
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <button type='submit' className='submitButton'>
            Register
          </button>
        )}
      </form>
      <div className='cardsContainer'>
        {vehicles.map(({ id, automaker, model, power, year, value }, index) => (
          <div key={index} className='card'>
            <div className='cardId'>{id}</div>
            <div className='cardData'>
              <div className='cardTitle'>
                {automaker} - {model}
              </div>
              <div className='cardPower'>{power}HP</div>
              <div className='cardYear'>{year}</div>
              <div className='cardPrice'>${Number(value).toFixed(2)}</div>

              <div className='cardButtonsContainer'>
                <button className='cardEdit' onClick={() => onEditVehicle(id)}>
                  Edit
                </button>
                <button className='cardDelete' onClick={() => onDelete(id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
