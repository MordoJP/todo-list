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
                console.log(response)
                this.todos = response.data.getTodos
            })
    },
    methods: {
        addTask () {
            const title = this.taskTitle.trim()
            if (!title) {
                return
            }
            fetch('/api/todo', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({title})
            })
                .then(res => res.json())
                .then(({todo}) => {
                    this.todos.push(todo)
                    this.taskTitle = ''
                })
                .catch(e => console.log(e))
        },
        removeTask (id) {
            fetch('/api/todo/' + id, {
                method: 'delete'
            })
                .then(() => {
                    this.todos = this.todos.filter(task => task.id !== id)
                })
                .catch(e => console.log(e))
        },
        completeTask(id) {
            fetch('/api/todo/' + id, {
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({done: true})
            })
                .then(res => res.json())
                .then(({todo}) => {
                    const idx = this.todos.findIndex(t => t.id === todo.id)
                    this.todos[idx].updatedAt = todo.updatedAt
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
