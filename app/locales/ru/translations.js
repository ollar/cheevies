export default {
  login: {
    buttons: {
      submit: 'Войти',
      register: 'Регистрация',
    },
    title: 'Логин',
  },

  register: {
    buttons: {
      login: 'Войти',
      submit: 'Регистрация',
    },
    title: 'Регистрация',
  },

  form: {
    name: {
      label: 'Имя',
      placeholder: 'Укажите имя',
    },
    email: {
      label: 'Email',
      placeholder: 'Укажите email',
    },
    password: {
      label: 'Пароль',
      placeholder: 'Укажите пароль',
    },
  },
  messages: {
    welcome_default: 'С возвращением!',
    welcome_google: 'Все утекло в ФСБ',
    welcome_github: 'Форкаю репы',
    delete_cheevie_check: 'Действительно удалить?',
  },

  buttons: {
    submit: 'Ок',
    cancel: 'Отмена',
    back: 'Назад',
    edit: 'Изменить',
    sign_out: 'Выйти',
    delete: 'Удалить',
  },

  'create-cheevie': {
    title: 'Создание ачивки',
    subtitle: 'Придумай крутую ачивку',
    form: {
      name: {
        label: 'Название ачивки',
        placeholder: 'Укажи название ачивки',
      },
      description: {
        label: 'Описание ачивки',
        placeholder: 'Укажи описание ачивки',
      },
      power: {
        label: 'Цвет ачивки',
        green: 'Зеленый',
        yellow: 'Желтый',
        red: 'Красный',
      },
    }
  },

  profile: {
    buttons: {
      'give-cheevie': 'Вручить ачивку',
    },
    links: {
      'refuse_gift': 'Отказаться'
    },
  },

  nav: {
    home: 'На главную',
    profile: 'Профиль',
  },

  index: {
    'users-list': {
      title: 'Участники',
    },
    'cheevies-list': {
      title: 'Ачивки',
    },
    'create-cheevie': {
      linkText: 'Создать ачивку',
    },
  },
};
