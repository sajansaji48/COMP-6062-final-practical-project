const app = Vue.createApp({
    data() {
        return {
            user: {
                fullName: '',
                age: '',
                picture: ''
            },
            weatherData: {
                city: 'London',
                province: 'Ontario',
                country: 'Canada',
                temp: '',
                wind: '',
                description: ''
            },
            dictionary: {
                word: 'example',
                phonetics: '',
                definition: ''
            },
            dictionaryInput: 'example'
        };
    },
    methods: {
        fetchUser: function () {
            fetch('http://comp6062.liamstewart.ca/random-user-profile')
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        console.log('An error occurred. Please try again');
                    }
                })
                .then(data => {
                    this.user = {
                        fullName: `${data.first_name} ${data.last_name}`,
                        age: data.age,
                        picture: data.profile_picture
                    };
                })
                .catch(error => console.error('fetching user: error', error));
        },

        fetchWeather: function () {
            const url = `http://comp6062.liamstewart.ca/weather-information?city=${this.weatherData.city}&province=${this.weatherData.province}&country=${this.weatherData.country}`;
            fetch(url)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        console.log('An error occurred. Please try again');
                    }
                })
                .then(data => {
                    this.weatherData = {
                        city: data.location.city,
                        province: data.location.region,
                        country: data.location.country,
                        temp: data.temperature,
                        wind: data.wind_speed,
                        description: data.weather_description
                    };
                })
                .catch(error => console.error('fetching weather: error', error));
        },

        fetchDefinition: function () {
            if (!this.dictionaryInput) {
                alert("Enter a word.");
                return;
            }

            fetch(`https://comp6062.liamstewart.ca/define?word=${this.dictionaryInput}`)
                .then(response => {
                    if (response.ok) return response.json();
                    throw new Error('Error occurred while fetching definition');
                })
                .then(data => {
                    const define = data[0];
                    this.dictionary.word = define.word || this.dictionaryInput;
                    this.dictionary.phonetics = define.phonetic || 'N/A';
                    this.dictionary.definition = Array.isArray(define.definition)
                        ? define.definition[0]
                        : define.definition || 'Definition is not found.';
                })
                .catch(error => {
                    console.error('Definition Fetch error:', error);
                    this.dictionary.word = this.dictionaryInput;
                    this.dictionary.phonetics = 'N/A';
                    this.dictionary.definition = 'Undefined.';
                });
        }
    },

    created: function () {
        this.fetchUser();
        this.fetchWeather();
        this.fetchDefinition();
    }
});

app.mount('#app');
