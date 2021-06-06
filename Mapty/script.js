'use strict';

class Workout {
    date = new Date();
    id = (Date.now() + '').slice(-10);

    constructor(coords, duration, distance) {
        this.coords = coords;     // [lat, lng]
        this.duration = duration; // in km
        this.distance = distance; // in min
    }

    _setDescription() {
        // prettier-ignore
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
        this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
            months[this.date.getMonth()]
        } ${this.date.getDate()}`;
    }
}

class Running extends Workout {
    type = 'running';
    constructor(coords, duration, distance, cadence) {
        super(coords, duration, distance);
        this.cadence = cadence;
        this.calcPace();
        this._setDescription();
    }

    calcPace() {
        // distance/duration
        this.pace = this.distance / this.duration;
        return this.pace;
    }
}

class Cycling extends Workout {
    type = 'cycling';
    constructor(coords, duration, distance, elevationGain) {
        super(coords, duration, distance);
        this.elevationGain = elevationGain;
        this.calcSpeed();
        this._setDescription();
    }

    calcSpeed() {
        // km/h
        this.speed = this.distance / (this.duration / 60)
        return this.speed;
    }
}

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

// Application Architecture
class App {
    #map;
    #mapZoomLevel = 13;
    #mapEvent;
    #workouts = [];
    constructor() {
        // Get user position
        this._getPosition();

        // Get data from local storage
        this._getLocalStorage();

        // Attach event handlers
        form.addEventListener('submit', this._newWorkout.bind(this));
        inputType.addEventListener('change', this._toggleElevationField);
        containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
    }

    _getPosition() {
        if (!navigator.geolocation) {
            alert('The Browser could not determine your location.');
        } else {
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), this._error);
        }
    }

    _error() {
        alert('The permission for loaction is denied.');
    }

    _loadMap(position) {
        const {latitude} = position.coords;
        const {longitude} = position.coords;
        const coords = [latitude, longitude]
    
        this.#map = L.map('map').setView(coords, this.#mapZoomLevel);
    
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.fr/hot/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);
    
        // L.marker(coords).addTo(this.#map)
        //     .bindPopup('Your current location')
        //     .openPopup();
    
        // Handling clicks on map
        this.#map.on('click', this._showForm.bind(this))

        this.#workouts.forEach(work => {
            this._renderWorkoutMarker(work);
        })
    }

    _showForm(mapE) {
        this.#mapEvent = mapE;
        form.classList.remove('hidden');
        inputDistance.focus();
    }

    _hideForm() {
        // Empty the inputs
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';
        form.getElementsByClassName.display = 'none';
        form.classList.add('hidden');
        setTimeout(() => form.style.disply = 'grid', 1000);
    }

    _toggleElevationField() {
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    }

    _newWorkout(e) {
        e.preventDefault();

        // Validate form inputs
        const validInputs = (...inputs) => inputs.every(inp => Number.isFinite(inp));
        const allPositive = (...inputs) => inputs.every(inp => inp > 0);

        // Get data from the form
        const type = inputType.value;
        const distance = +inputDistance.value;
        const duration = +inputDuration.value;
        const { lat, lng } = this.#mapEvent.latlng;
        let workout;

        // If workout is running, create running object
        if(type === 'running') {
            const cadence = +inputCadence.value;
            // Check if data is valid
            if (!validInputs(distance, duration, cadence) || !allPositive(distance, duration, cadence))
                return alert('All inputs must be positive numbers.');
            
            workout = new Running([lat, lng], distance, duration, cadence);
        }

        // If workout is cycling, create cycling object
        if(type === 'cycling') {
            const elevation = +inputElevation.value;
            // Check if data is valid
            if (!validInputs(distance, duration, elevation) || !allPositive(distance, duration))
                return alert('All inputs must be positive numbers.');

            workout = new Cycling([lat, lng], distance, duration, elevation);
        }

        // Add new object to workout array
        this.#workouts.push(workout);

        // Render workout on the map as marker    
        this._renderWorkoutMarker(workout);

        // Render workout on the list
        this._renderWorkout(workout);

        // Clear form input fields
        this._hideForm();

        // Set local storage to all workouts
        this._setLocalStorage();
    }

    _renderWorkoutMarker(workout) {
        L.marker(workout.coords).addTo(this.#map)
        .bindPopup(L.popup({
            maxWidth: 250,
            minWidth: 100,
            autoClose: false,
            closeOnClick: false,
            className: `${workout.type}-popup`,
        }))
        .setPopupContent(`${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`)
        .openPopup();
    }

    _renderWorkout(workout) {
        let html = `
            <li class="workout workout--${workout.type}" data-id="${workout.id}">
                <h2 class="workout__title">${workout.description}</h2>
                <span class="edit__workout">Edit </span>
                <span class="delete__workout">Delete</span>
                <div class="workout__details">
                <span class="workout__icon">${
                    workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
                }</span>
                <span class="workout__value">${workout.distance}</span>
                <span class="workout__unit">km</span>
                </div>
                <div class="workout__details">
                <span class="workout__icon">⏱</span>
                <span class="workout__value">${workout.duration}</span>
                <span class="workout__unit">min</span>
                </div>
        `;
    
        if (workout.type === 'running')
            html += `
                <div class="workout__details">
                <span class="workout__icon">⚡️</span>
                <span class="workout__value">${workout.pace.toFixed(1)}</span>
                <span class="workout__unit">min/km</span>
                </div>
                <div class="workout__details">
                <span class="workout__icon">🦶🏼</span>
                <span class="workout__value">${workout.cadence}</span>
                <span class="workout__unit">spm</span>
                </div>
            </li>
            `;
    
        if (workout.type === 'cycling')
            html += `
                <div class="workout__details">
                <span class="workout__icon">⚡️</span>
                <span class="workout__value">${workout.speed.toFixed(1)}</span>
                <span class="workout__unit">km/h</span>
                </div>
                <div class="workout__details">
                <span class="workout__icon">⛰</span>
                <span class="workout__value">${workout.elevationGain}</span>
                <span class="workout__unit">m</span>
                </div>
            </li>
            `;
        form.insertAdjacentHTML('afterend', html);
    }

    _moveToPopup(e) {
        const workoutEl = e.target.closest('.workout');
        // If clicked outside list items
        if (!workoutEl) return;

        if (e.target.className === 'delete__workout') {
            this.#workouts = this.#workouts.filter(work => work.id !== workoutEl.dataset.id);
            workoutEl.remove();
            this._setLocalStorage();
            return;
        }

        const workout = this.#workouts.find(work => work.id === workoutEl.dataset.id);

        this.#map.setView(workout.coords, this.#mapZoomLevel, {
            animate: true,
            pan: {
                duration: 1,
            },
        })
    }

    _setLocalStorage() {
        localStorage.setItem('workouts', JSON.stringify(this.#workouts));
    }

    _getLocalStorage() {
        const data = JSON.parse(localStorage.getItem('workouts'));
        
        if (!data) return;

        this.#workouts = data;

        this.#workouts.forEach(work => {
            this._renderWorkout(work);
        })

    }

    reset() {
        localStorage.removeItem('workouts');
        location.reload();
    }
}

const app = new App();






