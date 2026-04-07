import { useEffect, useState } from 'react'
import personService from './services/persons'

const Notification = ({ message, type }) => {
  	if (!message) return null

  	const style = {
    	color: type === 'error' ? 'red' : 'green',
    	background: 'lightgrey',
    	fontSize: 16,
    	borderStyle: 'solid',
    	borderRadius: 5,
    	padding: 10,
    	marginBottom: 10,
  	}

  	return <div style={style}>{message}</div>
}

const App = () => {
  	const [persons, setPersons] = useState([]) 

	const [notification, setNotification] = useState({ message: null, type: null })

	useEffect(() => {
		personService
    		.getAll()
    		.then(response => {
      			setPersons(response.data)
    		})
	}, [])

  	const [newName, setNewName] = useState('')
	const [newNumber, setNewNumber] = useState('')
	const [filter, setFilter] = useState('')

  	const handleNameChange = (event) => {
    	setNewName(event.target.value)
  	}

	const handleNumberChange = (event) => {
		setNewNumber(event.target.value)
	}

	const handleFilterChange = (event) => {
		setFilter(event.target.value)
	}

	const addPerson = (event) => {
		event.preventDefault()

		const personObj = {
			name: newName,
			number: newNumber
		}

		const existingPerson = persons.find(p => p.name === newName)
		
		if (existingPerson) {
			alert(`${existingPerson.name} is already added to phonebook`)
			return
		}

		personService
    		.create(personObj)
    		.then(response => {
      			setPersons(persons.concat(response.data))
      			setNewName('')
      			setNewNumber('')

				setNotification({ message: `Added ${response.data.name}`, type: 'success' })
    			setTimeout(() => setNotification({ message: null, type: null }), 5000)
    		})
			.catch(error => {
      			setNotification({
        			message: error.response.data.error,
        			type: 'error'
      			})
      			setTimeout(() => setNotification({ message: null, type: null }), 5000)
    		})
	}
	
	const deletePerson = (id, name) => {
		if (window.confirm(`Delete ${name}?`)) {
			personService.remove(id)
				.then(() => {
					setPersons(persons.filter(person => person.id !== id))

					setNotification({ message: `Deleted ${name}`, type: 'success' })
    				setTimeout(() => setNotification({ message: null, type: null }), 5000)
				})
				.catch(error => {
    				setNotification({ message: `Error: '${name}' was already removed from server`, type: 'error' })
    				setPersons(persons.filter(p => p.id !== id))
    				setTimeout(() => setNotification({ message: null, type: null }), 5000)

    				console.error(error)
      			})
		}
	}

	const showFiltered = persons.filter(person => 
		person.name.toLowerCase().includes(filter.toLowerCase())
	)
	


	return (
    	<div>
      		<h2>Phonebook</h2>
			<Notification message={notification.message} type={notification.type} />
			<div>
				Filter shown with: <input 
					value={filter} 
					onChange={handleFilterChange}
				/>
			</div>
			<h2>add a new person</h2>
      		<form onSubmit={addPerson}>
        		<div>
          			name: <input value={newName} onChange={handleNameChange}/>
        		</div>
				<div>
					Number: <input value={newNumber} onChange={handleNumberChange}/>
				</div>
        		<div>
          			<button type="submit">add</button>
        		</div>
      		</form>
      		<h2>Numbers</h2>
      
      		<ul>
  				{showFiltered.map(person => (
    				<li key={person.id}>
      					{person.name} {person.number} 
      					<button onClick={() => deletePerson(person.id, person.name)}>
        					delete
      					</button>
    				</li>
  				))}
			</ul>
    	</div>
  	)

}

export default App