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
        fetch('/api/todo', {
            method: 'get'
        })
            .then(res => res.json())
            .then(todos => {
                this.todos = todos
            })
            .catch(e => console.log(e))
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
            this.todos = this.todos.filter(task => task.id !== id)
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
            return new Intl.DateTimeFormat('ru-RU', options).format(new Date(value))
        }
    }
})
