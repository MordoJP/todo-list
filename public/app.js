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
    methods: {
        addTask () {
            const title = this.taskTitle.trim()
            if (!title) {
                return
            }
            this.todos.push({
                title: title,
                date: new Date(),
                id: Math.random(),
                done: false
            })
            this.taskTitle = ''
        },
        removeTask (id) {
            this.todos = this.todos.filter(task => task.id !== id)
        }
    },
    filters: {
        capitalize(value) {
            return value.toString().charAt(0).toUpperCase() + value.slice(1)
        },
        date(value) {
            return new Intl.DateTimeFormat('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: '2-digit'
            }).format(new Date(value))
        }
    }
})
