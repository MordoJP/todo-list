new Vue({
    el: '#app',
    vuetify: new Vuetify({
        theme: {
            themes: {
                light: {
                    primary: '#4DB6AC',
                    error: '#D84315',
                },
                dark: {
                    primary: '#004D40',
                    error: '#FFB300',
                },
            },
        },
    }),
    data: () => ({
        show: true,
        taskTitle: '',
        todos: []
    }),
    created() {
        const query = `
            query {
                getTodos {
                    id title done createdAt updatedAt
                }
            }
        `

        fetch('/graphql', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ query })
        })
            .then(res => res.json())
            .then(response => {
                this.todos = response.data.getTodos
            })
    },
    methods: {
        addTask () {
            const title = this.taskTitle.trim()
            if (!title) {
                return
            }
            const query = `
                mutation {
                    addTask(todo: {title: "${ title }"}) {
                        id title done createdAt updatedAt
                    }
                }
            `
            fetch('/graphql', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ query })
            })
                .then(res => res.json())
                .then(response => {
                    const todo = response.data.createTodo
                    this.todos.push(todo)
                    this.taskTitle = ''
                })
                .catch(e => console.log(e))
        },
        removeTask (id) {
            const query = `
                mutation {
                    removeTask(id: "${id}")
                }
            `
            fetch('/graphql', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ query })
            })
                .then(() => {
                    this.todos = this.todos.filter(task => task.id !== id)
                })
                .catch(e => console.log(e))
        },
        completeTask(id) {
            const query = `
                mutation {
                    completeTask(id: "${id}") {
                        updatedAt
                    }
                }
            `

            fetch('/graphql', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ query })
            })
                .then(res => res.json())
                .then(response => {
                    const idx = this.todos.findIndex(t => t.id === id)
                    this.todos[idx].updatedAt = response.data.completeTask.updatedAt
                })
                .catch(e => console.log(e))
        }
    },
    filters: {
        capitalize(value) {
            return value.toString().charAt(0).toUpperCase() + value.slice(1)
        },
        date(value, withTime) {
            const options = {
                year: 'numeric',
                month: 'long',
                day: '2-digit'
            }

            if (withTime) {
                options.hour = '2-digit'
                options.minute = '2-digit'
                options.second = '2-digit'
            }
            return new Intl.DateTimeFormat('ru-RU', options).format(new Date(+value))
        }
    }
})
